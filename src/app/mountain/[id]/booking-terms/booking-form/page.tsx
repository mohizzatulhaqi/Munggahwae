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

  const handleDateSubmit = async (dates: {
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

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mountainId, ...dates }),
    })

    if (!res.ok) {
      alert('Gagal membuat pemesanan. Silakan coba lagi.')
      return
    }

    const { id: pemesananId } = await res.json()

    // Update global state
    updateGlobalBookingData({
      pemesananId,
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
