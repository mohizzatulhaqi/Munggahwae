'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Mountain, History, LogOut } from 'lucide-react';

const Header = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowDropdown(false);
    }
  };

  // Fungsi untuk mendapatkan inisial dari nama
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarGradient = (name: string | undefined) => {
    if (!name) return 'from-gray-400 to-gray-600';

    const gradients = [
      'from-green-400 to-green-600',
      'from-emerald-400 to-green-500',
      'from-lime-400 to-green-500',
      'from-teal-400 to-green-500',
      'from-green-500 to-emerald-600',
    ];

    const hash = name.split('').reduce((acc: any, char: string) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Mountain size={20} color="var(--global-bg-4)" strokeWidth={2.5} />
              <div className="absolute -inset-1 bg-gradient-to-r from-global-1 to-global-4 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </div>
            <span className="text-2xl font-bold text-global-1 font-plus-jakarta group-hover:text-global-1 transition-colors duration-200">
              Munggahwae
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {isLoggedIn ? (
              /* User sudah login - tampilkan profil dan dropdown */
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  {/* Enhanced Avatar */}
                  <div className="relative">
                    <div
                      className={`w-11 h-11 bg-gradient-to-br ${getAvatarGradient(user?.namaLengkap)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300 ring-2 ring-white group-hover:scale-105`}
                    >
                      {getInitials(user?.namaLengkap)}
                    </div>
                    {/* Status indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    {/* Glow effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${getAvatarGradient(user?.namaLengkap)} rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300`}
                    ></div>
                  </div>

                  {/* Nama dan Welcome Text */}
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-plus-jakarta">Selamat datang,</span>
                    <span className="text-global-1 font-plus-jakarta font-semibold text-sm group-hover:text-global-1 transition-colors duration-200">
                      {user?.namaLengkap || 'User'}
                    </span>
                  </div>

                  {/* Dropdown Arrow */}
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:text-global-1 ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    ></div>

                    {/* Dropdown Content */}
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-20 animate-in slide-in-from-top-2 duration-200 backdrop-blur-sm">
                      {/* User Info Section */}
                      <div className="px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div
                              className={`w-14 h-14 bg-gradient-to-br ${getAvatarGradient(user?.namaLengkap)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white`}
                            >
                              {getInitials(user?.namaLengkap)}
                            </div>
                            {/* Status indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                            {/* Subtle glow effect */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${getAvatarGradient(user?.namaLengkap)} rounded-full opacity-20 blur-md`}
                            ></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 font-plus-jakarta text-base truncate">
                              {user?.namaLengkap}
                            </p>
                            <p className="text-sm text-gray-500 font-plus-jakarta truncate">
                              {user?.email || 'user@email.com'}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-plus-jakarta">
                                Online
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/history"
                          className="flex items-center gap-3 w-full px-5 py-3 text-gray-700 hover:bg-gray-50 font-plus-jakarta transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                            <History className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span>Riwayat</span>
                        </Link>
                      </div>

                      {/* Logout Section */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center gap-3 w-full px-5 py-3 text-red-600 hover:bg-red-50 font-plus-jakarta transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center">
                            {isLoggingOut ? (
                              <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <LogOut className="w-3.5 h-3.5 text-red-600" />
                            )}
                          </div>
                          <span>{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* User belum login - tampilkan tombol login dan register */
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="px-6 py-2 text-global-2 hover:text-global-1 font-plus-jakarta font-medium transition-all duration-200 hover:bg-gray-50 rounded-lg"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 text-global-2 hover:text-global-1 font-plus-jakarta font-medium transition-all duration-200 hover:bg-gray-50 rounded-lg"
                >
                  Daftar
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
