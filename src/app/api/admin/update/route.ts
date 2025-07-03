import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function PUT(req: NextRequest) {
  const { id, ...updateData } = await req.json();
  if (!id) {
    return NextResponse.json({ success: false, message: 'ID wajib diisi.' }, { status: 400 });
  }
  // Update data admin di tabel user
  const { data, error } = await supabase.from('user').update(updateData).eq('id', id).eq('role', 'admin').select();
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, user: data?.[0] }, { status: 200 });
} 