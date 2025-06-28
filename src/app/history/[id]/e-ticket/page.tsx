import ETicketPage from "@/components/pages/e-ticket-page"

export default function ETicket({ params }: { params: { id: string } }) {
  return <ETicketPage bookingId={params.id} />
}
