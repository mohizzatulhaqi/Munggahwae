import { NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function GET() {
  try {
    // Test query to see what columns exist
    const { data, error } = await supabase
      .from('Booking')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: error.message,
        code: error.code 
      }, { status: 500 });
    }

    // Get column names from the first record
    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
    
    return NextResponse.json({ 
      success: true, 
      columns,
      sampleData: data?.[0] || null
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Terjadi kesalahan' 
    }, { status: 500 });
  }
} 