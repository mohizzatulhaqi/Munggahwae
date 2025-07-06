import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Query detail gunung dengan relasi Jalur, GaleriGunung, dan Peraturan
    const { data: gunung, error } = await supabase
      .from('Gunung')
      .select(`*, Jalur(*), GaleriGunung(*), Peraturan(*)`)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Gunung not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching gunung:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch gunung' },
        { status: 500 }
      );
    }

    if (!gunung) {
      return NextResponse.json(
        { success: false, error: 'Gunung not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mountain: {
    id: gunung.id,
    name: gunung.nama,
    description: gunung.deskripsi,
    heroImage: gunung.heroImage,
    galleryImages: gunung.GaleriGunung?.map((g: any) => g.imageUrl),
    status: gunung.status,
    quota: gunung.Jalur?.reduce((acc: number, j: any) => acc + (j.kuota || 0), 0),
    hargaPerOrang: gunung.Jalur?.[0]?.hargaPerOrang || 0,
    trails: gunung.Jalur?.length,
    trailDetails: gunung.Jalur?.map((j: any) => ({
      id: j.id,
      name: j.nama,
      description: j.deskripsi,
      icon: j.icon,
      status: j.status,
      quota: j.kuota,
      hargaPerOrang: j.hargaPerOrang,
    })),
    }
  });
  } catch (error) {
    console.error('Error fetching gunung:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gunung' },
      { status: 500 }
    );
  }
} 