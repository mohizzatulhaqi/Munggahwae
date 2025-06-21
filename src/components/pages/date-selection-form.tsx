"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import Image from "next/image"
import { Mountain } from "@/lib/mountain-data"

interface DateSelectionFormProps {
  onSubmit: (dates: { entryDate: string; exitDate: string; numberOfBookers: number }) => void
  mountain : Mountain[]
}

export default function DateSelectionForm({ onSubmit }: DateSelectionFormProps) {
  const [entryDate, setEntryDate] = useState("")
  const [exitDate, setExitDate] = useState("")
  const [numberOfBookers, setNumberOfBookers] = useState(1)
  const [errors, setErrors] = useState<{ entryDate?: string; exitDate?: string; numberOfBookers?: string }>({})

  const validateDates = () => {
    const newErrors: { entryDate?: string; exitDate?: string; numberOfBookers?: string } = {}

    if (!entryDate) {
      newErrors.entryDate = "Tanggal masuk harus diisi"
    }

    if (!exitDate) {
      newErrors.exitDate = "Tanggal keluar harus diisi"
    }

    if (numberOfBookers < 1) {
      newErrors.numberOfBookers = "Jumlah pemesan minimal 1"
    } else if (numberOfBookers > 10) {
      newErrors.numberOfBookers = "Jumlah pemesan maksimal 10"
    }

    if (entryDate && exitDate) {
      const entry = new Date(entryDate)
      const exit = new Date(exitDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (entry < today) {
        newErrors.entryDate = "Tanggal masuk tidak boleh kurang dari hari ini"
      }

      if (exit <= entry) {
        newErrors.exitDate = "Tanggal keluar harus setelah tanggal masuk"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateDates()) {
      onSubmit({ entryDate, exitDate, numberOfBookers })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Pendakian</span>
          <span>/</span>
          <span>Gunung</span>
          <span>/</span>
          <span className="text-orange-600">Rinjani</span>
        </div>
      </div>

      {/* Full-width Mountain Image */}
      <div className="relative h-96 w-full">
        <Image src="/images/gunung-rinjani.png" alt="Gunung Rinjani" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">Gunung Rinjani</h1>
          <div className="flex items-center gap-4 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Lombok, NTB</span>
            </div>
            <div className="flex items-center gap-2">
              <span>3,726 mdpl</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Description Card */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-xl font-semibold">Deskripsi</h3>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p>
              Gunung Rinjani adalah gunung berapi yang berlokasi di Pulau Lombok, Nusa Tenggara Barat. Gunung yang
              memiliki ketinggian 3.726 meter di atas permukaan laut ini merupakan gunung berapi tertinggi kedua di
              Indonesia. Gunung Rinjani terkenal dengan keindahan Danau Segara Anak yang berada di kawah gunungnya.
            </p>
            <p className="mt-4">
              Pendakian Gunung Rinjani menawarkan pengalaman yang tak terlupakan dengan pemandangan yang spektakuler.
              Danau Segara Anak yang berwarna biru kehijauan dan Gunung Barujari yang masih aktif menjadi daya tarik
              utama bagi para pendaki. Jalur pendakian yang menantang namun sangat memuaskan membuat Rinjani menjadi
              salah satu destinasi favorit pendaki Indonesia.
            </p>
          </CardContent>
        </Card>

        {/* Requirements Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">i</span>
            </div>
            <div className="text-blue-800">
              <h3 className="font-semibold text-lg mb-3">Syarat Pendakian Gunung</h3>
              <ul className="space-y-2 text-sm">
                <li>• Pendaki wajib membawa surat keterangan sehat dari dokter</li>
                <li>• Membawa perlengkapan pendakian yang memadai (sleeping bag, jaket tebal, dll)</li>
                <li>• Wajib menggunakan guide lokal yang bersertifikat</li>
                <li>• Membawa obat-obatan pribadi dan P3K</li>
                <li>• Dilarang membawa minuman beralkohol dan narkoba</li>
                <li>• Wajib menjaga kebersihan dan tidak membuang sampah sembarangan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold">Pilih Tanggal Pendakian</h2>
            <p className="text-gray-600">Tentukan tanggal masuk dan keluar pendakian Anda</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="entryDate" className="flex items-center gap-2 text-base font-medium">
                  <Calendar className="w-5 h-5" />
                  Tanggal Masuk *
                </Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className={`h-12 ${errors.entryDate ? "border-red-500" : ""}`}
                />
                {errors.entryDate && <p className="text-sm text-red-600">{errors.entryDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitDate" className="flex items-center gap-2 text-base font-medium">
                  <Calendar className="w-5 h-5" />
                  Tanggal Keluar *
                </Label>
                <Input
                  id="exitDate"
                  type="date"
                  value={exitDate}
                  onChange={(e) => setExitDate(e.target.value)}
                  className={`h-12 ${errors.exitDate ? "border-red-500" : ""}`}
                />
                {errors.exitDate && <p className="text-sm text-red-600">{errors.exitDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfBookers" className="flex items-center gap-2 text-base font-medium">
                  <Users className="w-5 h-5" />
                  Jumlah Pemesan *
                </Label>
                <Input
                  id="numberOfBookers"
                  type="number"
                  min="1"
                  max="10"
                  value={numberOfBookers}
                  onChange={(e) => setNumberOfBookers(Number.parseInt(e.target.value) || 1)}
                  className={`h-12 ${errors.numberOfBookers ? "border-red-500" : ""}`}
                />
                {errors.numberOfBookers && <p className="text-sm text-red-600">{errors.numberOfBookers}</p>}
                <p className="text-sm text-gray-500">Maksimal 10 orang per pendaftaran</p>
              </div>

              {entryDate && exitDate && !errors.entryDate && !errors.exitDate && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-green-800">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="font-medium">
                        Durasi Pendakian:{" "}
                        {Math.ceil(
                          (new Date(exitDate).getTime() - new Date(entryDate).getTime()) / (1000 * 60 * 60 * 24),
                        )}{" "}
                        hari
                      </p>
                      <p className="text-sm text-green-700">
                        {numberOfBookers} orang ×{" "}
                        {Math.ceil(
                          (new Date(exitDate).getTime() - new Date(entryDate).getTime()) / (1000 * 60 * 60 * 24),
                        )}{" "}
                        hari
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
                SELANJUTNYA
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
