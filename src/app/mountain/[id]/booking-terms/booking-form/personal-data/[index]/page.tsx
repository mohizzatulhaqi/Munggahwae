"use client"
import { useRouter, useParams } from "next/navigation"
import { getGlobalBookingData, PersonalData, updateGlobalBookingData } from "../../page"
import PersonalDataForm from "@/components/pages/personal-data-form"


export default function PersonalDataPage() {
  const router = useRouter()
  const params = useParams()
  const bookerIndex = Number.parseInt(params.index as string, 10)
  const bookingData = getGlobalBookingData()
  const totalBookers = bookingData.numberOfBookers

  const handlePersonalDataSubmit = async (personalData: PersonalData) => {
    // Update this booker's data
    const updatedBookers = [...bookingData.bookers]
    updatedBookers[bookerIndex] = personalData
    updateGlobalBookingData({
      bookers: updatedBookers,
    })

    // Check if this is the last booker
    if (bookerIndex === totalBookers - 1) {
      // All bookers completed, submit to backend
      try {
        const bookingPayload = {
          entryDate: bookingData.entryDate,
          exitDate: bookingData.exitDate,
          numberOfBookers: bookingData.numberOfBookers,
          bookers: updatedBookers,
          // Tambahkan id gunung jika perlu
        };
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Gagal menyimpan booking');
        alert('Pendaftaran berhasil!');
        router.push('/confirmation');
      } catch (err: any) {
        alert(err.message || 'Terjadi kesalahan saat menyimpan booking');
      }
    } else {
      // Move to next booker
      router.push(`/personal-data/${bookerIndex + 1}`)
    }
  }

  const handleBack = () => {
    router.push("/mountain/[id]/booking-terms/booking-form")
  }

  const handleNextBooker = () => {
    if (bookerIndex < totalBookers - 1) {
      router.push(`/personal-data/${bookerIndex + 1}`)
    }
  }

  const handlePreviousBooker = () => {
    if (bookerIndex > 0) {
      router.push(`/personal-data/${bookerIndex - 1}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PersonalDataForm
        onSubmit={handlePersonalDataSubmit}
        onBack={handleBack}
        onNext={handleNextBooker}
        onPrevious={handlePreviousBooker}
        bookerIndex={bookerIndex}
        totalBookers={totalBookers}
        initialData={bookingData.bookers[bookerIndex]}
        canGoNext={bookerIndex < totalBookers - 1}
        canGoPrevious={bookerIndex > 0}
        isLastBooker={bookerIndex === totalBookers - 1}
        allBookersData={bookingData.bookers}
      />
    </div>
  )
}