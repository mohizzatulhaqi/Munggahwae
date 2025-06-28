import BookingDetailPage from "@/components/pages/booking-detail-page"

export default function BookingDetail({ params }: { params: { id: string } }) {
  return <BookingDetailPage bookingId={params.id} />
}
