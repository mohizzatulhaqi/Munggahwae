'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';


const Header = () => {
  const { user, loading } = useAuth();
  return (
    <header className="w-full h-[65px] border-b border-primary bg-white sticky top-0 z-50">
      <div className="max-w-[1200px] h-full mx-auto px-4 flex items-center justify-between">
        {/* Bagian Kiri - Logo dan Menu */}
        <div className="flex items-center gap-6">
          {/* Logo Munggahwae */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=16&width=16"
              alt="Logo"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span className="text-lg font-bold leading-[23px] text-global-1 font-plus-jakarta">
              Munggahwae
            </span>
            <Link href="/history" className="ml-6 text-base font-medium text-global-2 font-plus-jakarta hover:text-global-3 transition-colors">
              History
            </Link>
          </Link>
        </div>

        {/* Bagian Kanan - Auth Buttons */}
        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <div className="relative group">
              <button
                className="w-12 h-12 bg-global-3 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors focus:outline-none"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <Image
                  src={user.avatar_url || "/placeholder.svg?height=24&width=24"}
                  alt="Profile"
                  width={24}
                  height={24}
                  className="text-global-1 rounded-full"
                />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity">
                <div className="px-4 py-2 text-sm font-bold text-gray-800 border-b">Akun Saya</div>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.clear();
                      window.location.href = '/login';
                    }
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m10.5 3v6.75A2.25 2.25 0 0116.5 21h-9a2.25 2.25 0 01-2.25-2.25V12m16.5 0V9.75A2.25 2.25 0 0016.5 7.5h-9a2.25 2.25 0 00-2.25 2.25V12m16.5 0H3.75" />
                  </svg>
                  Keluar
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-global-1 font-plus-jakarta hover:text-global-2 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-global-4 text-white text-sm font-medium font-plus-jakarta rounded-lg hover:opacity-90 transition-opacity"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
