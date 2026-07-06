import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

interface Params {
  params: { id: string };
}

export async function POST(request: Request, { params }: Params) {
  const { entryDate, note, imageUrl, authorName } = (await request.json()) as {
    entryDate?: string;
    note?: string;
    imageUrl?: string | null;
    authorName?: string | null;
  };

  if (!entryDate || !note?.trim()) {
    return NextResponse.json({ error: 'Tanggal dan catatan harus diisi' }, { status: 400 });
  }

  const entry = await prisma.tripJournalEntry.create({
    data: {
      tripPlanId: params.id,
      entryDate: new Date(entryDate),
      note: note.trim(),
      imageUrl: imageUrl || null,
      authorName: authorName || null,
    },
  });

  return NextResponse.json(
    {
      id: entry.id,
      entryDate: entry.entryDate.toISOString().slice(0, 10),
      note: entry.note,
      imageUrl: entry.imageUrl,
      authorName: entry.authorName,
      createdAt: entry.createdAt.toISOString(),
    },
    { status: 201 },
  );
}
