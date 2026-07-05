import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

interface Params {
  params: { id: string; itemId: string };
}

export async function PATCH(request: Request, { params }: Params) {
  const { name, price, imageUrl } = (await request.json()) as {
    name?: string;
    price?: number;
    imageUrl?: string | null;
  };

  if (!name?.trim() || typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    return NextResponse.json({ error: 'Nama dan harga barang harus valid' }, { status: 400 });
  }

  await prisma.tripGroupItem.updateMany({
    where: { id: params.itemId, tripPlanId: params.id },
    data: { name: name.trim(), price, imageUrl: imageUrl || null },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: Params) {
  await prisma.tripGroupItem.deleteMany({
    where: { id: params.itemId, tripPlanId: params.id },
  });
  return NextResponse.json({ success: true });
}
