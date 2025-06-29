import { notFound } from 'next/navigation';
import BookingTermsPage from '@/components/pages/booking-terms-page';

interface BookingTermsPageProps {
  params: {
    id: string;
  };
}

export default async function BookingTerms({ params }: BookingTermsPageProps) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/gunung/${params.id}`, { cache: 'no-store' });
  const data = await res.json();

  if (!data.success || !data.mountain) {
    notFound();
  }

  return <BookingTermsPage mountain={data.mountain} />;
}
