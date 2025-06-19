import { notFound } from 'next/navigation';
import { getMountainById } from '@/lib/mountain-data';
import BookingTermsPage from '@/components/pages/booking-terms-page';

interface BookingTermsPageProps {
  params: {
    id: string;
  };
}

export default function BookingTerms({ params }: BookingTermsPageProps) {
  const mountain = getMountainById(params.id);

  if (!mountain) {
    notFound();
  }

  return <BookingTermsPage mountain={mountain} />;
}
