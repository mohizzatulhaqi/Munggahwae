import { createClient } from '@/utils/supabase/client';
import { IKuotaHarianRepository } from '@/domain/repositories/IKuotaHarianRepository';

export class SupabaseKuotaHarianRepository implements IKuotaHarianRepository {
  async getKuotaHarianByGunungId(gunungId: string, jalurId?: string, date?: string) {
    const supabase = createClient();
    let query = supabase
      .from('KuotaHarian')
      .select('*')
      .eq('gunungId', gunungId)
      .order('date', { ascending: true });
    if (jalurId) query = query.eq('jalurId', jalurId);
    if (date) query = query.eq('date', date);
    const { data: quotas, error } = await query;
    if (error) throw error;

    // Fallback: jika tidak ada data di KuotaHarian, ambil kuotaPerHari dari Gunung
    if ((!quotas || quotas.length === 0) && date) {
      const { data: gunung, error: gunungError } = await supabase
        .from('Gunung')
        .select('id, kuotaPerHari')
        .eq('id', gunungId)
        .single();
      if (gunung && gunung.kuotaPerHari) {
        return [
          {
            id: null,
            gunungId,
            date,
            totalQuota: gunung.kuotaPerHari,
            bookedQuota: 0,
            availableQuota: gunung.kuotaPerHari,
          },
        ];
      }
    }
    return quotas;
  }
}
