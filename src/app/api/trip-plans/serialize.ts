import type { TripPlanDTO, TripPlanSummaryDTO } from '@/lib/trip-plan-types';
import prisma from '@/app/api/prisma';

export async function getTripPlanDTO(id: string): Promise<TripPlanDTO | null> {
  const plan = await prisma.tripPlan.findUnique({
    where: { id },
    include: {
      members: {
        orderBy: { order: 'asc' },
        include: { personalItems: { orderBy: { createdAt: 'asc' } } },
      },
      groupItems: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!plan) return null;

  return {
    id: plan.id,
    mountainId: plan.mountainId,
    mountainName: plan.mountainName,
    startDate: plan.startDate.toISOString().slice(0, 10),
    endDate: plan.endDate.toISOString().slice(0, 10),
    members: plan.members.map((member) => ({
      id: member.id,
      name: member.name,
      order: member.order,
      personalItems: member.personalItems.map((item) => ({
        id: item.id,
        name: item.name,
        checked: item.checked,
        imageUrl: item.imageUrl,
      })),
    })),
    groupItems: plan.groupItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    })),
  };
}

export async function listTripPlanSummaries(): Promise<TripPlanSummaryDTO[]> {
  const plans = await prisma.tripPlan.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      members: { orderBy: { order: 'asc' }, include: { personalItems: true } },
      groupItems: true,
    },
  });

  return plans.map((plan) => {
    const allItems = plan.members.flatMap((m) => m.personalItems);
    return {
      id: plan.id,
      mountainId: plan.mountainId,
      mountainName: plan.mountainName,
      startDate: plan.startDate.toISOString().slice(0, 10),
      endDate: plan.endDate.toISOString().slice(0, 10),
      memberNames: plan.members.map((m) => m.name),
      totalGroupPrice: plan.groupItems.reduce((sum, item) => sum + item.price, 0),
      packedCount: allItems.filter((i) => i.checked).length,
      totalItemCount: allItems.length,
    };
  });
}
