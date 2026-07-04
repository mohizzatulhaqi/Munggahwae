import TripPlanMenu from '@/components/pages/trip-plan-menu';

interface TripPlanPageProps {
  params: { id: string };
}

export default function Page({ params }: TripPlanPageProps) {
  return <TripPlanMenu id={params.id} />;
}
