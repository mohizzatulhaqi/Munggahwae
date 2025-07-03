import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function GET() {
  const { data, error } = await supabase.from('gunung').select('*');
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, gunungs: data }, { status: 200 });
} 