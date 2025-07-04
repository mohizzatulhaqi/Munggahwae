import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

// POST /api/admin/bookings/reject
export async function POST(req: NextRequest) {
  const { id, reason } = await req.json();

  if (!id || !reason) {
    return NextResponse.json({ success: false, message: 'ID dan alasan penolakan wajib diisi' }, { status: 400 });
  }

  const { error } = await supabase
    .from('Booking')
    .update({ status: 'rejected', alasan_tolak: reason })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Booking berhasil ditolak' }, { status: 200 });
} 