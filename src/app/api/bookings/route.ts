import { NextRequest, NextResponse } from 'next/server';

import { CreateBookingUseCase } from '../../../application/use-cases/CreateBookingUseCase';
import { GetUserBookingsUseCase } from '../../../application/use-cases/GetUserBookingsUseCase';
import { SupabaseBookingRepository } from '../../../infrastructure/repositories/SupabaseBookingRepository';
import { SupabaseUserRepository } from '../../../infrastructure/repositories/SupabaseUserRepository';
import { SupabaseGunungRepository } from '../../../infrastructure/repositories/SupabaseGunungRepository';

// POST /api/bookings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userRepository = new SupabaseUserRepository();
    const gunungRepository = new SupabaseGunungRepository();
    const bookingRepository = new SupabaseBookingRepository();
    const useCase = new CreateBookingUseCase(userRepository, gunungRepository, bookingRepository);
    const result = await useCase.execute(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error, validationErrors: result.validationErrors, warnings: result.warnings }, { status: 400 });
    }
    return NextResponse.json({ success: true, booking: result.booking?.toJSON(), warnings: result.warnings }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

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
