import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/mountains/[id]
// Mendapatkan detail satu gunung berdasarkan ID
export async function GET(request: Request, { params }: Params) {
  const { id } = params;
  const supabase = createClient();

  const { data: mountain, error } = await supabase
    .from('mountains')
    .select('*')
    .eq('id', id)
    .single(); // .single() untuk mendapatkan satu objek, bukan array

  if (error) {
    console.error(`Error fetching mountain with id ${id}:`, error);
    // Jika .single() tidak menemukan data, ia akan mengembalikan error
    // Kita bisa cek message error untuk memberikan respons 404
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Mountain not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch mountain' }, { status: 500 });
  }

  if (!mountain) {
    return NextResponse.json({ error: 'Mountain not found' }, { status: 404 });
  }

  return NextResponse.json(mountain);
} 