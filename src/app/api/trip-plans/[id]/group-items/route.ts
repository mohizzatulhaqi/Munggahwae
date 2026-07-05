import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

interface Params {
  params: { id: string };
}

export async function POST(request: Request, { params }: Params) {
  const { name, price, imageUrl } = (await request.json()) as {
    name?: string;
    price?: number;
    imageUrl?: string | null;
  };

  if (!name?.trim() || (price !== undefined && (typeof price !== 'number' || Number.isNaN(price) || price < 0))) {
    return NextResponse.json({ error: 'Nama dan harga barang harus valid' }, { status: 400 });
  }

  const item = await prisma.tripGroupItem.create({
    data: { tripPlanId: params.id, name: name.trim(), price: price ?? 0, imageUrl: imageUrl || null },
  });

  return NextResponse.json(
    { id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl },
    { status: 201 },
  );
}
