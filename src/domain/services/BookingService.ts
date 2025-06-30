import { Booking, AnggotaPemesanProps } from '../entities/Booking';
import { Gunung } from '../entities/Gunung';
import { User } from '../entities/User';
import { IBookingRepository } from '../repositories/IBookingRepository';
import { IGunungRepository } from '../repositories/IGunungRepository';
import { IUserRepository } from '../repositories/IUserRepository';

export interface CreateBookingRequest {
  userId: string;
  mountainId: string;
  trailId: string;
  tanggalMasuk: Date;
  tanggalKeluar: Date;
  jumlahPemesan: number;
  anggotaPemesan: AnggotaPemesanProps[];
  specialRequests?: string;
}

export interface BookingValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface QuotaCheckResult {
  isAvailable: boolean;
  availableQuota: number;
  requestedQuota: number;
  conflictingBookings: Booking[];
}

export class BookingService {
  constructor(
    private bookingRepository: IBookingRepository,
    private gunungRepository: IGunungRepository,
    private userRepository: IUserRepository
  ) {}

  // Complex Business Logic Methods
  async createBooking(request: CreateBookingRequest): Promise<Booking> {
    // Validate user
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new Error('User tidak ditemukan');
    }
    if (!user.canMakeBooking()) {
      throw new Error('User tidak dapat melakukan booking');
    }

    // Validate mountain
    const gunung = await this.gunungRepository.findById(request.mountainId);
    if (!gunung) {
      throw new Error('Gunung tidak ditemukan');
    }
    if (!gunung.canAcceptBookings()) {
      throw new Error('Gunung tidak dapat menerima booking saat ini');
    }

    // Check quota availability
    const quotaCheck = await this.checkQuotaAvailability(
      request.mountainId,
      request.tanggalMasuk,
      request.tanggalKeluar,
      request.jumlahPemesan
    );
    if (!quotaCheck.isAvailable) {
      throw new Error(`Kuota tidak tersedia. Tersedia: ${quotaCheck.availableQuota}, Diminta: ${quotaCheck.requestedQuota}`);
    }

    // Calculate total price
    const totalHarga = gunung.calculateTotalPrice(request.jumlahPemesan);

    // Create booking
    const booking = new Booking({
      userId: request.userId,
      mountainId: request.mountainId,
      trailId: request.trailId,
      tanggalMasuk: request.tanggalMasuk,
      tanggalKeluar: request.tanggalKeluar,
      jumlahPemesan: request.jumlahPemesan,
      totalHarga,
      specialRequests: request.specialRequests,
      anggotaPemesan: request.anggotaPemesan,
    });

    // Validate booking
    const validation = this.validateBooking(booking);
    if (!validation.isValid) {
      throw new Error(`Booking tidak valid: ${validation.errors.join(', ')}`);
    }

    // Save booking
    return await this.bookingRepository.save(booking);
  }

  async confirmBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking tidak ditemukan');
    }

    if (!booking.canBeConfirmed()) {
      throw new Error('Booking tidak dapat dikonfirmasi');
    }

    booking.confirmBooking();
    return await this.bookingRepository.update(booking);
  }

  async cancelBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking tidak ditemukan');
    }

    if (!booking.canBeCancelled()) {
      throw new Error('Booking tidak dapat dibatalkan');
    }

    booking.cancelBooking();
    return await this.bookingRepository.update(booking);
  }

  async markBookingAsPaid(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking tidak ditemukan');
    }

    booking.markAsPaid();
    return await this.bookingRepository.update(booking);
  }

  // Complex Domain Logic
  async checkQuotaAvailability(
    mountainId: string,
    tanggalMasuk: Date,
    tanggalKeluar: Date,
    jumlahPemesan: number
  ): Promise<QuotaCheckResult> {
    const gunung = await this.gunungRepository.findById(mountainId);
    if (!gunung) {
      throw new Error('Gunung tidak ditemukan');
    }

    // Get existing bookings for the date range
    const existingBookings = await this.bookingRepository.findByDateRange(tanggalMasuk, tanggalKeluar);
    const mountainBookings = existingBookings.filter(b => b.mountainId === mountainId && b.status !== 'cancelled');

    // Calculate total booked quota for the date range
    const totalBookedQuota = mountainBookings.reduce((total, booking) => {
      const bookingDays = booking.getDurationInDays();
      return total + (booking.jumlahPemesan * bookingDays);
    }, 0);

    // Calculate available quota
    const totalDays = Math.ceil((tanggalKeluar.getTime() - tanggalMasuk.getTime()) / (1000 * 60 * 60 * 24));
    const requestedQuota = jumlahPemesan * totalDays;
    const dailyQuota = gunung.getDailyQuota();
    const totalAvailableQuota = dailyQuota * totalDays;
    const availableQuota = totalAvailableQuota - totalBookedQuota;

    return {
      isAvailable: availableQuota >= requestedQuota,
      availableQuota,
      requestedQuota,
      conflictingBookings: mountainBookings,
    };
  }

  validateBooking(booking: Booking): BookingValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate dates
    if (booking.tanggalMasuk < new Date()) {
      errors.push('Tanggal masuk tidak boleh di masa lalu');
    }

    // Validate anggota pemesan
    if (!booking.validateAnggotaPemesan()) {
      errors.push('Jumlah anggota pemesan tidak sesuai');
    }

    // Check for minors
    const minorsCount = booking.getMinorsCount();
    if (minorsCount > 0) {
      warnings.push(`${minorsCount} anggota di bawah umur terdeteksi`);
    }

    // Check duration
    const duration = booking.getDurationInDays();
    if (duration > 3) {
      errors.push('Durasi pendakian maksimal 3 hari');
    }

    // Check total price
    if (booking.totalHarga <= 0) {
      errors.push('Total harga tidak valid');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async getBookingStatistics(): Promise<{
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
  }> {
    const allBookings = await this.bookingRepository.findAll();
    const pendingBookings = allBookings.filter(b => b.status === 'pending');
    const confirmedBookings = allBookings.filter(b => b.status === 'confirmed');
    const cancelledBookings = allBookings.filter(b => b.status === 'cancelled');
    const paidBookings = allBookings.filter(b => b.paymentStatus === 'paid');
    
    const totalRevenue = paidBookings.reduce((total, booking) => total + booking.totalHarga, 0);
    const averageBookingValue = allBookings.length > 0 ? totalRevenue / allBookings.length : 0;

    return {
      totalBookings: allBookings.length,
      pendingBookings: pendingBookings.length,
      confirmedBookings: confirmedBookings.length,
      cancelledBookings: cancelledBookings.length,
      totalRevenue,
      averageBookingValue,
    };
  }

  async getUserBookingHistory(userId: string): Promise<Booking[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    return await this.bookingRepository.findByUserId(userId);
  }

  async getMountainBookingHistory(mountainId: string): Promise<Booking[]> {
    const gunung = await this.gunungRepository.findById(mountainId);
    if (!gunung) {
      throw new Error('Gunung tidak ditemukan');
    }

    return await this.bookingRepository.findByMountainId(mountainId);
  }
} 