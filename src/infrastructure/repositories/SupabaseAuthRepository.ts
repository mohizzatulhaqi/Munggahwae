import { createClient } from '@/utils/supabase/server';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';

export class SupabaseAuthRepository implements IAuthRepository {
  async login(email: string, password: string) {
    const supabase = createClient();
    return supabase.auth.signInWithPassword({ email, password });
  }
  async register(email: string, password: string, namaLengkap: string, phoneNumber?: string) {
    const supabase = createClient();
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nama_lengkap: namaLengkap,
          phone_number: phoneNumber,
        },
      },
    });
  }
  async logout() {
    const supabase = createClient();
    return supabase.auth.signOut();
  }
  async getUser() {
    const supabase = createClient();
    return supabase.auth.getUser();
  }
}
