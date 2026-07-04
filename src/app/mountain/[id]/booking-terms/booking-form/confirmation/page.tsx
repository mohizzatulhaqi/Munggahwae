"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"
import { getGlobalBookingData } from "@/lib/booking-store"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"

export default function ConfirmationPage() {
  const router = useRouter()
  const bookingData = getGlobalBookingData()

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">Pendaftaran Berhasil!</h1>
            <p className="text-center text-gray-600">Terima kasih telah mendaftar untuk pendakian Gunung Rinjani</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-t border-b py-4">
              <h2 className="font-semibold mb-2">Detail Pendakian</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Tanggal Masuk:</div>
                <div>{new Date(bookingData.entryDate).toLocaleDateString("id-ID")}</div>
                <div className="text-gray-600">Tanggal Keluar:</div>
                <div>{new Date(bookingData.exitDate).toLocaleDateString("id-ID")}</div>
                <div className="text-gray-600">Jumlah Pendaki:</div>
                <div>{bookingData.numberOfBookers} orang</div>
              </div>
            </div>

            <div className="flex gap-x-2">
              <Button onClick={() => router.push("/")} className="w-full">
                Kembali ke Beranda
              </Button>
              <Button onClick={() => router.push("/history")} className="w-full" variant="secondary">
                Lihat Riwayat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </>
  )
}
