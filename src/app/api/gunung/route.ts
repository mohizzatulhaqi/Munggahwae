import { NextResponse } from 'next/server';
import { CreateGunungUseCase } from '@/application/use-cases/CreateGunungUseCase';
import { SupabaseGunungRepository } from '@/infrastructure/repositories/SupabaseGunungRepository';
import { createClient } from '@/utils/supabase/client';

function convertBigIntToString(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const gunungRepository = new SupabaseGunungRepository();
    const createGunungUseCase = new CreateGunungUseCase(gunungRepository);
    const created = await createGunungUseCase.execute(body);
    if (!created) {
      return NextResponse.json({ status: 500, isCreated: false });
    }
    return NextResponse.json({ status: 200, isCreated: true, data: created });
  } catch (error) {
    return NextResponse.json({ status: 500, isCreated: false, error: (error as any)?.message || String(error) });
  }
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
      .order('nama', { ascending: true })
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
