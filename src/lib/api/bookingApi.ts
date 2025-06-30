import { Booking } from '../../domain/entities/Booking';
import { Gunung } from '../../domain/entities/Gunung';

export interface CreateBookingRequest {
  userId: string;
  mountainId: string;
  trailId: string;
  tanggalMasuk: string;
  tanggalKeluar: string;
  jumlahPemesan: number;
  anggotaPemesan: {
    email: string;
    nama: string;
    noIdentitas: string;
    kewarganegaraan?: string;
    jenisKelamin?: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    fileKtp?: string;
    isCompanion?: boolean;
  }[];
  specialRequests?: string;
}

// Extended Booking interface for frontend with gunung data
export interface BookingWithMountain {
  id: string;
  userId?: string;
  mountainId?: string;
  trailId?: string;
  tanggalMasuk: Date;
  tanggalKeluar: Date;
  jumlahPemesan: number;
  totalHarga: number;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
  anggotaPemesan: any[];
  createdAt: Date;
  updatedAt: Date;
  // Additional properties for frontend
  gunung: Gunung;
  kodeBooking: string;
  totalBiaya: number;
  alasanPenolakan?: string;
}

export interface CreateBookingResponse {
  success: boolean;
  booking?: BookingWithMountain;
  error?: string;
  validationErrors?: string[];
  warnings?: string[];
}

export interface GetBookingsResponse {
  success: boolean;
  bookings: BookingWithMountain[];
  total: number;
  error?: string;
}

export interface GetBookingResponse {
  success: boolean;
  booking?: BookingWithMountain;
  error?: string;
}

export interface BookingStatistics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
}

export interface BookingStatisticsResponse {
  success: boolean;
  statistics?: BookingStatistics;
  error?: string;
}

class BookingApiService {
  private baseUrl = '/api/bookings';

  async createBooking(request: CreateBookingRequest): Promise<CreateBookingResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create booking',
          validationErrors: data.validationErrors,
          warnings: data.warnings,
        };
      }

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: 'Network error occurred while creating booking',
      };
    }
  }

  async getBookings(params?: {
    userId?: string;
    mountainId?: string;
    status?: string;
  }): Promise<GetBookingsResponse> {
    try {
      const url = new URL(this.baseUrl, window.location.origin);
      
      if (params?.userId) url.searchParams.append('userId', params.userId);
      if (params?.mountainId) url.searchParams.append('mountainId', params.mountainId);
      if (params?.status) url.searchParams.append('status', params.status);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          bookings: [],
          total: 0,
          error: data.error || 'Failed to fetch bookings',
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        success: false,
        bookings: [],
        total: 0,
        error: 'Network error occurred while fetching bookings',
      };
    }
  }

  async getBookingById(id: string): Promise<GetBookingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch booking',
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        error: 'Network error occurred while fetching booking',
      };
    }
  }

  async confirmBooking(id: string): Promise<GetBookingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'confirm' }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to confirm booking',
        };
      }

      return data;
    } catch (error) {
      console.error('Error confirming booking:', error);
      return {
        success: false,
        error: 'Network error occurred while confirming booking',
      };
    }
  }

  async cancelBooking(id: string): Promise<GetBookingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to cancel booking',
        };
      }

      return data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        error: 'Network error occurred while cancelling booking',
      };
    }
  }

  async markBookingAsPaid(id: string): Promise<GetBookingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'markAsPaid' }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to mark booking as paid',
        };
      }

      return data;
    } catch (error) {
      console.error('Error marking booking as paid:', error);
      return {
        success: false,
        error: 'Network error occurred while marking booking as paid',
      };
    }
  }

  async getBookingStatistics(): Promise<BookingStatisticsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/statistics`);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch booking statistics',
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching booking statistics:', error);
      return {
        success: false,
        error: 'Network error occurred while fetching booking statistics',
      };
    }
  }
}

export const bookingApi = new BookingApiService(); 