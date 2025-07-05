import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET /api/history/[id]
// Mendapatkan detail pemesanan berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const bookingId = params.id;

    // 1. Cek sesi pengguna
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized' 
        }, 
        { status: 401 }
      );
    }

    // 2. Ambil data booking dengan join ke mountains, trails, dan booking members
    const { data: booking, error } = await supabase
      .from('booking')
      .select(`
        *,
        Gunung (
          id,
          nama,
          lokasi,
          provinsi,
          deskripsi,
          urlGambar,
          heroImageUrl,
          kuotaHarian,
          hargaPerOrang
        ),
        Jalur (
          id,
          nama,
          deskripsi,
          tingkatKesulitan,
          estimasiDurasi,
          ketinggianMaksimal
        ),
        booking_members (
          id,
          email,
          nama,
          no_identitas,
          kewarganegaraan,
          jenis_kelamin,
          tempat_lahir,
          tanggal_lahir,
          file_ktp,
          is_companion
        )
      `)
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Booking not found' 
          }, 
          { status: 404 }
        );
      }
      
      console.error('Error fetching booking:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch booking' 
        }, 
        { status: 500 }
      );
    }

    if (!booking) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking not found' 
        }, 
        { status: 404 }
      );
    }

    // 3. Transform data untuk kompatibilitas dengan frontend
    const transformedBooking = {
      id: booking.id,
      kodeBooking: booking.kode_booking || `BK-${booking.id.slice(0, 8).toUpperCase()}`,
      tanggalMasuk: booking.tanggal_masuk,
      tanggalKeluar: booking.tanggal_keluar,
      jumlahPemesan: booking.jumlah_pemesan,
      totalBiaya: booking.total_harga,
      status: booking.status,
      paymentStatus: booking.payment_status,
      specialRequests: booking.special_requests,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
      alasanPenolakan: booking.alasan_penolakan,
      gunung: {
        id: booking.mountains?.id,
        nama: booking.mountains?.name,
        lokasi: booking.mountains?.location,
        provinsi: booking.mountains?.province,
        deskripsi: booking.mountains?.description,
        urlGambar: booking.mountains?.image_url,
        heroImageUrl: booking.mountains?.hero_image_url,
        kuotaHarian: booking.mountains?.quota_per_day,
        hargaPerOrang: booking.mountains?.price_per_person,
      },
      jalur: booking.trails ? {
        id: booking.trails.id,
        nama: booking.trails.name,
        deskripsi: booking.trails.description,
        tingkatKesulitan: booking.trails.difficulty_level,
        estimasiDurasi: booking.trails.estimated_duration_hours,
        ketinggianMaksimal: booking.trails.max_altitude,
      } : null,
      anggotaPendaki: booking.booking_members?.map((member: any) => ({
        id: member.id,
        email: member.email,
        nama: member.nama,
        noIdentitas: member.no_identitas,
        kewarganegaraan: member.kewarganegaraan,
        jenisKelamin: member.jenis_kelamin,
        tempatLahir: member.tempat_lahir,
        tanggalLahir: member.tanggal_lahir,
        fileKtp: member.file_ktp,
        isCompanion: member.is_companion,
      })) || [],
    };

    return NextResponse.json({
      success: true,
      booking: transformedBooking,
    });

  } catch (error) {
    console.error('History detail API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// PATCH /api/history/[id]
// Reschedule booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const bookingId = params.id;
    const body = await request.json();

    // 1. Cek sesi pengguna
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized' 
        }, 
        { status: 401 }
      );
    }

    // 2. Validasi input
    const { tanggalMasuk, tanggalKeluar } = body;
    if (!tanggalMasuk || !tanggalKeluar) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tanggal masuk dan keluar harus diisi' 
        }, 
        { status: 400 }
      );
    }

    // 3. Cek apakah booking milik user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, status, tanggal_masuk, tanggal_keluar')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking not found' 
        }, 
        { status: 404 }
      );
    }

    // 4. Cek apakah booking bisa direschedule
    if (existingBooking.status !== 'pending' && existingBooking.status !== 'approved') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking tidak dapat direschedule' 
        }, 
        { status: 400 }
      );
    }

    // 5. Update booking
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        tanggal_masuk: tanggalMasuk,
        tanggal_keluar: tanggalKeluar,
        status: 'pending', // Reset status ke pending untuk review admin
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update booking' 
        }, 
        { status: 500 }
      );
    }

    // 6. Log perubahan
    await supabase
      .from('booking_logs')
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        action: 'booking_rescheduled',
        old_data: {
          tanggal_masuk: existingBooking.tanggal_masuk,
          tanggal_keluar: existingBooking.tanggal_keluar,
        },
        new_data: {
          tanggal_masuk: tanggalMasuk,
          tanggal_keluar: tanggalKeluar,
        },
      });

    return NextResponse.json({
      success: true,
      message: 'Booking berhasil direschedule',
      booking: updatedBooking,
    });

  } catch (error) {
    console.error('Reschedule booking API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/history/[id]
// Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const bookingId = params.id;
    const body = await request.json();
    const { reason } = body || {};

    // 1. Cek sesi pengguna
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized' 
        }, 
        { status: 401 }
      );
    }

    // 2. Cek apakah booking milik user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, status, tanggal_masuk')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking not found' 
        }, 
        { status: 404 }
      );
    }

    // 3. Cek apakah booking bisa dibatalkan
    if (existingBooking.status === 'rejected' || existingBooking.status === 'cancelled') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking sudah dibatalkan atau ditolak' 
        }, 
        { status: 400 }
      );
    }

    // 4. Cek apakah sudah dekat dengan tanggal pendakian (misal: 3 hari)
    const entryDate = new Date(existingBooking.tanggal_masuk);
    const today = new Date();
    const daysUntilEntry = Math.ceil((entryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilEntry <= 3) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking tidak dapat dibatalkan karena sudah dekat dengan tanggal pendakian' 
        }, 
        { status: 400 }
      );
    }

    // 5. Update status booking menjadi cancelled
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        alasan_penolakan: reason || 'Dibatalkan oleh pemesan',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error cancelling booking:', updateError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to cancel booking' 
        }, 
        { status: 500 }
      );
    }

    // 6. Log pembatalan
    await supabase
      .from('booking_logs')
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        action: 'booking_cancelled',
        old_data: {
          status: existingBooking.status,
        },
        new_data: {
          status: 'cancelled',
          reason: reason || 'Dibatalkan oleh pemesan',
        },
      });

    return NextResponse.json({
      success: true,
      message: 'Booking berhasil dibatalkan',
      booking: updatedBooking,
    });

  } catch (error) {
    console.error('Cancel booking API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 