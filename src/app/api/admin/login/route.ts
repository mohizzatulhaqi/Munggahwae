import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const { data: allUsers, error: allUsersError } = await supabase.from('Gunung').select('*');
    console.log(allUsers);

    if (allUsersError) {
      return NextResponse.json({ success: false, message: 'Gagal mengambil data user.', detail: allUsersError.message }, { status: 500 });
    }

    const { data: userRow, error: userSelectError } = await supabase
      .from('Pengguna')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle();

    if (userSelectError) {
      return NextResponse.json({ success: false, message: 'Gagal cek user di tabel User.', detail: userSelectError.message }, { status: 500 });
    }

    console.log(userRow);

    if(!(userRow?.role === 'admin')){
      return NextResponse.json({ success: false, message: 'Anda tidak memiliki akses ke halaman ini.' }, { status: 403 });
    }

    // 5. Sukses
    return NextResponse.json({
      success: true,
      user: {
        id: userRow.id,
        email: userRow.email,
        role: userRow.role,
        namaLengkap: userRow.namaLengkap,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Server error', detail: err.message }, { status: 500 });
  }
}
