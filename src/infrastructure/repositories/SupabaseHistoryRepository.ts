import { createClient } from '@/utils/supabase/server';
import { IHistoryRepository } from '@/domain/repositories/IHistoryRepository';

export class SupabaseHistoryRepository implements IHistoryRepository {
  async getUserHistory(userId: string, status?: string, search?: string, page = 1, limit = 10) {
    const supabase = createClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Booking')
      .select(`
        *,
        Gunung (
          id,
          nama,
          lokasi,
          provinsi,
          urlGambar
        )
      `)
      .eq('penggunaId', userId)
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.ilike('kode_booking', `%${search}%`);
    }

    const { data, error } = await query;

    // 🟡 Tambahkan debug log di sini
    console.log('Supabase query result:', { data, error });

    if (error) throw error;

    const filteredData = search
      ? data?.filter(item =>
          item?.Gunung?.nama?.toLowerCase().includes(search.toLowerCase())
        ) ?? []
      : data;

    return filteredData;
  }
}

