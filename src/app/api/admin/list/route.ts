import { NextResponse } from 'next/server';
import { supabase } from '@/app/api/supabaseClient';

type Gunung = {
  id: string;
  nama: string;
  kuotaPerHari: number;
  harga: number;
  jalur: number;
  lokasi: string;
  urlGambar: string;
};

export async function GET() {
  // Ambil data gunung
  const { data: gunungData, error: gunungError } = await supabase
    .from('Gunung')
    .select('id, nama, kuotaPerHari, harga, lokasi, urlGambar');

  if (gunungError) {
    return NextResponse.json({ success: false, message: gunungError.message }, { status: 500 });
  }

  const gunungList = gunungData as Array<{
    id: string;
    nama: string;
    kuotaPerHari: number;
    harga: number;
    lokasi: string;
    urlGambar: string;
  }>;

  // Ambil semua jalur berdasarkan gunungId yang ada
  const gunungIds = gunungList.map(g => g.id);

  const { data: jalurData, error: jalurError } = await supabase
    .from('Jalur')
    .select('gunungId');

  if (jalurError) {
    return NextResponse.json({ success: false, message: jalurError.message }, { status: 500 });
  }

  // Hitung jumlah jalur untuk masing-masing gunung
  const jumlahJalurPerGunung: Record<string, number> = {};
  gunungIds.forEach(id => {
    jumlahJalurPerGunung[id] = jalurData?.filter(jalur => jalur.gunungId === id).length ?? 0;
  });

  // Gabungkan jumlah jalur ke data gunung
  const gunungWithJalur: Gunung[] = gunungList.map(gunung => ({
    ...gunung,
    jalur: jumlahJalurPerGunung[gunung.id] ?? 0,
  }));

  return NextResponse.json({ success: true, gunung: gunungWithJalur }, { status: 200 });
}