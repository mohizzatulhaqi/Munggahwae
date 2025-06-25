import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  // --- Parameters for Search and Pagination ---
  const searchQuery = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // --- Build Supabase Query ---
  let query = supabase.from('mountains').select('*', { count: 'exact' });

  // 1. Add search filter if 'search' parameter exists
  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }
  
  // 2. Add pagination
  query = query.range(from, to);
  
  // --- Execute Query ---
  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching mountains:', error);
    return NextResponse.json({ error: 'Failed to fetch mountains' }, { status: 500 });
  }

  return NextResponse.json({
    data,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Anda bisa menambahkan fungsi POST, PUT, DELETE di sini nanti
// untuk mengelola data gunung jika diperlukan. 