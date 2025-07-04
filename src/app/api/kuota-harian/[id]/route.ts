import { NextResponse } from 'next/server';
import { SupabaseKuotaHarianRepository } from '@/infrastructure/repositories/SupabaseKuotaHarianRepository';
import { GetKuotaHarianByGunungIdUseCase } from '@/application/use-cases/GetKuotaHarianByGunungIdUseCase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const jalurId = searchParams.get('jalurId') || undefined;
    const date = searchParams.get('date') || undefined;
    const kuotaHarianRepository = new SupabaseKuotaHarianRepository();
    const getKuotaHarianByGunungIdUseCase = new GetKuotaHarianByGunungIdUseCase(kuotaHarianRepository);
    const quotas = await getKuotaHarianByGunungIdUseCase.execute(id, jalurId, date);
    return NextResponse.json({
      success: true,
      quotas
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch kuota harian' }, { status: 500 });
  }
}