import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Munggahwae - Platform Pemesanan Tiket Pendakian Gunung',
  description:
    'Platform pemesanan tiket pendakian gunung terpercaya di Indonesia. Pesan tiket pendakian dengan mudah dan aman.',
  keywords: 'pendakian, gunung, tiket, booking, indonesia, hiking, mountaineering',
  authors: [{ name: 'Munggahwae Team' }],
  openGraph: {
    title: 'Munggahwae - Platform Pemesanan Tiket Pendakian Gunung',
    description: 'Platform pemesanan tiket pendakian gunung terpercaya di Indonesia.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-plus-jakarta`}>
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
