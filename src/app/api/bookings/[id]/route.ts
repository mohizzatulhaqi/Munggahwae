import { NextRequest, NextResponse } from 'next/server';
import { BookingController } from '../../../../presentation/controllers/BookingController';
import { SupabaseBookingRepository } from '../../../../infrastructure/repositories/SupabaseBookingRepository';
import { SupabaseGunungRepository } from '../../../../infrastructure/repositories/SupabaseGunungRepository';
import { SupabaseUserRepository } from '../../../../infrastructure/repositories/SupabaseUserRepository';

const bookingController = new BookingController();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return bookingController.getBookingById(request, { params });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  
  if (body.action === 'confirm') {
    return bookingController.confirmBooking(request, { params });
  } else if (body.action === 'cancel') {
    return bookingController.cancelBooking(request, { params });
  } else if (body.action === 'markAsPaid') {
    return markBookingAsPaid(request, { params });
  }
  
  return NextResponse.json(
    { success: false, error: 'Invalid action' },
    { status: 400 }
  );
}

// Helper method for marking booking as paid
async function markBookingAsPaid(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingRepository = new SupabaseBookingRepository();
    const gunungRepository = new SupabaseGunungRepository();
    const userRepository = new SupabaseUserRepository();
    
    const bookingService = new (await import('../../../../domain/services/BookingService')).BookingService(
      bookingRepository,
      gunungRepository,
      userRepository
    );

    const booking = await bookingService.markBookingAsPaid(params.id);

    return NextResponse.json({
      success: true,
      booking: booking.toJSON(),
      message: 'Booking berhasil ditandai sebagai dibayar',
    });

  } catch (error) {
    console.error('Mark booking as paid error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 400 }
    );
  }
} 