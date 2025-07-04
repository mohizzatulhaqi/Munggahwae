import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function PUT(req: NextRequest) {
  const { id, nama, kuota, harga, deskripsi, provinsi, lokasi } = await req.json();
  
  if (!nama || !kuota || !harga || !deskripsi) {
    return NextResponse.json({ 
      success: false, 
      message: 'Data tidak lengkap. ID, nama, kuota, harga, deskripsi, dan gambar wajib diisi.' 
    }, { status: 400 });
  }

  // Validate numeric fields
  if (isNaN(Number(kuota)) || Number(kuota) <= 0) {
    return NextResponse.json({ 
      success: false, 
      message: 'Kuota harus berupa angka positif' 
    }, { status: 400 });
  }

  if (isNaN(Number(harga)) || Number(harga) <= 0) {
    return NextResponse.json({ 
      success: false, 
      message: 'Harga harus berupa angka positif' 
    }, { status: 400 });
  }

  try {
    // Update data gunung
    const { data, error } = await supabase
      .from('Gunung')
      .update({
        nama,
        kuota: Number(kuota),
        harga: Number(harga),
        deskripsi,
        provinsi: provinsi || '',
        lokasi: lokasi || '',
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        success: false, 
        message: error.message || 'Gagal mengupdate gunung' 
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Gunung tidak ditemukan' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Gunung berhasil diupdate',
      gunung: data[0] 
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Terjadi kesalahan internal server' 
    }, { status: 500 });
  }
} 