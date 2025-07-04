import { NextRequest, NextResponse } from 'next/server';

// import { CreateBookingUseCase } from '../../../application/use-cases/CreateBookingUseCase';
import { GetUserBookingsUseCase } from '../../../application/use-cases/GetUserBookingsUseCase';
import { SupabaseBookingRepository } from '../../../infrastructure/repositories/SupabaseBookingRepository';
import { SupabaseUserRepository } from '../../../infrastructure/repositories/SupabaseUserRepository';
import { SupabaseGunungRepository } from '../../../infrastructure/repositories/SupabaseGunungRepository';

// // POST /api/bookings
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const userRepository = new SupabaseUserRepository();
//     const gunungRepository = new SupabaseGunungRepository();
//     const bookingRepository = new SupabaseBookingRepository();
//     const useCase = new CreateBookingUseCase(userRepository, gunungRepository, bookingRepository);
//     const result = await useCase.execute(body);
//     if (!result.success) {
//       return NextResponse.json({ success: false, error: result.error, validationErrors: result.validationErrors, warnings: result.warnings }, { status: 400 });
//     }
//     return NextResponse.json({ success: true, booking: result.booking?.toJSON(), warnings: result.warnings }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
//   }
// }

// GET /api/bookings?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const bookingRepository = new SupabaseBookingRepository();
    if (userId) {
      const useCase = new GetUserBookingsUseCase(bookingRepository);
      const bookings = await useCase.execute(userId);
      return NextResponse.json({ success: true, bookings, total: bookings.length });
    }
    // fallback: get all bookings
    const bookings = await bookingRepository.findAll();
    return NextResponse.json({ success: true, bookings, total: bookings.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

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
