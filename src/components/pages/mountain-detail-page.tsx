'use client';
import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BackButton from '@/components/ui/BackButton';
import type { Mountain } from '@/lib/mountain-data';

interface MountainDetailPageProps {
  mountain: Mountain;
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
            src={mountain.heroImage || '/placeholder.svg'}
            alt={mountain.name}
            width={928}
            height={320}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold leading-7 text-global-1 font-plus-jakarta mb-8">
          {mountain.name}
        </h1>

        {/* Info Section */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Kuota
            </span>
            <span className="text-sm font-normal leading-[18px] text-global-1 font-plus-jakarta">
              {mountain.quota}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Jalur
            </span>
            <span className="text-sm font-normal leading-[18px] text-global-1 font-plus-jakarta">
              {mountain.trails}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Tersedia
            </span>
            <span className="text-sm font-normal leading-[18px] text-global-1 font-plus-jakarta">
              {mountain.available}
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
              className="bg-[#0FBD66] text-white text-sm font-medium leading-[18px] px-4 py-2 rounded-lg font-plus-jakarta hover:opacity-90 transition-opacity"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>

        {/* Description Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold leading-7 text-global-1 font-plus-jakarta mb-4">
            Deskripsi
          </h2>
          <p className="text-base font-normal leading-6 text-global-1 font-plus-jakarta">
            {mountain.description}
          </p>
        </section>

        {/* Gallery Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold leading-7 text-global-1 font-plus-jakarta mb-6">
            Galeri
          </h2>
          <div className="flex gap-4 overflow-x-auto">
            {mountain.galleryImages.map((image, index) => (
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
            ))}
          </div>
        </section>

        {/* Available Trails Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold leading-7 text-global-1 font-plus-jakarta mb-6">
            Jalur Tersedia
          </h2>
          <div className="space-y-4">
            {mountain.trailDetails.map((trail, index) => (
              <div
                key={index}
                className="bg-global-1 p-4 rounded-lg flex items-start gap-4 border border-gray-200"
              >
                <div className="bg-global-2 p-3 rounded-lg flex-shrink-0">
                  <Image
                    src={trail.icon || '/placeholder.svg'}
                    alt="Trail icon"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium leading-[21px] text-global-1 font-plus-jakarta mb-1">
                    {trail.name}
                  </h3>
                  <p className="text-sm font-normal leading-[21px] text-global-2 font-plus-jakarta">
                    {trail.description}
                  </p>
                </div>
              </div>
            ))}
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
