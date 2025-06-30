// Types for History API
export interface BookingWithMountain {
  id: string;
  kodeBooking: string;
  tanggalMasuk: string;
  tanggalKeluar: string;
  jumlahPemesan: number;
  totalBiaya: number;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  alasanPenolakan?: string;
  gunung: {
    id: string;
    nama: string;
    lokasi: string;
    provinsi: string;
    urlGambar?: string;
    heroImageUrl?: string;
  };
  jalur?: {
    id: string;
    nama: string;
    tingkatKesulitan?: string;
  };
}

export interface BookingDetail extends BookingWithMountain {
  gunung: {
    id: string;
    nama: string;
    lokasi: string;
    provinsi: string;
    deskripsi?: string;
    urlGambar?: string;
    heroImageUrl?: string;
    kuotaHarian?: number;
    hargaPerOrang?: number;
  };
  jalur?: {
    id: string;
    nama: string;
    deskripsi?: string;
    tingkatKesulitan?: string;
    estimasiDurasi?: number;
    ketinggianMaksimal?: number;
  };
  anggotaPendaki: Array<{
    id: string;
    email: string;
    nama: string;
    noIdentitas: string;
    kewarganegaraan: string;
    jenisKelamin?: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    fileKtp?: string;
    isCompanion: boolean;
  }>;
}

export interface ETicket {
  ticketNumber: string;
  bookingCode: string;
  mountainName: string;
  mountainLocation: string;
  entryDate: string;
  exitDate: string;
  numberOfPeople: number;
  totalCost: number;
  status: string;
  paymentStatus: string;
  issuedAt: string;
  validUntil: string;
  members: Array<{
    name: string;
    idNumber: string;
    nationality: string;
    gender?: string;
    isCompanion: boolean;
  }>;
  terms: string[];
  contactInfo: {
    emergency: string;
    office: string;
    email: string;
    website: string;
  };
}

export interface GetHistoryResponse {
  success: boolean;
  bookings: BookingWithMountain[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: string;
}

export interface GetBookingDetailResponse {
  success: boolean;
  booking?: BookingDetail;
  error?: string;
}

export interface GetETicketResponse {
  success: boolean;
  eTicket?: ETicket;
  error?: string;
}

class HistoryApiService {
  private baseUrl = '/api/history';

  async getHistory(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetHistoryResponse> {
    try {
      const url = new URL(this.baseUrl, window.location.origin);
      
      if (params?.status) url.searchParams.append('status', params.status);
      if (params?.search) url.searchParams.append('search', params.search);
      if (params?.page) url.searchParams.append('page', params.page.toString());
      if (params?.limit) url.searchParams.append('limit', params.limit.toString());

      const response = await fetch(url.toString());
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          bookings: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          error: data.error || 'Failed to fetch history',
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching history:', error);
      return {
        success: false,
        bookings: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        error: 'Network error occurred while fetching history',
      };
    }
  }

  async getBookingDetail(id: string): Promise<GetBookingDetailResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch booking detail',
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching booking detail:', error);
      return {
        success: false,
        error: 'Network error occurred while fetching booking detail',
      };
    }
  }

  async getETicket(id: string): Promise<GetETicketResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/e-ticket`);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to generate e-ticket',
        };
      }

      return data;
    } catch (error) {
      console.error('Error generating e-ticket:', error);
      return {
        success: false,
        error: 'Network error occurred while generating e-ticket',
      };
    }
  }

  async cancelBooking(id: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to cancel booking',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error canceling booking:', error);
      return {
        success: false,
        error: 'Network error occurred while canceling booking',
      };
    }
  }

  async rescheduleBooking(
    id: string, 
    newEntryDate: string, 
    newExitDate: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tanggalMasuk: newEntryDate,
          tanggalKeluar: newExitDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to reschedule booking',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      return {
        success: false,
        error: 'Network error occurred while rescheduling booking',
      };
    }
  }
}

export const historyApi = new HistoryApiService(); 