import { Booking, BookingProps, AnggotaPemesanProps } from '../../domain/entities/Booking';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { createClient } from '../../utils/supabase/server';

export class SupabaseBookingRepository implements IBookingRepository {
  private supabase = createClient();

  async markAsPaid(id: string): Promise<Booking> {
    const { data, error } = await this.supabase
      .from('booking')
      .update({ paymentStatus: 'paid', status: 'confirmed', updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error || !data) throw new Error('Failed to mark booking as paid');
    return this.mapToBooking(data);
  }

  async confirmBooking(id: string): Promise<Booking> {
    const { data, error } = await this.supabase
      .from('booking')
      .update({ status: 'confirmed', updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error || !data) throw new Error('Failed to confirm booking');
    return this.mapToBooking(data);
  }

  async cancelBooking(id: string): Promise<Booking> {
    const { data, error } = await this.supabase
      .from('booking')
      .update({ status: 'cancelled', updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error || !data) throw new Error('Failed to cancel booking');
    return this.mapToBooking(data);
  }

  async getBookingsByUserId(userId: string) {
    const { data: bookings, error } = await this.supabase
      .from('bookings')
      .select(`*, mountains (name, location, image_url)`)
      .eq('user_id', userId);
    if (error) throw error;
    return bookings;
  }
  async findById(id: string): Promise<Booking | null> {
    const { data, error } = await this.supabase
      .from('booking')
      .select('*, anggota_pemesanan(*)')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return this.mapToBooking(data);
  }

  async save(booking: Booking): Promise<Booking> {
    // Insert booking
    const { data, error } = await this.supabase
      .from('booking')
      .insert([this.mapFromBooking(booking)])
      .select()
      .single();
    if (error || !data) throw new Error('Failed to save booking');
    // Insert anggota pemesan
    for (const anggota of booking.anggotaPemesan) {
      await this.supabase.from('anggota_pemesanan').insert([
        { ...anggota, booking_id: data.id }
      ]);
    }
    return this.mapToBooking(data);
  }

  async update(booking: Booking): Promise<Booking> {
    const { data, error } = await this.supabase
      .from('booking')
      .update(this.mapFromBooking(booking))
      .eq('id', booking.id)
      .select()
      .single();
    if (error || !data) throw new Error('Failed to update booking');
    // TODO: update anggota_pemesanan jika perlu
    return this.mapToBooking(data);
  }

  async delete(id: string): Promise<void> {
    await this.supabase.from('booking').delete().eq('id', id);
    await this.supabase.from('anggota_pemesanan').delete().eq('booking_id', id);
  }

  async findAll(): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('booking')
      .select('*, anggota_pemesanan(*)');
    if (error || !data) return [];
    return data.map(this.mapToBooking);
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('booking')
      .select('*, anggota_pemesanan(*)')
      .eq('userId', userId);
    if (error || !data) return [];
    return data.map(this.mapToBooking);
  }

  async findByMountainId(mountainId: string): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('booking')
      .select('*, anggota_pemesanan(*)')
      .eq('mountainId', mountainId);
    if (error || !data) return [];
    return data.map(this.mapToBooking);
  }

  async findByStatus(status: string): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('booking')
      .select('*, anggota_pemesanan(*)')
      .eq('status', status);
    if (error || !data) return [];
    return data.map(this.mapToBooking);
  }

  async findByPaymentStatus(paymentStatus: string): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('booking')
      .select('*, anggota_pemesanan(*)')
      .eq('paymentStatus', paymentStatus);
    if (error || !data) return [];
    return data.map(this.mapToBooking);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('booking')
      .select('*, anggota_pemesanan(*)')
      .gte('tanggalMasuk', startDate.toISOString())
      .lte('tanggalKeluar', endDate.toISOString());
    if (error || !data) return [];
    return data.map(this.mapToBooking);
  }

  async findPendingBookings(): Promise<Booking[]> {
    return this.findByStatus('pending');
  }

  async findConfirmedBookings(): Promise<Booking[]> {
    return this.findByStatus('confirmed');
  }

  async findUnpaidBookings(): Promise<Booking[]> {
    return this.findByPaymentStatus('unpaid');
  }

  private mapToBooking = (data: any): Booking => {
    return new Booking({
      id: data.id,
      userId: data.userId,
      mountainId: data.mountainId,
      trailId: data.trailId,
      tanggalMasuk: new Date(data.tanggalMasuk),
      tanggalKeluar: new Date(data.tanggalKeluar),
      jumlahPemesan: data.jumlahPemesan,
      totalHarga: data.totalHarga,
      status: data.status,
      paymentStatus: data.paymentStatus,
      specialRequests: data.specialRequests,
      anggotaPemesan: (data.anggota_pemesanan || []).map((ap: any) => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin,
        tempatLahir: ap.tempatLahir,
        tanggalLahir: ap.tanggalLahir ? new Date(ap.tanggalLahir) : undefined,
        fileKtp: ap.fileKtp,
        isCompanion: ap.isCompanion,
      })),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  };

  private mapFromBooking = (booking: Booking): any => {
    return {
      id: booking.id,
      userId: booking.userId,
      mountainId: booking.mountainId,
      trailId: booking.trailId,
      tanggalMasuk: booking.tanggalMasuk.toISOString(),
      tanggalKeluar: booking.tanggalKeluar.toISOString(),
      jumlahPemesan: booking.jumlahPemesan,
      totalHarga: booking.totalHarga,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  };
} 