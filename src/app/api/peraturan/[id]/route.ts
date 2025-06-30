import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Query semua peraturan untuk gunung dengan id tertentu
    const { data: peraturan, error } = await supabase
      .from('Peraturan')
      .select('isi')
      .eq('gunungId', id)
      .order('orderIndex', { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch peraturan' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rules: peraturan
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch peraturan' },
      { status: 500 }
    );
  }
} 