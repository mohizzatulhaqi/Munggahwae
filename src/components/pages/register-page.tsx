'use client'

import { useState } from 'react'
import type React from 'react'

import Link from 'next/link'
import { Mountain, Eye, EyeOff } from 'lucide-react' // Import ikon dari Lucide React
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { supabase } from '@/app/api/supabaseClient'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok!')
      return
    }

    if (!formData.agreeToTerms) {
      alert('Silakan setujui syarat dan ketentuan!')
      return
    }

    console.log(formData.email, formData.fullName, formData.confirmPassword, formData.agreeToTerms, formData.password, formData.phone)

    setIsLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          namaLengkap: formData.fullName,
        },
      },
    })

    if (error) {
      alert(`Gagal daftar: ${error.message}`)
    } else {
      alert('Pendaftaran berhasil! Silakan cek email untuk verifikasi dan login.')
      // Tidak perlu insert manual ke tabel Pengguna, data sudah di Supabase Auth
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-global-1">
      <Header />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mountain className="w-8 h-8 text-global-2" /> 
              <span className="text-2xl font-bold text-global-1 font-plus-jakarta">Munggahwae</span>
            </div>
            <h1 className="text-2xl font-bold text-global-1 font-plus-jakarta mb-2">Bergabung dengan Kami</h1>
            <p className="text-global-2 font-plus-jakarta">Daftar sekarang dan mulai petualangan mendaki Anda</p>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-global-1 font-plus-jakarta mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-global-4 focus:border-transparent outline-none transition-all font-plus-jakarta"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-global-1 font-plus-jakarta mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-global-4 focus:border-transparent outline-none transition-all font-plus-jakarta"
                  placeholder="Masukkan email Anda"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-global-1 font-plus-jakarta mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-global-4 focus:border-transparent outline-none transition-all font-plus-jakarta"
                    placeholder="Buat password yang kuat"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-global-1 font-plus-jakarta mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-global-4 focus:border-transparent outline-none transition-all font-plus-jakarta"
                    placeholder="Ulangi password Anda"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-global-4 border-gray-300 rounded focus:ring-global-4"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-global-1 font-plus-jakarta leading-relaxed">
                  Saya setuju dengan{' '}
                  <Link href="/terms" className="text-global-2 hover:underline">
                    Syarat & Ketentuan
                  </Link>{' '}
                  dan{' '}
                  <Link href="/privacy" className="text-global-2 hover:underline">
                    Kebijakan Privasi
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium font-plus-jakarta transition-all ${
                  isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-global-4 text-white hover:opacity-90'
                }`}
              >
                {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-global-1 font-plus-jakarta">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-global-2 font-medium hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default RegisterPage
