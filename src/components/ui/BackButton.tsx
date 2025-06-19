"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"

const BackButton = () => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 px-4 py-2 text-global-1 hover:text-global-2 transition-colors"
    >
      <Image src="/placeholder.svg?height=20&width=20" alt="Back" width={20} height={20} className="rotate-180" />
      <span className="text-sm font-medium font-plus-jakarta">Kembali</span>
    </button>
  )
}

export default BackButton
