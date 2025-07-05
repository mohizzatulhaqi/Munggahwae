import { supabase } from '@/app/api/supabaseClient';

// Signup user menggunakan Supabase Auth
export async function createUser({ namaLengkap, email, password }: {
  namaLengkap: string;
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        namaLengkap,
      },
    },
  });
  if (error) throw error;
  return data;
}
