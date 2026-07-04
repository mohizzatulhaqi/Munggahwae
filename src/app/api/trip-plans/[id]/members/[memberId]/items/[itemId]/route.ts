import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

interface Params {
  params: { id: string; memberId: string; itemId: string };
}

export async function PATCH(request: Request, { params }: Params) {
  const { checked } = (await request.json()) as { checked: boolean };

  await prisma.tripPersonalItem.updateMany({
    where: { id: params.itemId, memberId: params.memberId },
    data: { checked },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: Params) {
  await prisma.tripPersonalItem.deleteMany({
    where: { id: params.itemId, memberId: params.memberId },
  });
  return NextResponse.json({ success: true });
}
