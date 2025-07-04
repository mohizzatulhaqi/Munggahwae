import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ 
      success: false, 
      message: 'ID gunung wajib diisi' 
    }, { status: 400 });
  }

  
  try {
    // Delete data gunung
    const { error } = await supabase
      .from('Gunung')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        success: false, 
        message: error.message || 'Gagal menghapus gunung' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Gunung berhasil dihapus'
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Terjadi kesalahan internal server' 
    }, { status: 500 });
  }
} 