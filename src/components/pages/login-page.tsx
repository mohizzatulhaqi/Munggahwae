'use client';
import { useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { loginUser } from '@/models/user/controller/login';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mountain } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (res?.isLoggedIn) {
        alert('Login berhasil!');
        console.log('Data user:', res.user);

        // Simpan data user ke context
        login(res.user);

        // Redirect ke halaman utama setelah login berhasil
        router.push('/');
      } else {
        alert(res?.message || 'Login gagal');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat login.');
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-global-1">
      <Header />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mountain size={20} color="var(--global-bg-4)" strokeWidth={2.5} />
              <span className="text-2xl font-bold text-global-1 font-plus-jakarta">Munggahwae</span>
            </div>
            <h1 className="text-2xl font-bold text-global-1 font-plus-jakarta mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-global-2 font-plus-jakarta">
              Masuk ke akun Anda untuk melanjutkan petualangan
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-global-1 font-plus-jakarta mb-2"
                >
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-global-1 font-plus-jakarta mb-2"
                >
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
                    placeholder="Masukkan password Anda"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-global-2 font-plus-jakarta hover:underline"
                >
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium font-plus-jakarta transition-all ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-global-4 text-white hover:opacity-90'
                }`}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-global-1 font-plus-jakarta">
                Belum punya akun?{' '}
                <Link href="/register" className="text-global-2 font-medium hover:underline">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
