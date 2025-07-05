'use client';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full bg-global-1 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-16 mb-6">
          <Link
            href="/about"
            className="text-base font-normal leading-[21px] text-global-2 font-plus-jakarta hover:text-global-3 transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="/contact"
            className="text-base font-normal leading-[21px] text-global-2 font-plus-jakarta hover:text-global-3 transition-colors"
          >
            Kontak
          </Link>
          <Link
            href="/privacy"
            className="text-base font-normal leading-[21px] text-global-2 font-plus-jakarta hover:text-global-3 transition-colors"
          >
            Kebijakan Privasi
          </Link>
          <Link
            href="/terms"
            className="text-base font-normal leading-[21px] text-global-2 font-plus-jakarta hover:text-global-3 transition-colors"
          >
            Syarat & Ketentuan
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-center text-base font-normal leading-[21px] text-global-2 font-plus-jakarta">
          © 2025 Munggahwae. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
