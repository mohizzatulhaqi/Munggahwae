import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ success: false, message: 'ID wajib diisi.' }, { status: 400 });
  }
  const { error } = await supabase.from('gunung').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: 'Gunung berhasil dihapus.' }, { status: 200 });
} 