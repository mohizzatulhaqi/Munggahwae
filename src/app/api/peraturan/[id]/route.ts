import { NextResponse } from 'next/server';
import { SupabasePeraturanRepository } from '@/infrastructure/repositories/SupabasePeraturanRepository';
import { GetPeraturanByGunungIdUseCase } from '@/application/use-cases/GetPeraturanByGunungIdUseCase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const peraturanRepository = new SupabasePeraturanRepository();
    const getPeraturanByGunungIdUseCase = new GetPeraturanByGunungIdUseCase(peraturanRepository);
    const peraturan = await getPeraturanByGunungIdUseCase.execute(id);
    return NextResponse.json({
      success: true,
      rules: peraturan
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch peraturan' },
      { status: 500 }
    );
  }
}