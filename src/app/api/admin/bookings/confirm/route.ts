import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

// POST /api/admin/bookings/confirm
export async function POST(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ success: false, message: 'ID booking wajib diisi' }, { status: 400 });
  }

  const { error } = await supabase
    .from('Booking')
    .update({ status: 'dikonfirmasi' })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Booking berhasil dikonfirmasi' }, { status: 200 });
} 