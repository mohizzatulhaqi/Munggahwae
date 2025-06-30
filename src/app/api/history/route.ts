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
      .from('bookings')
      .select(`
        *,
        mountains (
          id,
          name,
          location,
          province,
          image_url,
          hero_image_url
        ),
        trails (
          id,
          name,
          difficulty_level
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // 4. Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`mountains.name.ilike.%${search}%,kode_booking.ilike.%${search}%`);
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
        urlGambar: booking.mountains?.image_url,
        heroImageUrl: booking.mountains?.hero_image_url,
      },
      jalur: booking.trails ? {
        id: booking.trails.id,
        nama: booking.trails.name,
        tingkatKesulitan: booking.trails.difficulty_level,
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