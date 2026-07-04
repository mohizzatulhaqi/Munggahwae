import { NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';
import { getTripPlanDTO } from '../serialize';

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  const dto = await getTripPlanDTO(params.id);
  if (!dto) {
    return NextResponse.json({ error: 'Rencana tidak ditemukan' }, { status: 404 });
  }
  return NextResponse.json(dto);
}

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const { mountainId, mountainName, startDate, endDate, members } = body as {
    mountainId?: string;
    mountainName?: string;
    startDate?: string;
    endDate?: string;
    members?: { id?: string; name: string }[];
  };

  if (!mountainId || !mountainName || !startDate || !endDate) {
    return NextResponse.json({ error: 'Data rencana tidak lengkap' }, { status: 400 });
  }

  const orderedMembers = (members ?? [])
    .map((m) => ({ id: m.id, name: m.name.trim() }))
    .filter((m) => m.name)
    .map((m, order) => ({ ...m, order }));

  if (orderedMembers.length === 0) {
    return NextResponse.json({ error: 'Minimal satu anggota kelompok harus diisi' }, { status: 400 });
  }

  const existing = await prisma.tripPlan.findUnique({
    where: { id: params.id },
    include: { members: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Rencana tidak ditemukan' }, { status: 404 });
  }

  const keepIds = new Set(orderedMembers.filter((m) => m.id).map((m) => m.id as string));
  const removedIds = existing.members.filter((m) => !keepIds.has(m.id)).map((m) => m.id);

  await prisma.$transaction([
    prisma.tripPlan.update({
      where: { id: params.id },
      data: {
        mountainId,
        mountainName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    }),
    ...(removedIds.length
      ? [prisma.tripMember.deleteMany({ where: { id: { in: removedIds } } })]
      : []),
    ...orderedMembers
      .filter((m) => m.id)
      .map((m) =>
        prisma.tripMember.update({
          where: { id: m.id },
          data: { name: m.name, order: m.order },
        }),
      ),
    ...orderedMembers
      .filter((m) => !m.id)
      .map((m) =>
        prisma.tripMember.create({
          data: { tripPlanId: params.id, name: m.name, order: m.order },
        }),
      ),
  ]);

  const dto = await getTripPlanDTO(params.id);
  return NextResponse.json(dto);
}
