import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

interface Params {
  params: { id: string; memberId: string };
}

export async function POST(request: Request, { params }: Params) {
  const { name, imageUrl } = (await request.json()) as { name?: string; imageUrl?: string | null };

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Nama barang tidak boleh kosong' }, { status: 400 });
  }

  const item = await prisma.tripPersonalItem.create({
    data: { memberId: params.memberId, name: name.trim(), imageUrl: imageUrl || null },
  });

  return NextResponse.json(
    { id: item.id, name: item.name, checked: item.checked, imageUrl: item.imageUrl },
    { status: 201 },
  );
}
