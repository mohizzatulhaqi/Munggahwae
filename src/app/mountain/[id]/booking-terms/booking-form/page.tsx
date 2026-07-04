"use client"

import { useParams, useRouter } from 'next/navigation';
import DateSelectionForm from '@/components/pages/date-selection-form';
import { mountainsData } from '@/lib/mountain-data';
import { updateGlobalBookingData } from '@/lib/booking-store';

export default function HomePage() {
  const router = useRouter()

  const params = useParams();
  const mountainId = params?.id as string;
  const mountain = mountainsData.find((m) => m.id === mountainId);

  const handleDateSubmit = (dates: {
    entryDate: string;
    exitDate: string;
    numberOfBookers: number;
  }) => {
    // Initialize empty bookers array based on numberOfBookers
    const emptyBookers = Array.from({ length: dates.numberOfBookers }, () => ({
      email: "",
      fullName: "",
      idNumber: "",
      phoneNumber: "",
      gender: "male" as const,
      birthDate: "",
      birthPlace: "",
    }))

    // Update global state
    updateGlobalBookingData({
      ...dates,
      bookers: emptyBookers,
    });

    // Navigate to the personal data form page with the first booker
    router.push(`/mountain/${mountain?.id}/booking-terms/booking-form/personal-data/0`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DateSelectionForm onSubmit={handleDateSubmit} />
    </div>
  );
}
