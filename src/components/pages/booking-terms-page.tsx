'use client';
import { useState } from 'react';
import type React from 'react';

import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BackButton from '@/components/ui/BackButton';
import type { Mountain } from '@/lib/mountain-data';

interface BookingTermsPageProps {
  mountain: Mountain;
}

const BookingTermsPage: React.FC<BookingTermsPageProps> = ({ mountain }) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (isAgreed) {
       router.push(`/mountain/${mountain.id}/booking-terms/booking-form`); // Adjust the path as needed
    } else {
      alert('Silakan centang persetujuan terlebih dahulu');
    }
  };

  return (
    <div className="min-h-screen bg-global-1">
      <Header />

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <BackButton />
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-global-1 font-plus-jakarta mb-2 text-center">
            Syarat dan Ketentuan Pendakian
          </h1>
          <h2 className="text-lg font-medium text-global-2 font-plus-jakarta mb-8 text-center">
            {mountain.name}
          </h2>

          <div className="space-y-4 mb-8">
            {mountain.bookingTerms.map((term, index) => (
              <div key={index} className="flex gap-4">
                <span className="text-global-2 font-medium font-plus-jakarta flex-shrink-0">
                  {index + 1}.
                </span>
                <p className="text-global-1 font-plus-jakarta leading-relaxed">{term}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-global-1 font-plus-jakarta leading-relaxed">
                  Saya telah membaca, menyetujui, dan bersedia mengikuti syarat dan ketentuan yang
                  berlaku untuk pendakian {mountain.name}
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleContinue}
                disabled={!isAgreed}
                className={`px-8 py-3 rounded-lg font-medium font-plus-jakarta transition-all ${
                  isAgreed
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Lanjutkan Isi Data
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingTermsPage;
