import { NextRequest, NextResponse } from 'next/server';
import { CreateBookingUseCase, CreateBookingInput } from '../../application/use-cases/CreateBookingUseCase';
import { GetBookingByIdUseCase } from '../../application/use-cases/GetBookingByIdUseCase';
import { SupabaseBookingRepository } from '../../infrastructure/repositories/SupabaseBookingRepository';

export class BookingController {
  private createBookingUseCase: CreateBookingUseCase;
  private getBookingByIdUseCase: GetBookingByIdUseCase;

  constructor() {
    const { SupabaseUserRepository } = require('../../infrastructure/repositories/SupabaseUserRepository');
    const { SupabaseGunungRepository } = require('../../infrastructure/repositories/SupabaseGunungRepository');
    const userRepository = new SupabaseUserRepository();
    const gunungRepository = new SupabaseGunungRepository();
    const bookingRepository = new SupabaseBookingRepository();
    this.createBookingUseCase = new CreateBookingUseCase(
      userRepository,
      gunungRepository,
      bookingRepository
    );
    this.getBookingByIdUseCase = new GetBookingByIdUseCase(bookingRepository);
  }

  async createBooking(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      
      // Validate request body
      if (!this.isValidCreateBookingRequest(body)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid request body',
            validationErrors: ['Request body tidak valid']
          },
          { status: 400 }
        );
      }

      const input: CreateBookingInput = {
        userId: body.userId,
        mountainId: body.mountainId,
        trailId: body.trailId,
        tanggalMasuk: body.tanggalMasuk,
        tanggalKeluar: body.tanggalKeluar,
        jumlahPemesan: body.jumlahPemesan,
        anggotaPemesan: body.anggotaPemesan,
        specialRequests: body.specialRequests,
      };

      const result = await this.createBookingUseCase.execute(input);

      if (!result.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: result.error,
            validationErrors: result.validationErrors,
            warnings: result.warnings
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        booking: result.booking?.toJSON(),
        warnings: result.warnings,
      }, { status: 201 });

    } catch (error) {
      console.error('Booking creation error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error' 
        },
        { status: 500 }
      );
    }
  }

  // getBookings: refactor ke use-case jika diperlukan, atau hapus jika tidak dipakai endpoint

  async getBookingById(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const booking = await this.getBookingByIdUseCase.execute(params.id);
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking tidak ditemukan' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, booking: booking.toJSON() });
    } catch (error) {
      console.error('Get booking error:', error);
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  // confirmBooking: refactor ke use-case, hapus logic repository/service di sini

  // cancelBooking: refactor ke use-case, hapus logic repository/service di sini

  // getBookingStatistics: refactor ke use-case, hapus logic repository/service di sini

  private isValidCreateBookingRequest(body: any): body is CreateBookingInput {
    return (
      body &&
      typeof body.userId === 'string' &&
      typeof body.mountainId === 'string' &&
      typeof body.trailId === 'string' &&
      typeof body.tanggalMasuk === 'string' &&
      typeof body.tanggalKeluar === 'string' &&
      typeof body.jumlahPemesan === 'number' &&
      Array.isArray(body.anggotaPemesan) &&
      body.anggotaPemesan.length > 0
    );
  }
} 