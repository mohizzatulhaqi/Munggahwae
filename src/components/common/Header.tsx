'use client';
import Link from 'next/link';
import { Mountain, Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <header className="w-full h-[65px] border-b border-primary bg-white sticky top-0 z-50">
      <div className="max-w-[1200px] h-full mx-auto px-4 flex items-center justify-between">
        {/* Bagian Kiri - Logo */}
        <div className="flex items-center">
          {/* Logo Munggahwae */}
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="w-5 h-5" style={{ color: '#0fbd66' }} />
            <span className="text-lg font-bold leading-[23px] text-global-1 font-plus-jakarta">
              Munggahwae
            </span>
          </Link>
        </div>

        {/* Bagian Kanan - Auth Buttons */}
        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <div className="relative group">
              <button
                className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center hover:from-green-600 hover:to-emerald-700 transition-all duration-200 focus:outline-none shadow-lg"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="text-white font-bold text-lg">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email
                      ? user.email.charAt(0).toUpperCase()
                      : 'U'}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity">
                <div className="px-4 py-2 text-xs font-bold text-gray-800 border-b">
                  {user.name || user.email || 'User'}
                </div>

                {/* History Link */}
                <Link
                  href="/history"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors gap-2"
                >
                  <Clock className="w-4 h-4 text-blue-400" />
                  History
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
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
