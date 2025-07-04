"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DateSelectionForm from "@/components/pages/date-selection-form";

export interface BookingData {
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
}

// Create a global store to persist data between pages
// In a real app, you might use localStorage, cookies, or a state management library
let globalBookingData: BookingData = {
  entryDate: '',
  exitDate: '',
  numberOfBookers: 1,
  bookers: [],
}

export function getGlobalBookingData() {
  return globalBookingData;
}

export function updateGlobalBookingData(data: Partial<BookingData>) {
  globalBookingData = { ...globalBookingData, ...data };
}

export default function BookingFormPage() {
  const router = useRouter()
  const params = useParams();
  const mountainId = params?.id as string;
  const [mountain, setMountain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mountainId) {
      fetch(`/api/gunung/${mountainId}`)
        .then(res => res.json())
        .then(data => {
          setMountain(data.mountain);
          setLoading(false);
        });
    }
  }, [mountainId]);

  const handleDateSubmit = (dates: { entryDate: string; exitDate: string; numberOfBookers: number; selectedTrail: string; price?: number }) => {
    console.log('handleDateSubmit called with:', dates);
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
    console.log('Redirecting to', `/mountain/${mountainId}/booking-terms/booking-form/personal-data/0`);
    router.push(`/mountain/${mountain?.id}/booking-terms/booking-form/personal-data/0`)
  }

  if (loading) return <div>Loading...</div>;
  if (!mountain) return <div>Gunung tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <DateSelectionForm mountain={mountain} onSubmit={handleDateSubmit} />
    </div>
  );
}
