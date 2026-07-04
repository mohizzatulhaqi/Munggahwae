import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

// POST /api/bookings
// Membuat entri pemesanan baru
export async function POST(request: Request) {
  const body = await request.json();
  const { mountainId, entryDate, exitDate, numberOfBookers } = body as {
    mountainId?: string;
    entryDate?: string;
    exitDate?: string;
    numberOfBookers?: number;
  };

  if (!mountainId || !entryDate || !exitDate || !numberOfBookers) {
    return NextResponse.json({ error: 'Data pemesanan tidak lengkap' }, { status: 400 });
  }

  const pemesanan = await prisma.pemesanan.create({
    data: {
      mountainId,
      tanggalMasuk: new Date(entryDate),
      tanggalKeluar: new Date(exitDate),
      jumlahPemesan: numberOfBookers,
    },
  });

  return NextResponse.json({ id: pemesanan.id }, { status: 201 });
}
