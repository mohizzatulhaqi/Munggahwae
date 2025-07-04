import { NextRequest, NextResponse } from 'next/server';
import { MarkBookingAsPaidUseCase } from '../../../../application/use-cases/MarkBookingAsPaidUseCase';
import { SupabaseBookingRepository } from '../../../../infrastructure/repositories/SupabaseBookingRepository';
import { SupabaseGunungRepository } from '../../../../infrastructure/repositories/SupabaseGunungRepository';
import { SupabaseUserRepository } from '../../../../infrastructure/repositories/SupabaseUserRepository';



export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // TODO: Refactor to use GetBookingByIdUseCase directly if needed
  const bookingRepository = new SupabaseBookingRepository();
  const booking = await bookingRepository.findById(params.id);
  if (!booking) {
    return NextResponse.json({ success: false, error: 'Booking tidak ditemukan' }, { status: 404 });
  }
  return NextResponse.json({ success: true, booking: booking.toJSON() });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  if (body.action === 'markAsPaid') {
    try {
      const bookingRepository = new SupabaseBookingRepository();
      const gunungRepository = new SupabaseGunungRepository();
      const userRepository = new SupabaseUserRepository();
      const useCase = new MarkBookingAsPaidUseCase(bookingRepository, gunungRepository, userRepository);
      const booking = await useCase.execute(params.id);
      return NextResponse.json({
        success: true,
        booking: booking.toJSON(),
        message: 'Booking berhasil ditandai sebagai dibayar',
      });
    } catch (error) {
      return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' }, { status: 400 });
    }
  } else if (body.action === 'confirm') {
    try {
      const bookingRepository = new SupabaseBookingRepository();
      const gunungRepository = new SupabaseGunungRepository();
      const userRepository = new SupabaseUserRepository();
      const useCase = new (await import('../../../../application/use-cases/ConfirmBookingUseCase')).ConfirmBookingUseCase(bookingRepository, gunungRepository, userRepository);
      const booking = await useCase.execute(params.id);
      return NextResponse.json({
        success: true,
        booking: booking.toJSON(),
        message: 'Booking berhasil dikonfirmasi',
      });
    } catch (error) {
      return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' }, { status: 400 });
    }
  } else if (body.action === 'cancel') {
    try {
      const bookingRepository = new SupabaseBookingRepository();
      const gunungRepository = new SupabaseGunungRepository();
      const userRepository = new SupabaseUserRepository();
      const useCase = new (await import('../../../../application/use-cases/CancelBookingUseCase')).CancelBookingUseCase(bookingRepository, gunungRepository, userRepository);
      const booking = await useCase.execute(params.id);
      return NextResponse.json({
        success: true,
        booking: booking.toJSON(),
        message: 'Booking berhasil dibatalkan',
      });
    } catch (error) {
      return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' }, { status: 400 });
    }
  }
  return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
}

