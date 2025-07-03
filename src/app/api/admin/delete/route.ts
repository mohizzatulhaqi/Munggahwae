import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ success: false, message: 'ID wajib diisi.' }, { status: 400 });
  }
  // Hapus user dengan role admin
  const { error } = await supabase.from('user').delete().eq('id', id).eq('role', 'admin');
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: 'Admin berhasil dihapus.' }, { status: 200 });
} 