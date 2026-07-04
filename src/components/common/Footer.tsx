'use client';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

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

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mb-6">
          <a href="#" aria-label="Facebook">
            <Facebook className="w-6 h-6 text-global-2 hover:opacity-80 transition-opacity" />
          </a>
          <a href="#" aria-label="Twitter">
            <Twitter className="w-6 h-6 text-global-2 hover:opacity-80 transition-opacity" />
          </a>
          <a href="#" aria-label="Instagram">
            <Instagram className="w-6 h-6 text-global-2 hover:opacity-80 transition-opacity" />
          </a>
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
