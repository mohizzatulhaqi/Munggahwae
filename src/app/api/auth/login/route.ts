import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAuthRepository } from '@/infrastructure/repositories/SupabaseAuthRepository';
import { LoginUseCase } from '@/application/use-cases/LoginUseCase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }
    const authRepository = new SupabaseAuthRepository();
    const loginUseCase = new LoginUseCase(authRepository);
    const { data, error } = await loginUseCase.execute(email, password);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || 'Login gagal' },
        { status: 401 }
      );
    }
    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}