<<<<<<< HEAD
'use client';

import React from 'react';
=======
"use client"

import DateSelectionForm from "@/components/pages/date-selection-form"
import { useParams, useRouter } from "next/navigation"
import {mountainsData, type Mountain } from "@/lib/mountain-data"
>>>>>>> faiz

import { useParams, useRouter } from 'next/navigation';
import DateSelectionForm from '@/components/pages/date-selection-form';
import { mountainsData, type Mountain } from '@/lib/mountain-data';
import BookingTermsPage from '@/components/pages/booking-terms-page';

export interface BookingData {
<<<<<<< HEAD
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
=======
  entryDate: string
  exitDate: string
  numberOfBookers: number
  bookers: PersonalData[]
}

export interface PersonalData {
  email: string
  fullName: string
  idNumber: string
  phoneNumber: string
  gender: "male" | "female"
  birthDate: string
  birthPlace: string
  idCardFile?: File
  isCompanion?: boolean // New field for companion role
  age?: number // Calculated age
>>>>>>> faiz
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

<<<<<<< HEAD
export default function BookignForm() {
  const router = useRouter();
=======
export default function HomePage() {
  const router = useRouter()
>>>>>>> faiz

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
<<<<<<< HEAD
    router.push(`/mountain/${mountain?.id}/booking-terms/booking-form/personal-data/0`);
  };
=======
    router.push(`/mountain/${mountain?.id}/booking-terms/booking-form/personal-data/0`)
  }
>>>>>>> faiz

  return (
    <div className="min-h-screen bg-gray-50">
      <DateSelectionForm onSubmit={handleDateSubmit} />
    </div>
  );
}
