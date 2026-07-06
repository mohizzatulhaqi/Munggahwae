import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

interface Params {
  params: { id: string; entryId: string };
}

export async function PATCH(request: Request, { params }: Params) {
  const { entryDate, note, imageUrl, authorName } = (await request.json()) as {
    entryDate?: string;
    note?: string;
    imageUrl?: string | null;
    authorName?: string | null;
  };

  if (!entryDate || !note?.trim()) {
    return NextResponse.json({ error: 'Tanggal dan catatan harus diisi' }, { status: 400 });
  }

  await prisma.tripJournalEntry.updateMany({
    where: { id: params.entryId, tripPlanId: params.id },
    data: {
      entryDate: new Date(entryDate),
      note: note.trim(),
      imageUrl: imageUrl || null,
      authorName: authorName || null,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: Params) {
  await prisma.tripJournalEntry.deleteMany({
    where: { id: params.entryId, tripPlanId: params.id },
  });
  return NextResponse.json({ success: true });
}
