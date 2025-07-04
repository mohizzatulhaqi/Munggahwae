import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAuthRepository } from '@/infrastructure/repositories/SupabaseAuthRepository';
import { RegisterUseCase } from '@/application/use-cases/RegisterUseCase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, namaLengkap, phoneNumber } = await request.json();
    if (!email || !password || !namaLengkap) {
      return NextResponse.json(
        { success: false, error: 'Email, password, dan nama lengkap harus diisi' },
        { status: 400 }
      );
    }
    const authRepository = new SupabaseAuthRepository();
    const registerUseCase = new RegisterUseCase(authRepository);
    const { data, error } = await registerUseCase.execute(email, password, namaLengkap, phoneNumber);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || 'Registrasi gagal' },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      user: data.user,
      message: 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}