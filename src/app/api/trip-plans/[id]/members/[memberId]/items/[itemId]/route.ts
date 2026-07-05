import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

interface Params {
  params: { id: string; memberId: string; itemId: string };
}

export async function PATCH(request: Request, { params }: Params) {
  const { checked, name, imageUrl } = (await request.json()) as {
    checked?: boolean;
    name?: string;
    imageUrl?: string | null;
  };

  if (name !== undefined && !name.trim()) {
    return NextResponse.json({ error: 'Nama barang tidak boleh kosong' }, { status: 400 });
  }

  await prisma.tripPersonalItem.updateMany({
    where: { id: params.itemId, memberId: params.memberId },
    data: {
      ...(checked !== undefined && { checked }),
      ...(name !== undefined && { name: name.trim() }),
      ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: Params) {
  await prisma.tripPersonalItem.deleteMany({
    where: { id: params.itemId, memberId: params.memberId },
  });
  return NextResponse.json({ success: true });
}
