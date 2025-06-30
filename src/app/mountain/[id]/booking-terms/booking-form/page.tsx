"use client"

import DateSelectionForm from "@/components/pages/date-selection-form"
import { useParams, useRouter } from "next/navigation"
import {mountainsData, type Mountain } from "@/lib/mountain-data"


export interface BookingData {
  entryDate: string
  exitDate: string
  numberOfBookers: number
  bookers: PersonalData[]
  selectedTrail: string
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
  healthCertificateFile?: File 
  age?: number // Calculated age
}

// Create a global store to persist data between pages
// In a real app, you might use localStorage, cookies, or a state management library
let globalBookingData: BookingData = {
  entryDate: "",
  exitDate: "",
  numberOfBookers: 1,
  bookers: [],
  selectedTrail: "",
}

export function getGlobalBookingData() {
  return globalBookingData
}

export function updateGlobalBookingData(data: Partial<BookingData>) {
  globalBookingData = { ...globalBookingData, ...data }
}

export default function HomePage() {
  const router = useRouter()

  const params = useParams();
  const mountainId = params?.id as string;
  const mountain = mountainsData.find((m) => m.id === mountainId);

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
      idCardFile: undefined,
      healthCertificateFile: undefined, // ← Tambahkan ini
      isCompanion: false,
      age: undefined,
    }))

    // Update global state
    updateGlobalBookingData({
      ...dates,
      bookers: emptyBookers,
    })

    // Navigate to the personal data form page with the first booker
    console.log('Redirecting to', `/mountain/${mountainId}/booking-terms/booking-form/personal-data/0`);
    router.push(`/mountain/${mountainId}/booking-terms/booking-form/personal-data/0`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DateSelectionForm onSubmit={handleDateSubmit} />
    </div>
  )
}
