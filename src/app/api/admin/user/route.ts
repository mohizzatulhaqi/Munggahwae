import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    // Ambil email dari query parameter
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email wajib diisi',
      }, { status: 400 });
    }

    // Cari user dengan role = 'admin' dan email yang cocok
    const { data: adminData, error } = await supabase
      .from('Pengguna')
      .select('namaLengkap, email')
      .eq('email', email)
      .eq('role', 'admin')
      .single();

    if (error || !adminData) {
      return NextResponse.json({
        success: false,
        message: 'Admin tidak ditemukan atau bukan admin',
      }, { status: 404 });
    }

    // Return data admin
    return NextResponse.json({
      success: true,
      admin: {
        nama: adminData.namaLengkap,
        email: adminData.email,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server',
    }, { status: 500 });
  }
}
