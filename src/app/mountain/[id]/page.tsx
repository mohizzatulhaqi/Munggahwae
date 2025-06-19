import { notFound } from "next/navigation"
import { getMountainById } from "@/lib/mountain-data"
import MountainDetailPage from "@/components/pages/mountain-detail-page"

interface MountainPageProps {
  params: {
    id: string
  }
}

export default function MountainPage({ params }: MountainPageProps) {
  const mountain = getMountainById(params.id)

  if (!mountain) {
    notFound()
  }

  return <MountainDetailPage mountain={mountain} />
}
