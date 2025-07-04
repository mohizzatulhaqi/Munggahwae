import { NextResponse } from 'next/server';
import { GetUserBookingsUseCase } from '@/application/use-cases/GetUserBookingsUseCase';
import { SupabaseBookingRepository } from '@/infrastructure/repositories/SupabaseBookingRepository';
import { createClient } from '@/utils/supabase/client';

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const bookingRepository = new SupabaseBookingRepository();
  const getUserBookingsUseCase = new GetUserBookingsUseCase(bookingRepository);
  try {
    const bookings = await getUserBookingsUseCase.execute(user.id);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}