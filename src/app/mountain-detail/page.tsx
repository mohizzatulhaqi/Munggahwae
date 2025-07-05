'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
interface TrailInfo {
  name: string;
  description: string;
  icon: string;
}
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const GunungRinjaniPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const handleBookingClick = () => {
    if (!user) {
      alert('Anda harus login untuk memesan tiket!');
      router.push('/login');
      return;
    }
    alert('Terima kasih! Anda akan diarahkan ke halaman pembayaran.');
    // router.push('/payment'); // aktifkan jika ingin redirect ke halaman pembayaran
  };
  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };
  const closeModal = () => {
    setSelectedImage(null);
  };
  const trailData: TrailInfo[] = [
    {
      name: 'Jalur Senaru',
      description:
        'Terletak di Desa Senaru, Kecamatan Bayan. Jalur ini adalah jalur paling populer yang menawarkan pemandangan indah dan tanjakan bertahap.',
      icon: '/images/img_vector_0_gray_900.svg',
    },
    {
      name: 'Jalur Sembalun',
      description:
        'Terletak di Desa Sembalun Lawang, Kecamatan Sembalun. Ini merupakan jalur terpendek tetapi juga paling curam.',
      icon: '/images/img_vector_0_gray_900.svg',
    },
    {
      name: 'Jalur Torean',
      description:
        'Terletak di Desa Torean, Kecamatan Bayan. Merupakan jalur yang menantang dengan jalur melewati hutan lebat dan menyusuri sungai.',
      icon: '/images/img_vector_0_gray_900.svg',
    },
    {
      name: 'Jalur Timbanuh',
      description:
        'Terletak di Desa Timbanuh, Kecamatan Pringgasela. Jalur ini juga menantang, melewati hutan lebat dan sungai.',
      icon: '/images/img_vector_0_gray_900.svg',
    },
  ];
  const galleryImages = [
    '/images/img_depth_7_frame_0.png',
    '/images/img_depth_7_frame_0_169x301.png',
    '/images/img_depth_7_frame_0_170x301.png',
  ];
  return (
    <div className="min-h-screen bg-global-4">
      <Header />
      <main className="bg-global-1 px-44 py-8">
        {/* Hero Image */}
        <div className="mb-8">
          <Image
            src="/images/img_depth_6_frame_0.png"
            alt="Gunung Rinjani"
            width={928}
            height={320}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>
        {/* Title */}
        <h1 className="text-2xl font-bold leading-7 text-global-1 font-plus-jakarta mb-8">
          Gunung Rinjani
        </h1>
        {/* Info Section */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Kuota
            </span>
            <span className="text-sm font-normal leading-[18px] text-global-1 font-plus-jakarta">
              100 pendaki/hari
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Jalur
            </span>
            <span className="text-sm font-normal leading-[18px] text-global-1 font-plus-jakarta">
              4 Jalur
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta">
              Tersedia
            </span>
            <span className="text-sm font-normal leading-[18px] text-global-1 font-plus-jakarta">
              100/100
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
              className="bg-[#0FBD66] text-global-3 text-sm font-medium leading-[18px] px-4 py-2 rounded-lg font-plus-jakarta hover:opacity-100 transition-opacity"
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
            Gunung Rinjani adalah gunung yang berlokasi di Pulau Lombok, Nusa Tenggara Barat. Gunung
            yang merupakan gunung berapi kedua tertinggi di Indonesia dengan ketinggian 3.726 mdpl
            serta terletak pada lintang 8º25&apos; LS dan 116º28&apos; BT ini merupakan gunung
            favorit bagi pendaki Indonesia karena keindahan pemandangannya.
          </p>
        </section>
        {/* Gallery Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold leading-7 text-global-1 font-plus-jakarta mb-6">
            Galeri
          </h2>
          <div className="flex gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="cursor-pointer" onClick={() => handleImageClick(image)}>
                <Image
                  src={image}
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
            {trailData.map((trail, index) => (
              <div key={index} className="bg-global-1 p-4 rounded-lg flex items-start gap-4">
                <div className="bg-global-2 p-3 rounded-lg flex-shrink-0">
                  <Image
                    src={trail.icon}
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
              src={selectedImage}
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
export default GunungRinjaniPage;
