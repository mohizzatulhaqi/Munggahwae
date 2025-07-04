import { createClient } from '@/utils/supabase/server';
import { IHistoryRepository } from '@/domain/repositories/IHistoryRepository';

export class SupabaseHistoryRepository implements IHistoryRepository {
  async getUserHistory(userId: string, status?: string, search?: string, page = 1, limit = 10) {
    const supabase = createClient();
    const offset = (page - 1) * limit;
    let query = supabase
      .from('Booking')
      .select(`*, Gunung (id, nama, lokasi, image_url)`)
      .eq('user_id', userId)
      .range(offset, offset + limit - 1);
    if (status) query = query.eq('status', status);
    if (search) query = query.or(`kode_booking.ilike.%${search}%,Gunung.nama.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
