import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, kuota, harga, deskripsi, provinsi, lokasi, kuotaPerHari, hargaPerOrang } = body;

    
    if (!nama || !kuota || !harga || !deskripsi) {
      return NextResponse.json({
        success: false,
        message: 'Data tidak lengkap. Nama, kuota, harga, deskripsi, dan gambar wajib diisi.'
      }, { status: 400 });
    }

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

    const { data, error } = await supabase
      .from('Gunung') // pastikan lowercase
      .insert([
        {
          nama: nama,
          kuota: Number(kuota),
          harga: Number(harga),
          deskripsi: deskripsi,
          provinsi: provinsi || '',
          lokasi: lokasi || '',
          urlGambar: '',
          status: 'aktif',
          kuotaPerHari: Number(kuotaPerHari),
          hargaPerOrang: Number(hargaPerOrang),

         
        }
      ])
      .select();

    

    return NextResponse.json({
      success: true,
      message: 'Gunung berhasil ditambahkan',
      gunung: data?.[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Terjadi kesalahan internal server'
    }, { status: 500 });
  }
}
