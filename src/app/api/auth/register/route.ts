import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { email, password, namaLengkap, phoneNumber } = await request.json();

    if (!email || !password || !namaLengkap) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email, password, dan nama lengkap harus diisi' 
        }, 
        { status: 400 }
      );
    }

    // 1. Register user dengan Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nama_lengkap: namaLengkap,
          phone_number: phoneNumber,
        },
      },
    });

    if (authError) {
      console.error('Registration error:', authError);
      return NextResponse.json(
        { 
          success: false, 
          error: authError.message || 'Registrasi gagal' 
        }, 
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gagal membuat user' 
        }, 
        { status: 500 }
      );
    }

    // 2. Insert data user ke tabel users
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        nama_lengkap: namaLengkap,
        email: email,
        phone_number: phoneNumber,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Jika gagal membuat profile, hapus user yang sudah dibuat
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gagal membuat profil user' 
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      message: 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.',
    });

  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 