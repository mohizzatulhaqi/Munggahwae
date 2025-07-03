import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function POST(req: NextRequest) {
  const { email, password, fullName } = await req.json();
  if (!email || !password || !fullName) {
    return NextResponse.json({ success: false, message: 'Data tidak lengkap' }, { status: 400 });
  }
  // Register ke Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: 'admin' },
    },
  });
  if (error || !data.user) {
    return NextResponse.json({ success: false, message: error?.message || 'Gagal daftar' }, { status: 400 });
  }

  // Insert ke tabel User
  const { error: insertError } = await supabase.from('User').insert([
    {
      id: data.user.id,
      namaLengkap: fullName,
      email,
      password: '', // Jangan simpan plain password
      role: 'admin',
    },
  ]);
  if (insertError) {
    return NextResponse.json({ success: false, message: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: data.user }, { status: 201 });
} 