import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

// GET /api/my-bookings
// Mendapatkan riwayat pemesanan untuk pengguna yang sedang login
export async function GET(request: Request) {
  const supabase = createClient();

  // 1. Cek sesi pengguna
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Ambil data pemesanan milik pengguna tersebut dari tabel 'bookings'
  // Di sini kita juga mengambil data nama gunung dengan join ke tabel 'mountains'
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      mountains (
        name,
        location,
        image_url
      )
    `)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }

  return NextResponse.json(bookings);
} 