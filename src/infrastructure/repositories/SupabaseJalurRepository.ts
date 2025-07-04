import { createClient } from '@/utils/supabase/client';
import { IJalurRepository } from '@/domain/repositories/IJalurRepository';

export class SupabaseJalurRepository implements IJalurRepository {
  async getJalurByGunungId(gunungId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Jalur')
      .select('*')
      .eq('gunungId', gunungId)
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }
}
