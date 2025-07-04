import { NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

// GET /api/admin/bookings/list
export async function GET() {
  // Ambil semua data booking beserta nama dan lokasi gunung
  const { data, error } = await supabase
    .from('Booking')
    .select('*, Gunung:gunungId(nama, lokasi)');

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  // Map nama dan lokasi gunung ke root object agar mudah diakses frontend
  const bookings = (data || []).map((b: any) => ({
    ...b,
    nama_gunung: b.Gunung?.nama || '-',
    lokasi_gunung: b.Gunung?.lokasi || '-',
  }));

  return NextResponse.json({ success: true, bookings }, { status: 200 });
} 
