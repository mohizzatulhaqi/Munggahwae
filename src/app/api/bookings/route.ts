import { NextRequest, NextResponse } from 'next/server';
import { BookingController } from '../../../presentation/controllers/BookingController';

const bookingController = new BookingController();

// POST /api/bookings
// Membuat entri pemesanan baru
export async function POST(request: NextRequest) {
  return bookingController.createBooking(request);
}

export async function GET(request: NextRequest) {
  return bookingController.getBookings(request);
}

// Anda bisa menambahkan fungsi GET di sini nanti untuk melihat riwayat pemesanan. 