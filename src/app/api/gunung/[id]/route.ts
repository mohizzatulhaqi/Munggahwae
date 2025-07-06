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
    nama: gunung.nama,
    deskripsi: gunung.deskripsi,
    urlGambar: gunung.urlGambar,
    galeriGunung: gunung.GaleriGunung?.map((g: any) => g.imageUrl),
    status: gunung.status,
    kuota: gunung.kuota,
    harga: gunung.harga,
    hargaPerOrang: gunung.hargaPerOrang,
    kuotaPerHari: gunung.kuotaPerHari,
    lokasi: gunung.lokasi,
    provinsi: gunung.provinsi,
    jalur: gunung.Jalur?.map((j: any) => ({
      id: j.id,
      name: j.name,
      description: j.description,
      difficultyLevel: j.difficultyLevel,
      estimatedDurationHours: j.estimatedDurationHours,
      icon: j.icon,
      status: j.status,
      quota: j.kuota,
      hargaPerOrang: j.hargaPerOrang,
    })) || [],
    peraturan: gunung.Peraturan || [],
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