import { NextResponse } from 'next/server';
import { SupabaseJalurRepository } from '@/infrastructure/repositories/SupabaseJalurRepository';
import { GetJalurByGunungIdUseCase } from '@/application/use-cases/GetJalurByGunungIdUseCase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const jalurRepository = new SupabaseJalurRepository();
    const getJalurByGunungIdUseCase = new GetJalurByGunungIdUseCase(jalurRepository);
    const trails = await getJalurByGunungIdUseCase.execute(id);
    return NextResponse.json({
      success: true,
      trails: trails || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trails' },
      { status: 500 }
    );
  }
}
