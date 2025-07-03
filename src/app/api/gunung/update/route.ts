import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function PUT(req: NextRequest) {
  const { id, ...updateData } = await req.json();
  if (!id) {
    return NextResponse.json({ success: false, message: 'ID wajib diisi.' }, { status: 400 });
  }
  const { data, error } = await supabase.from('gunung').update(updateData).eq('id', id).select();
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, gunung: data?.[0] }, { status: 200 });
} 