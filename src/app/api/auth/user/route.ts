import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAuthRepository } from '@/infrastructure/repositories/SupabaseAuthRepository';
import { GetUserAuthUseCase } from '@/application/use-cases/GetUserAuthUseCase';

export async function GET(request: NextRequest) {
  try {
    const authRepository = new SupabaseAuthRepository();
    const getUserAuthUseCase = new GetUserAuthUseCase(authRepository);
    const { data, error } = await getUserAuthUseCase.execute();
    if (error || !data.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}