import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAuthRepository } from '@/infrastructure/repositories/SupabaseAuthRepository';
import { SupabaseHistoryRepository } from '@/infrastructure/repositories/SupabaseHistoryRepository';
import { GetUserHistoryUseCase } from '@/application/use-cases/GetUserHistoryUseCase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authRepository = new SupabaseAuthRepository();
    const { data: authData, error: authError } = await authRepository.getUser();
    const user = authData?.user;
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const historyRepository = new SupabaseHistoryRepository();
    const getUserHistoryUseCase = new GetUserHistoryUseCase(historyRepository);
    const history = await getUserHistoryUseCase.execute(user.id, status, search, page, limit);
    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error(' Error fetching history:', error); // ← Tambahkan ini
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
