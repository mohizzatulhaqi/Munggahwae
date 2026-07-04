"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, FileText, Check, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import { PersonalData } from "@/lib/booking-store"

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
  allBookersData: PersonalData[]
  pemesananId?: string
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
  allBookersData,
  pemesananId,
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
      isCompanion: false,
    },
  )
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({})
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [ageValidationWarning, setAgeValidationWarning] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate age from birth date
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // Check if there are minors (under 12) in the group
  const checkMinorValidation = (currentAge: number, allBookers: PersonalData[]): string => {
    const minorsCount = allBookers.filter((booker) => {
      if (booker.birthDate) {
        const age = calculateAge(booker.birthDate)
        return age < 12
      }
      return false
    }).length

    // Add current booker if they're a minor
    const totalMinors = currentAge < 12 ? minorsCount + 1 : minorsCount

    if (totalMinors > 0) {
      if (totalBookers < 3) {
        return "Jika ada pemesan berusia di bawah 12 tahun, minimal harus ada 3 orang dalam grup pendakian."
      }

      const companionsCount = allBookers.filter((booker) => booker.isCompanion).length
      const currentIsCompanion = formData.isCompanion

      const totalCompanions = currentIsCompanion ? companionsCount + 1 : companionsCount

      if (totalCompanions < 2) {
        return `Diperlukan minimal 2 pendamping dewasa untuk anak di bawah 12 tahun. Saat ini hanya ada ${totalCompanions} pendamping.`
      }
    }

    return ""
  }

  useEffect(() => {
    if (formData.birthDate) {
      const age = calculateAge(formData.birthDate)
      setFormData((prev) => ({ ...prev, age }))

      const warning = checkMinorValidation(age, allBookersData)
      setAgeValidationWarning(warning)
    }
  }, [formData.birthDate, allBookersData, totalBookers, formData.isCompanion])

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
    } else {
      const age = calculateAge(formData.birthDate)
      if (age < 5) {
        newErrors.birthDate = "Usia minimal untuk pendakian adalah 5 tahun"
      } else if (age > 70) {
        newErrors.birthDate = "Usia maksimal untuk pendakian adalah 70 tahun"
      }
    }

    if (!formData.birthPlace) {
      newErrors.birthPlace = "Tempat lahir harus diisi"
    }

    // Age validation for companions
    if (formData.isCompanion && formData.birthDate) {
      const age = calculateAge(formData.birthDate)
      if (age < 18) {
        newErrors.isCompanion = "Pendamping harus berusia minimal 18 tahun"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Final validation for minor/companion rules
      if (ageValidationWarning && !isLastBooker) {
        alert('Harap selesaikan pengisian data semua pemesan untuk memvalidasi aturan pendamping.');
        return;
      }
      // Integrasi API personal-data
      const formPayload = new FormData();
      formPayload.append('pemesananId', pemesananId ?? '');
      formPayload.append('email', formData.email);
      formPayload.append('fullName', formData.fullName);
      formPayload.append('idNumber', formData.idNumber);
      formPayload.append('phoneNumber', formData.phoneNumber);
      formPayload.append('gender', formData.gender);
      formPayload.append('birthDate', formData.birthDate);
      formPayload.append('birthPlace', formData.birthPlace);
      formPayload.append('isCompanion', String(formData.isCompanion));
      if (uploadedFile) formPayload.append('idCardFile', uploadedFile);

      try {
        const res = await fetch('/api/personal-data', {
          method: 'POST',
          body: formPayload,
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Gagal menyimpan data');
        alert('Data berhasil disimpan!');
      } catch (err: any) {
        alert(err.message || 'Terjadi kesalahan saat menyimpan data');
        return;
      }

      onSubmit({ ...formData, idCardFile: uploadedFile || undefined })
    }
  }

  const handleInputChange = (field: keyof PersonalData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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

  const currentAge = formData.birthDate ? calculateAge(formData.birthDate) : 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
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

      {/* Age Validation Warning */}
      {ageValidationWarning && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-yellow-800">
              <p className="font-medium mb-1">Perhatian Khusus</p>
              <p className="text-sm">{ageValidationWarning}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Data Pribadi Pendaki</h2>
          <p className="text-sm text-gray-600">Lengkapi data pribadi untuk pendaki ke-{bookerIndex + 1}</p>
          {currentAge > 0 && <p className="text-sm text-blue-600">Usia: {currentAge} tahun</p>}
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

            {/* Companion Checkbox - only show for adults */}
            {currentAge >= 18 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isCompanion"
                    checked={formData.isCompanion || false}
                    onCheckedChange={(checked) => handleInputChange("isCompanion", checked as boolean)}
                  />
                  <Label
                    htmlFor="isCompanion"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Saya bersedia menjadi pendamping untuk anak di bawah 12 tahun
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  Pendamping bertanggung jawab atas keselamatan dan pengawasan anak di bawah 12 tahun selama pendakian.
                </p>
                {errors.isCompanion && <p className="text-sm text-red-600">{errors.isCompanion}</p>}
              </div>
            )}

            {/* Minor Warning */}
            {currentAge < 12 && currentAge > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-orange-800">
                    <p className="font-medium text-sm mb-1">Pemesan Anak</p>
                    <p className="text-xs">
                      Karena berusia di bawah 12 tahun, diperlukan minimal 2 pendamping dewasa dalam grup dan total
                      minimal 3 orang.
                    </p>
                  </div>
                </div>
              </div>
            )}

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

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={ageValidationWarning !== "" && !isLastBooker}
            >
              {isLastBooker ? "Selesai Pendaftaran" : `Simpan & Lanjut ke Pemesan ${bookerIndex + 2}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
