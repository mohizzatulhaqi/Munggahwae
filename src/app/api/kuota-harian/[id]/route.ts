import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const jalurId = searchParams.get('jalurId');
    const date = searchParams.get('date');

    let query = supabase
      .from('KuotaHarian')
      .select('*')
      .eq('gunungId', id)
      .order('date', { ascending: true });

    if (jalurId) {
      query = query.eq('jalurId', jalurId);
    }
    if (date) {
      query = query.eq('date', date);
    }

    const { data: quotas, error } = await query;

    // Fallback: jika tidak ada data di KuotaHarian, ambil kuotaPerHari dari Gunung
    if ((!quotas || quotas.length === 0) && date) {
      const { data: gunung, error: gunungError } = await supabase
        .from('Gunung')
        .select('id, kuotaPerHari')
        .eq('id', id)
        .single();

      if (gunung && gunung.kuotaPerHari) {
        return NextResponse.json({
          success: true,
          quotas: [
            {
              id: null,
              gunungId: id,
              date,
              totalQuota: gunung.kuotaPerHari,
              bookedQuota: 0,
              availableQuota: gunung.kuotaPerHari,
              status: 'default',
              createdAt: null,
            },
          ],
        });
      }
    }

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch kuota harian' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quotas: quotas || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch kuota harian' },
      { status: 500 }
    );
  }
} 