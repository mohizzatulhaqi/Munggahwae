import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { createClient } from '../../utils/supabase/server';

export class SupabaseUserRepository implements IUserRepository {
  private supabase = createClient();

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase.from('user').select('*').eq('id', id).single();
    if (error || !data) return null;
    return new User(data);
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await this.supabase.from('user').select('*');
    if (error || !data) return [];
    return data.map((item: any) => new User(item));
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase.from('user').select('*').eq('email', email).single();
    if (error || !data) return null;
    return new User(data);
  }

  async save(user: User): Promise<User> {
    const { data, error } = await this.supabase.from('user').insert([user.toJSON ? user.toJSON() : { ...user }]).select().single();
    if (error || !data) throw new Error('Failed to save user');
    return new User(data);
  }

  async update(user: User): Promise<User> {
    const { data, error } = await this.supabase.from('user').update(user.toJSON ? user.toJSON() : { ...user }).eq('id', user.id).select().single();
    if (error || !data) throw new Error('Failed to update user');
    return new User(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('user').delete().eq('id', id);
    if (error) throw new Error('Failed to delete user');
  }

  // TODO: Implement other methods from IUserRepository as needed
} 