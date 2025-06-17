'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="w-full h-[65px] border-b border-primary bg-white sticky top-0 z-50">
      <div className="max-w-[1200px] h-full mx-auto px-4 flex items-center justify-between">
        {/* Bagian Kiri - Logo dan Menu */}
        <div className="flex items-center gap-6">
          {/* Logo Merbabook */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/img_vector_0.svg"
              alt="Logo"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span className="text-lg font-bold leading-[23px] text-global-1 font-plus-jakarta">
              Merbabook
            </span>
          </div>

          {/* Menu Navigasi */}
          <nav className="flex items-center gap-6 ml-6">
            <Link
              href="/mountain-discovery"
              className="text-sm font-medium leading-[18px] text-global-1 font-plus-jakarta hover:text-primary transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium leading-[18px] text-global-1 font-plus-jakarta hover:text-primary transition-colors"
            >
              Profil
            </Link>
          </nav>
        </div>

        {/* Bagian Kanan - Foto Profil */}
        <div className="flex items-center">
          <Link href="/profile">
            <Image
              src="/images/img_depth_4_frame_2.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-cover hover:ring-2 hover:ring-primary transition-all"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
