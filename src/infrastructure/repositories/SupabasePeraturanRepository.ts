import { createClient } from '@/utils/supabase/client';
import { IPeraturanRepository } from '@/domain/repositories/IPeraturanRepository';

export class SupabasePeraturanRepository implements IPeraturanRepository {
  async getPeraturanByGunungId(gunungId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Peraturan')
      .select('isi')
      .eq('gunungId', gunungId)
      .order('orderIndex', { ascending: true });
    if (error) throw error;
    return data;
  }
}
