import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Query detail gunung dengan relasi Jalur, GaleriGunung, dan Peraturan
    const { data: gunung, error } = await supabase
      .from('Gunung')
      .select(`*, Jalur(*), GaleriGunung(*), Peraturan(*)`)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Gunung not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching gunung:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch gunung' },
        { status: 500 }
      );
    }

    if (!gunung) {
      return NextResponse.json(
        { success: false, error: 'Gunung not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mountain: gunung
    });
  } catch (error) {
    console.error('Error fetching gunung:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gunung' },
      { status: 500 }
    );
  }
} 