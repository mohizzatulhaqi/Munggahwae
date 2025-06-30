import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET /api/history/[id]/e-ticket
// Generate E-Ticket untuk pemesanan yang sudah disetujui
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

    // 2. Ambil data booking dengan join ke mountains dan booking members
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        mountains (
          id,
          name,
          location,
          province,
          image_url
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
          is_companion
        )
      `)
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Booking not found or not approved' 
          }, 
          { status: 404 }
        );
      }
      
      console.error('Error fetching booking for e-ticket:', error);
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
          error: 'Booking not found or not approved' 
        }, 
        { status: 404 }
      );
    }

    // 3. Generate E-Ticket data
    const eTicketData = {
      ticketNumber: `ET-${booking.id.slice(0, 8).toUpperCase()}-${Date.now()}`,
      bookingCode: booking.kode_booking || `BK-${booking.id.slice(0, 8).toUpperCase()}`,
      mountainName: booking.mountains?.name,
      mountainLocation: `${booking.mountains?.location}, ${booking.mountains?.province}`,
      entryDate: booking.tanggal_masuk,
      exitDate: booking.tanggal_keluar,
      numberOfPeople: booking.jumlah_pemesan,
      totalCost: booking.total_harga,
      status: booking.status,
      paymentStatus: booking.payment_status,
      issuedAt: new Date().toISOString(),
      validUntil: booking.tanggal_keluar,
      members: booking.booking_members?.map((member: any) => ({
        name: member.nama,
        idNumber: member.no_identitas,
        nationality: member.kewarganegaraan,
        gender: member.jenis_kelamin,
        isCompanion: member.is_companion,
      })) || [],
      terms: [
        'Tiket ini berlaku untuk satu kali pendakian sesuai tanggal yang tertera',
        'Pendaki wajib membawa identitas asli yang sesuai dengan data pemesanan',
        'Pendaki wajib mengikuti peraturan dan protokol keselamatan yang berlaku',
        'Tiket tidak dapat dipindahtangankan atau diperjualbelikan',
        'Pendaki wajib menjaga kelestarian lingkungan dan tidak membuang sampah sembarangan',
        'Pendaki wajib melapor ke pos pendakian sebelum memulai pendakian',
        'Pendaki wajib membawa perlengkapan keselamatan yang diperlukan',
        'Tiket akan hangus jika tidak digunakan sesuai tanggal yang tertera',
      ],
      contactInfo: {
        emergency: '+62-123-456-789',
        office: '+62-123-456-780',
        email: 'info@munggahwae.com',
        website: 'www.munggahwae.com',
      },
    };

    // 4. Log e-ticket generation
    await supabase
      .from('booking_logs')
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        action: 'e_ticket_generated',
        new_data: { eTicketNumber: eTicketData.ticketNumber },
      });

    return NextResponse.json({
      success: true,
      eTicket: eTicketData,
    });

  } catch (error) {
    console.error('E-Ticket API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 