import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

interface Params {
  params: { id: string; memberId: string };
}

export async function PATCH(request: Request, { params }: Params) {
  const { hasPaid } = (await request.json()) as { hasPaid: boolean };

  await prisma.tripMember.updateMany({
    where: { id: params.memberId, tripPlanId: params.id },
    data: { hasPaid },
  });

  return NextResponse.json({ success: true });
}
