"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, FileText, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { PersonalData } from "@/app/mountain/[id]/booking-terms/booking-form/page"

interface PersonalDataFormProps {
  onSubmit: (data: PersonalData) => void
  onBack: () => void
  onNext: () => void
  onPrevious: () => void
  bookerIndex: number
  totalBookers: number
  initialData?: PersonalData
  canGoNext: boolean
  canGoPrevious: boolean
  isLastBooker: boolean
}

export default function PersonalDataForm({
  onSubmit,
  onBack,
  onNext,
  onPrevious,
  bookerIndex,
  totalBookers,
  initialData,
  canGoNext,
  canGoPrevious,
  isLastBooker,
}: PersonalDataFormProps) {
  const [formData, setFormData] = useState<PersonalData>(
    initialData || {
      email: "",
      fullName: "",
      idNumber: "",
      phoneNumber: "",
      gender: "male",
      birthDate: "",
      birthPlace: "",
    },
  )
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({})
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateForm = () => {
    const newErrors: Partial<Record<keyof PersonalData, string>> = {}

    if (!formData.email) {
      newErrors.email = "Email harus diisi"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (!formData.fullName) {
      newErrors.fullName = "Nama lengkap harus diisi"
    }

    if (!formData.idNumber) {
      newErrors.idNumber = "Nomor identitas harus diisi"
    } else if (formData.idNumber.length !== 16) {
      newErrors.idNumber = "Nomor identitas harus 16 digit"
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Nomor telepon harus diisi"
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Format nomor telepon tidak valid"
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Tanggal lahir harus diisi"
    }

    if (!formData.birthPlace) {
      newErrors.birthPlace = "Tempat lahir harus diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({ ...formData, idCardFile: uploadedFile || undefined })
    }
  }

  const handleInputChange = (field: keyof PersonalData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Ukuran file maksimal 5MB")
        return
      }
      if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type)) {
        alert("Format file harus JPG, PNG, atau PDF")
        return
      }
      setUploadedFile(file)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft  className="w-4 h-4 mr-2" />
          Kembali ke Pilih Tanggal
        </Button>

        {/* Booker Navigation */}
        <div className="flex items-center justify-between bg-white rounded-lg border p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          <div className="text-center">
            <h3 className="font-semibold text-lg">Pemesan ke - {bookerIndex + 1}</h3>
            <p className="text-sm text-gray-600">dari {totalBookers} orang</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center gap-2"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Data Pribadi Pendaki</h2>
          <p className="text-sm text-gray-600">Lengkapi data pribadi untuk pendaki ke-{bookerIndex + 1}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">No Identitas *</Label>
              <Input
                id="idNumber"
                type="text"
                placeholder="KTP/SIM/Kartu Pelajar/Passport"
                value={formData.idNumber}
                onChange={(e) => handleInputChange("idNumber", e.target.value)}
                className={errors.idNumber ? "border-red-500" : ""}
              />
              {errors.idNumber && <p className="text-sm text-red-600">{errors.idNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Nomor Telepon *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Contoh: 081234567890"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: "male" | "female") => handleInputChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Tanggal Lahir *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className={errors.birthDate ? "border-red-500" : ""}
              />
              {errors.birthDate && <p className="text-sm text-red-600">{errors.birthDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace">Tempat Lahir *</Label>
              <Input
                id="birthPlace"
                type="text"
                placeholder="Contoh: Jakarta"
                value={formData.birthPlace}
                onChange={(e) => handleInputChange("birthPlace", e.target.value)}
                className={errors.birthPlace ? "border-red-500" : ""}
              />
              {errors.birthPlace && <p className="text-sm text-red-600">{errors.birthPlace}</p>}
            </div>

            <div className="space-y-2">
              <Label>Upload Kartu Identitas</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {uploadedFile ? (
                  <div className="flex items-center justify-center space-x-3 text-green-600">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">File berhasil diupload</p>
                      <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mb-2"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Pilih File
                    </Button>
                    <p className="text-sm text-gray-500">Format: JPG, PNG, PDF (Max. 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              {isLastBooker ? "Selesai Pendaftaran" : `Simpan & Lanjut ke Pemesan ${bookerIndex + 2}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
