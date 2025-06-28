"use client"

import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import PaymentPage from "@/components/pages/payment-page"
import { getGlobalBookingData } from "../page"

export default function Payment() {
  const router = useRouter()
  const params = useParams()
  const mountainId = params?.id as string
  const bookingData = getGlobalBookingData()

  const handlePaymentSuccess = () => {
    router.push(`/mountain/${mountainId}/booking-terms/booking-form/confirmation`)
  }

  const handlePaymentCancel = () => {
    router.back()
  }

  return (
    <PaymentPage
      bookingData={bookingData}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentCancel={handlePaymentCancel}
    />
  )
}
