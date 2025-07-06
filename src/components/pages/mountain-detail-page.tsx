'use client';
import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BackButton from '@/components/ui/BackButton';
import { Gunung } from '@/domain/entities/Gunung';
import { Route } from 'lucide-react';

interface MountainDetailPageProps {
  mountain: Gunung;
}

function canAcceptBookings(mountain: any) {
  // Contoh logika, sesuaikan dengan kebutuhan Anda
  return mountain.status === 'active' && mountain.kuota > 0;
}

const MountainDetailPage: React.FC<MountainDetailPageProps> = ({ mountain }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const handleBookingClick = () => {
    router.push(`/mountain/${mountain.id}/booking-terms`);
  };

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-global-4">
      <Header />

      {/* Back Button */}
      <div className="bg-global-1 px-4 md:px-44 pt-4">
        <BackButton />
      </div>

      <main className="bg-global-1 px-4 md:px-44 py-8">
        {/* Hero Image */}
        <div className="mb-8">
          <Image
            src={mountain.urlGambar || '/placeholder.svg'}
            alt={mountain.nama}
            width={928}
            height={320}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold leading-7 text-global-1 font-plus-jakarta mb-8">
          {mountain.nama}
        </h1>

        {/* Info Section */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Kuota
            </span>
            <span className="text-sm font-normal leading-[18px] text-global-1 font-plus-jakarta">
              {mountain.kuota}
            </span>
          </div>
          <div className="flex justify-between items-center"> 
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Lokasi
            </span>
            <span className="text-sm font-normal leading-[18px] text-global-1 font-plus-jakarta">
              {mountain.lokasi}, {mountain.provinsi}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Harga per Orang
            </span>
            <span className="text-sm font-normal leading-[18px] text-global-1 font-plus-jakarta">
            Rp {typeof mountain.hargaPerOrang === 'number' ? mountain.hargaPerOrang.toLocaleString() : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Status
            </span>
            <span className={`text-sm font-normal leading-[18px] font-plus-jakarta ${
              mountain.status === 'active' ? 'text-green-600' : 'text-red-600'
            }`}>
              {mountain.status === 'active' ? 'Tersedia' : 'Tidak Tersedia'}
            </span>
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-global-1 border border-[#cee8db] rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold leading-[21px] text-global-1 font-plus-jakarta">
              Pesan Tiket Masuk
            </h2>
            <button
              onClick={handleBookingClick}
              disabled={!canAcceptBookings(mountain)}
              className={`text-sm font-medium leading-[18px] px-4 py-2 rounded-lg font-plus-jakarta transition-opacity ${
                canAcceptBookings(mountain)
                  ? 'bg-[#0FBD66] text-white hover:opacity-90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canAcceptBookings(mountain) ? 'Pesan Sekarang' : 'Tidak Tersedia'}
            </button>
          </div>
        </div>

        {/* Description Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold leading-7 text-global-1 font-plus-jakarta mb-4">
            Deskripsi
          </h2>
          <p className="text-base font-normal leading-6 text-global-1 font-plus-jakarta">
            {mountain.deskripsi}
          </p>
        </section>

        {/* Gallery Section - Placeholder for now */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold leading-7 text-global-1 font-plus-jakarta mb-6">
            Galeri
          </h2>
          <div className="flex gap-4 overflow-x-auto">
            {Array.isArray(mountain.galeriGunung) && mountain.galeriGunung.length > 0 ? (
              mountain.galeriGunung.map((image: string, index: number) => (
                <div
                  key={index}
                  className="cursor-pointer flex-shrink-0"
                  onClick={() => handleImageClick(image)}
                >
                  <Image
                    src={image || '/placeholder.svg'}
                    alt={`Gallery image ${index + 1}`}
                    width={301}
                    height={169}
                    className="rounded-lg object-cover hover:opacity-80 transition-opacity"
                  />
                </div>
              ))
            ) : (
              <div className="text-global-2">Tidak ada gambar galeri tersedia.</div>
            )}
          </div>
        </section>

        {/* Available Trails Section - Placeholder for now */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold leading-7 text-global-1 font-plus-jakarta mb-6">
            Jalur Tersedia
          </h2>
          <div className="space-y-4">
            {Array.isArray(mountain.jalur) && mountain.jalur.length > 0 ? (
              mountain.jalur.map((trail: any, index: number) => (
                <div
                  key={trail.id || index}
                  className="bg-global-1 p-4 rounded-lg flex items-start gap-4 border border-gray-200"
                >
                  <div className="bg-global-2 p-3 rounded-lg flex-shrink-0">
                    <Route className="w-6 h-6 text-global-1" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-medium leading-[21px] text-global-1 font-plus-jakarta mb-1">
                      {trail.name || `Jalur ${index + 1}`}
                    </h3>
                    <p className="text-sm font-normal leading-[21px] text-global-2 font-plus-jakarta">
                      {trail.description || 'Detail jalur tidak tersedia.'}
                    </p>
                    {trail.difficultyLevel && (
                      <p className="text-sm font-normal leading-[21px] text-global-2 font-plus-jakarta mt-1">
                        Tingkat Kesulitan: {trail.difficultyLevel}
                      </p>
                    )}
                    {trail.estimatedDurationHours && (
                      <p className="text-sm font-normal leading-[21px] text-global-2 font-plus-jakarta mt-1">
                        Estimasi Durasi: {trail.estimatedDurationHours} Jam
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-global-2">Belum ada data jalur tersedia.</div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Jumlah Jalur
            </span>
            <span className="text-sm font-normal leading-[18px] text-global-1 font-plus-jakarta">
              {Array.isArray(mountain.jalur) ? mountain.jalur.length : 0}
            </span>
          </div>
        </section>
      </main>

      <Footer />

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <Image
              src={selectedImage || '/placeholder.svg'}
              alt="Gallery image enlarged"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MountainDetailPage;
