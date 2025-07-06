import { NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function GET() {
  try {
    // 1. Get booking statistics
    const { data: bookings, error: bookingsError } = await supabase
      .from('Booking')
      .select('*, Gunung:gunungId(nama, lokasi)');

    if (bookingsError) {
      return NextResponse.json({ success: false, message: bookingsError.message }, { status: 500 });
    }

    // 2. Get today's bookings - skip date filtering for now to avoid array literal error
    const { data: todayBookings, error: todayBookingsError } = await supabase
      .from('Booking')
      .select('*');

    if (todayBookingsError) {
      return NextResponse.json({ success: false, message: todayBookingsError.message }, { status: 500 });
    }

    // 3. Get total mountains count
    const { count: totalMountains, error: mountainsError } = await supabase
      .from('Gunung')
      .select('*', { count: 'exact', head: true });

    if (mountainsError) {
      return NextResponse.json({ success: false, message: mountainsError.message }, { status: 500 });
    }

    // Calculate statistics
    const allBookings = bookings || [];
    const todayBookingsList = todayBookings || [];
    
    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Booking status counts
    const confirmedBookings = allBookings.filter(b => b.status === 'confirmed' || b.status === 'dikonfirmasi').length;
    const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
    const cancelledBookings = allBookings.filter(b => b.status === 'cancelled' || b.status === 'dibatalkan').length;
    
    // Today's new bookings - filter manually in JavaScript
    const newBookingsToday = todayBookingsList.filter(booking => {
      if (!booking.createdAt) return false;
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= today;
    }).length;
    
    // Total climbers (sum of jumlahPemesan)
    const totalClimbers = allBookings.reduce((sum, b) => sum + (b.jumlahPemesan || 0), 0);
    
    // Popular mountain (most booked)
    const mountainBookings: { [key: string]: number } = {};
    allBookings.forEach(booking => {
      if (booking.gunungId) {
        mountainBookings[booking.gunungId] = (mountainBookings[booking.gunungId] || 0) + 1;
      }
    });
    
    let popularMountain = 'Tidak ada data';
    if (Object.keys(mountainBookings).length > 0) {
      const mostBookedMountainId = Object.keys(mountainBookings).reduce((a, b) => 
        mountainBookings[a] > mountainBookings[b] ? a : b
      );
      
      // Get mountain name
      const mountain = allBookings.find(b => b.gunungId === mostBookedMountainId);
      popularMountain = mountain?.Gunung?.nama || 'Tidak diketahui';
    }
    
    // Total revenue from confirmed bookings
    const totalRevenue = allBookings
      .filter(b => b.status === 'confirmed' || b.status === 'dikonfirmasi')
      .reduce((sum, b) => sum + (b.totalHarga || 0), 0);

    const statistics = {
      // Today's stats
      newBookings: newBookingsToday,
      activeUsers: totalClimbers,
      popularMountain: popularMountain,
      
      // Overall stats
      totalBookings: allBookings.length,
      confirmedBookings: confirmedBookings,
      pendingBookings: pendingBookings,
      cancelledBookings: cancelledBookings,
      totalMountains: totalMountains || 0,
      totalRevenue: totalRevenue,
      
      // Additional metrics
      averageBookingValue: allBookings.length > 0 ? totalRevenue / allBookings.length : 0,
      bookingSuccessRate: allBookings.length > 0 ? (confirmedBookings / allBookings.length) * 100 : 0,
    };

    return NextResponse.json({ 
      success: true, 
      statistics 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Terjadi kesalahan saat mengambil statistik' 
    }, { status: 500 });
  }
} 