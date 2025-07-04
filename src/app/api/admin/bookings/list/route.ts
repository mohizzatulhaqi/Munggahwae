import { NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

// GET /api/admin/bookings/list
export async function GET() {
  // Ambil semua data booking
  const { data, error } = await supabase
    .from('Booking')
    .select('*');

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, bookings: data }, { status: 200 });
} 