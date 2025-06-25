'use client';

import React from 'react';

import { useParams, useRouter } from 'next/navigation';
import DateSelectionForm from '@/components/pages/date-selection-form';
import { mountainsData, type Mountain } from '@/lib/mountain-data';
import BookingTermsPage from '@/components/pages/booking-terms-page';

export interface BookingData {
  entryDate: string;
  exitDate: string;
  numberOfBookers: number;
  bookers: PersonalData[];
}

export interface PersonalData {
  email: string;
  fullName: string;
  idNumber: string;
  phoneNumber: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthPlace: string;
  idCardFile?: File;
}

// Create a global store to persist data between pages
// In a real app, you might use localStorage, cookies, or a state management library
let globalBookingData: BookingData = {
  entryDate: '',
  exitDate: '',
  numberOfBookers: 1,
  bookers: [],
};

export function getGlobalBookingData() {
  return globalBookingData;
}

export function updateGlobalBookingData(data: Partial<BookingData>) {
  globalBookingData = { ...globalBookingData, ...data };
}

export default function BookignForm() {
  const router = useRouter();

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
      email: '',
      fullName: '',
      idNumber: '',
      phoneNumber: '',
      gender: 'male' as const,
      birthDate: '',
      birthPlace: '',
    }));

    // Update global state
    updateGlobalBookingData({
      ...dates,
      bookers: emptyBookers,
    });

    // Navigate to the personal data form page with the first booker
    router.push(`/mountain/${mountain?.id}/booking-terms/booking-form/personal-data/0`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DateSelectionForm onSubmit={handleDateSubmit} />
    </div>
  );
}
