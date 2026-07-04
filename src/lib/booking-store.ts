export interface BookingData {
  pemesananId?: string
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
  healthCertificateFile?: File
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
