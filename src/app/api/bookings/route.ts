import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// POST /api/bookings
// Membuat entri pemesanan baru
export async function POST(request: Request) {
  const supabase = createClient();

  // 1. Cek sesi pengguna
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Dapatkan data pemesanan dari body request
  const bookingData = await request.json();

  // Validasi data di sini (contoh sederhana)
  if (!bookingData.mountainId || !bookingData.bookingDate || !bookingData.numberOfHikers) {
    return NextResponse.json({ error: 'Missing required booking information' }, { status: 400 });
  }

  // 3. Masukkan data ke tabel 'bookings' menggunakan ID pengguna dari sesi
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      { 
        mountain_id: bookingData.mountainId, 
        user_id: user.id, // Menggunakan ID dari pengguna yang terautentikasi
        booking_date: bookingData.bookingDate,
        number_of_hikers: bookingData.numberOfHikers
      },
    ])
    .select();

  if (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Anda bisa menambahkan fungsi GET di sini nanti untuk melihat riwayat pemesanan. 