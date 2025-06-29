import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

function convertBigIntToString(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const searchQuery = searchParams.get('search');
    const provinsi = searchParams.get('provinsi');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build Supabase query
    let query = supabase
      .from('Gunung')
      .select(`*, Jalur(*), GaleriGunung(*)`, { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(from, to);

    if (searchQuery) {
      query = query.or(
        `nama.ilike.%${searchQuery}%,lokasi.ilike.%${searchQuery}%,provinsi.ilike.%${searchQuery}%`
      );
    }
    if (provinsi) {
      query = query.eq('provinsi', provinsi);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      mountains: convertBigIntToString(data),
      meta: {
        total: count ?? 0,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 1,
      },
    });
  } catch (error) {
    console.error('Error fetching gunung data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gunung data',
        mountains: [],
      },
      { status: 500 }
    );
  }
}
