import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Query semua jalur untuk gunung dengan id tertentu
    const { data: trails, error } = await supabase
    .from('Jalur')
    .select('*')
    .eq('gunungId', id)
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Supabase error:', error); // debug error detail
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trails' },  
      { status: 500 }
    );
  }

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch trails' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      trails: trails || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trails' },
      { status: 500 }
    );
  }
} 