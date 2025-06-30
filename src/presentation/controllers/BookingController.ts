import { NextRequest, NextResponse } from 'next/server';
import { CreateBookingUseCase, CreateBookingInput } from '../../application/use-cases/CreateBookingUseCase';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { PrismaGunungRepository } from '../../infrastructure/repositories/PrismaGunungRepository';
import { PrismaBookingRepository } from '../../infrastructure/repositories/PrismaBookingRepository';
import { PrismaClient } from '@prisma/client';

export class BookingController {
  private prisma: PrismaClient;
  private createBookingUseCase: CreateBookingUseCase;

  constructor() {
    this.prisma = new PrismaClient();
    const userRepository = new PrismaUserRepository(this.prisma);
    const gunungRepository = new PrismaGunungRepository(this.prisma);
    const bookingRepository = new PrismaBookingRepository(this.prisma);
    
    this.createBookingUseCase = new CreateBookingUseCase(
      userRepository,
      gunungRepository,
      bookingRepository
    );
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

  async getBookings(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');
      const mountainId = searchParams.get('mountainId');
      const status = searchParams.get('status');

      const bookingRepository = new PrismaBookingRepository(this.prisma);
      let bookings;

      if (userId) {
        bookings = await bookingRepository.findByUserId(userId);
      } else if (mountainId) {
        bookings = await bookingRepository.findByMountainId(mountainId);
      } else if (status) {
        bookings = await bookingRepository.findByStatus(status);
      } else {
        bookings = await bookingRepository.findAll();
      }

      return NextResponse.json({
        success: true,
        bookings: bookings.map((booking: any) => booking.toJSON()),
        total: bookings.length,
      });

    } catch (error) {
      console.error('Get bookings error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error' 
        },
        { status: 500 }
      );
    }
  }

  async getBookingById(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const bookingRepository = new PrismaBookingRepository(this.prisma);
      const booking = await bookingRepository.findById(params.id);

      if (!booking) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Booking tidak ditemukan' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        booking: booking.toJSON(),
      });

    } catch (error) {
      console.error('Get booking error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error' 
        },
        { status: 500 }
      );
    }
  }

  async confirmBooking(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const bookingRepository = new PrismaBookingRepository(this.prisma);
      const gunungRepository = new PrismaGunungRepository(this.prisma);
      const userRepository = new PrismaUserRepository(this.prisma);
      
      const bookingService = new (await import('../../domain/services/BookingService')).BookingService(
        bookingRepository,
        gunungRepository,
        userRepository
      );

      const booking = await bookingService.confirmBooking(params.id);

      return NextResponse.json({
        success: true,
        booking: booking.toJSON(),
        message: 'Booking berhasil dikonfirmasi',
      });

    } catch (error) {
      console.error('Confirm booking error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Internal server error' 
        },
        { status: 400 }
      );
    }
  }

  async cancelBooking(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const bookingRepository = new PrismaBookingRepository(this.prisma);
      const gunungRepository = new PrismaGunungRepository(this.prisma);
      const userRepository = new PrismaUserRepository(this.prisma);
      
      const bookingService = new (await import('../../domain/services/BookingService')).BookingService(
        bookingRepository,
        gunungRepository,
        userRepository
      );

      const booking = await bookingService.cancelBooking(params.id);

      return NextResponse.json({
        success: true,
        booking: booking.toJSON(),
        message: 'Booking berhasil dibatalkan',
      });

    } catch (error) {
      console.error('Cancel booking error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Internal server error' 
        },
        { status: 400 }
      );
    }
  }

  async getBookingStatistics(request: NextRequest): Promise<NextResponse> {
    try {
      const bookingRepository = new PrismaBookingRepository(this.prisma);
      const gunungRepository = new PrismaGunungRepository(this.prisma);
      const userRepository = new PrismaUserRepository(this.prisma);
      
      const bookingService = new (await import('../../domain/services/BookingService')).BookingService(
        bookingRepository,
        gunungRepository,
        userRepository
      );

      const statistics = await bookingService.getBookingStatistics();

      return NextResponse.json({
        success: true,
        statistics,
      });

    } catch (error) {
      console.error('Get booking statistics error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error' 
        },
        { status: 500 }
      );
    }
  }

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