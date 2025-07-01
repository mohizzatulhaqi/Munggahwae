import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET /api/history
// Mendapatkan riwayat pemesanan untuk pengguna yang sedang login
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);

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

    // 2. Ambil query parameters
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 3. Build query untuk mengambil data booking dengan join ke mountains
    let query = supabase
      .from('Booking')
      .select(`
        *,
        Gunung (
          id,
          nama,
          lokasi,
          provinsi,
          urlGambar,
          urlGambarHero
        ),
        Jalur (
          id,
          nama,
          tingkatKesulitan
        )
      `)
      .eq('userId', user.id)
      .order('createdAt', { ascending: false });

    // 4. Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`Gunung.nama.ilike.%${search}%,kode_booking.ilike.%${search}%`);
    }

    // 5. Apply pagination
    query = query.range(offset, offset + limit - 1);

    // 6. Execute query
    const { data: bookings, error, count } = await query;

    if (error) {
      console.error('Error fetching user bookings:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch bookings' 
        }, 
        { status: 500 }
      );
    }

    // 7. Transform data untuk kompatibilitas dengan frontend
    const transformedBookings = bookings?.map((booking: any) => ({
      id: booking.id,
      kodeBooking: booking.kodeBooking || `BK-${booking.id.slice(0, 8).toUpperCase()}`,
      tanggalMasuk: booking.tanggalMasuk,
      tanggalKeluar: booking.tanggalKeluar,
      jumlahPemesan: booking.jumlahPemesan,
      totalBiaya: booking.totalBiaya,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      alasanPenolakan: booking.alasanPenolakan,
      gunung: {
        id: booking.Gunung?.id,
        nama: booking.Gunung?.nama,
        lokasi: booking.Gunung?.lokasi,
        provinsi: booking.Gunung?.provinsi,
        urlGambar: booking.Gunung?.urlGambar,
        urlGambarHero: booking.Gunung?.urlGambarHero,
      },
      jalur: booking.Jalur ? {
        id: booking.Jalur.id,
        nama: booking.Jalur.nama,
        tingkatKesulitan: booking.Jalur.tingkatKesulitan,
      } : null,
    })) || [];

    return NextResponse.json({
      success: true,
      bookings: transformedBookings,
      total: count || transformedBookings.length,
      page,
      limit,
      totalPages: Math.ceil((count || transformedBookings.length) / limit),
    });

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 