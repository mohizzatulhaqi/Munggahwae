import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function POST(req: NextRequest) {
  const { nama, kuota, jalur, deskripsi, gambar, harga } = await req.json();
  if (!nama || !kuota || !jalur || !deskripsi || !gambar || !harga) {
    return NextResponse.json({ success: false, message: 'Data tidak lengkap' }, { status: 400 });
  }
  const { data, error } = await supabase.from('gunung').insert([
    { nama, kuota, jalur, deskripsi, gambar, harga }
  ]).select();
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, gunung: data?.[0] }, { status: 201 });
} 