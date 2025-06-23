"use client"

import type React from "react"
import { useState, useRef } from "react"
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, FileText, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { PersonalData } from "@/app/mountain/[id]/booking-terms/booking-form/page"
import { useParams, useRouter } from "next/navigation"

interface PersonalDataFormProps {
  onSubmit: (data: PersonalData) => void
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
  const params = useParams()
  const router = useRouter()
  const mountainId = params.id as string

  const validateForm = () => {
    const newErrors: Partial<Record<keyof PersonalData, string>> = {}

    if (!formData.email) newErrors.email = "Email harus diisi"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format email tidak valid"

    if (!formData.fullName) newErrors.fullName = "Nama lengkap harus diisi"

    if (!formData.idNumber) newErrors.idNumber = "Nomor identitas harus diisi"
    else if (formData.idNumber.length !== 16) newErrors.idNumber = "Nomor identitas harus 16 digit"

    if (!formData.phoneNumber) newErrors.phoneNumber = "Nomor telepon harus diisi"
    else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Format nomor telepon tidak valid"

    if (!formData.birthDate) newErrors.birthDate = "Tanggal lahir harus diisi"

    if (!formData.birthPlace) newErrors.birthPlace = "Tempat lahir harus diisi"

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
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("Ukuran file maksimal 5MB")
      if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type)) {
        return alert("Format file harus JPG, PNG, atau PDF")
      }
      setUploadedFile(file)
    }
  }

  const handleBackClick = () => {
    router.push(`/mountain/${mountainId}/booking-terms/booking-form`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Pilih Tanggal
            </Button>

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
                <InputField id="email" label="Email *" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} error={errors.email} type="email" placeholder="contoh@email.com" />
                <InputField id="fullName" label="Nama Lengkap *" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} error={errors.fullName} type="text" placeholder="Masukkan nama lengkap" />
                <InputField id="idNumber" label="No Identitas *" value={formData.idNumber} onChange={(e) => handleInputChange("idNumber", e.target.value)} error={errors.idNumber} type="text" placeholder="KTP/SIM/Kartu Pelajar/Passport" />
                <InputField id="phoneNumber" label="Nomor Telepon *" value={formData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} error={errors.phoneNumber} type="tel" placeholder="Contoh: 081234567890" />

                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin *</Label>
                  <Select value={formData.gender} onValueChange={(value: "male" | "female") => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <InputField id="birthDate" label="Tanggal Lahir *" value={formData.birthDate} onChange={(e) => handleInputChange("birthDate", e.target.value)} error={errors.birthDate} type="date" />
                <InputField id="birthPlace" label="Tempat Lahir *" value={formData.birthPlace} onChange={(e) => handleInputChange("birthPlace", e.target.value)} error={errors.birthPlace} type="text" placeholder="Contoh: Jakarta" />

                <div className="space-y-2">
                  <Label>Upload Kartu Identitas</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
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
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-2">
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
      </main>
      <Footer />
    </div>
  )
}

function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
}: {
  id: string
  label: string
  type: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} className={error ? "border-red-500" : ""} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
