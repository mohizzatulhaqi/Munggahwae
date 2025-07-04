import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAuthRepository } from '@/infrastructure/repositories/SupabaseAuthRepository';
import { LogoutUseCase } from '@/application/use-cases/LogoutUseCase';

export async function POST(request: NextRequest) {
  try {
    const authRepository = new SupabaseAuthRepository();
    const logoutUseCase = new LogoutUseCase(authRepository);
    const { error } = await logoutUseCase.execute();
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || 'Logout gagal' },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Logout berhasil',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}