'use client';
import Link from 'next/link';
import { Mountain } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full h-[65px] border-b border-primary bg-white sticky top-0 z-50">
      <div className="max-w-[1200px] h-full mx-auto px-4 flex items-center justify-between">
        {/* Bagian Kiri - Logo dan Menu */}
        <div className="flex items-center gap-6">
          {/* Logo Munggahwae */}
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-green-600" />
            <span className="text-lg font-bold leading-[23px] text-global-1 font-plus-jakarta">
              Munggahwae
            </span>
          </Link>
          <Link
            href="/trip-planner"
            className="text-sm font-medium text-global-1 font-plus-jakarta hover:text-global-2 transition-colors"
          >
            Rencana Pendakian
          </Link>
        </div>

        {/* Bagian Kanan - Login/Register Buttons */}
        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
