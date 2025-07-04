import { IGunungRepository } from '../../domain/repositories/IGunungRepository';
import { Gunung } from '../../domain/entities/Gunung';
import { createClient } from '../../utils/supabase/server';

export class SupabaseGunungRepository implements IGunungRepository {
  private supabase = createClient();

  async createGunung(data: any): Promise<any> {
    const { data: created, error } = await this.supabase.from('gunung').insert([data]).select().single();
    if (error) throw error;
    return created;
  }

  async findById(id: string): Promise<Gunung | null> {
    const { data, error } = await this.supabase.from('gunung').select('*').eq('id', id).single();
    if (error || !data) return null;
    return new Gunung(data);
  }

  async findAll(): Promise<Gunung[]> {
    const { data, error } = await this.supabase.from('gunung').select('*');
    if (error || !data) return [];
    return data.map((item: any) => new Gunung(item));
  }

  async save(gunung: Gunung): Promise<Gunung> {
    const { data, error } = await this.supabase.from('gunung').insert([gunung]).select().single();
    if (error || !data) throw new Error('Failed to save gunung');
    return new Gunung(data);
  }

  async update(gunung: Gunung): Promise<Gunung> {
    const { data, error } = await this.supabase.from('gunung').update(gunung).eq('id', gunung.id).select().single();
    if (error || !data) throw new Error('Failed to update gunung');
    return new Gunung(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('gunung').delete().eq('id', id);
    if (error) throw new Error('Failed to delete gunung');
  }

  async findByProvinsi(provinsi: string): Promise<Gunung[]> {
    const { data, error } = await this.supabase.from('gunung').select('*').eq('provinsi', provinsi);
    if (error || !data) return [];
    return data.map((item: any) => new Gunung(item));
  }

  async findByStatus(status: string): Promise<Gunung[]> {
    const { data, error } = await this.supabase.from('gunung').select('*').eq('status', status);
    if (error || !data) return [];
    return data.map((item: any) => new Gunung(item));
  }

  async findActiveMountains(): Promise<Gunung[]> {
    return this.findByStatus('active');
  }

  async findAvailableMountains(): Promise<Gunung[]> {
    const { data, error } = await this.supabase.from('gunung').select('*').eq('status', 'active').gt('kuota', 0);
    if (error || !data) return [];
    return data.map((item: any) => new Gunung(item));
  }

  // TODO: Implement other methods from IGunungRepository as needed
} 