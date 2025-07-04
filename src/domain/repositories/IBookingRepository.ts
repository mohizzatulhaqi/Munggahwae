import { Booking } from '../entities/Booking';

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  save(booking: Booking): Promise<Booking>;
  update(booking: Booking): Promise<Booking>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Booking[]>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByMountainId(mountainId: string): Promise<Booking[]>;
  findByStatus(status: string): Promise<Booking[]>;
  findByPaymentStatus(paymentStatus: string): Promise<Booking[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>;
  findPendingBookings(): Promise<Booking[]>;
  findConfirmedBookings(): Promise<Booking[]>;
  findUnpaidBookings(): Promise<Booking[]>;
  getBookingsByUserId(userId: string): Promise<any[]>;
  markAsPaid(id: string): Promise<Booking>;
  confirmBooking(id: string): Promise<Booking>;
  cancelBooking(id: string): Promise<Booking>;
} 