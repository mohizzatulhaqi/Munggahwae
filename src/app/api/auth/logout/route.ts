import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Logout gagal' 
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Logout berhasil',
    });

  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 