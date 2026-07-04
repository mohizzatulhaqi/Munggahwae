import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';
import { getTripPlanDTO, listTripPlanSummaries } from './serialize';

export async function GET() {
  const plans = await listTripPlanSummaries();
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { mountainId, mountainName, startDate, endDate, memberNames } = body as {
    mountainId?: string;
    mountainName?: string;
    startDate?: string;
    endDate?: string;
    memberNames?: string[];
  };

  if (!mountainId || !mountainName || !startDate || !endDate) {
    return NextResponse.json({ error: 'Data rencana tidak lengkap' }, { status: 400 });
  }

  const names = (memberNames ?? []).map((name) => name.trim()).filter(Boolean);
  if (names.length === 0) {
    return NextResponse.json({ error: 'Minimal satu anggota kelompok harus diisi' }, { status: 400 });
  }

  const plan = await prisma.tripPlan.create({
    data: {
      mountainId,
      mountainName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      members: {
        create: names.map((name, index) => ({ name, order: index })),
      },
    },
  });

  const dto = await getTripPlanDTO(plan.id);
  return NextResponse.json(dto, { status: 201 });
}
