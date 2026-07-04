import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

interface Params {
  params: { id: string; itemId: string };
}

export async function DELETE(request: Request, { params }: Params) {
  await prisma.tripGroupItem.deleteMany({
    where: { id: params.itemId, tripPlanId: params.id },
  });
  return NextResponse.json({ success: true });
}
