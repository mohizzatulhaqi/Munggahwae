
import type React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'Munggahwae - Jelajahi Gunung Impianmu',
  description: 'Platform booking tiket pendakian gunung di Indonesia',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakarta.variable} font-plus-jakarta`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
