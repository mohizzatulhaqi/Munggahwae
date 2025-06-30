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

  const handlePersonalDataSubmit = (personalData: PersonalData) => {
    // Update this booker's data
    const updatedBookers = [...bookingData.bookers]
    updatedBookers[bookerIndex] = personalData
    updateGlobalBookingData({
      bookers: updatedBookers,
    })

    // Check if this is the last booker
    if (bookerIndex === totalBookers - 1) {
      alert("Pendaftaran berhasil!")
      console.log("Final booking data:", getGlobalBookingData())
      router.push("/confirmation")
    } else {
      router.push(`/mountain/${params.id}/booking-terms/booking-form/personal-data/${bookerIndex + 1}`)
    }
  }

  const handlePreviousBooker = () => {
    if (bookerIndex > 0) {
      router.push(`/mountain/${params.id}/booking-terms/booking-form/personal-data/${bookerIndex - 1}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PersonalDataForm
        onSubmit={handlePersonalDataSubmit}
        onNext={() =>
          router.push(`/mountain/${params.id}/booking-terms/booking-form/personal-data/${bookerIndex + 1}`)
        }
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
