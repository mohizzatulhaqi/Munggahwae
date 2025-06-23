'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ChipView from '@/components/ui/ChipView';
import Pagination from '@/components/ui/Pagination';

interface Mountain {
  id: string;
  name: string;
  location: string;
  image: string;
}

const MountainDiscoveryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const mountains: Mountain[] = [
    { id: '1', name: 'Gunung Agung', location: 'Bali', image: '/images/img_depth_7_frame_0.png' },
    {
      id: '2',
      name: 'Gunung Rinjani',
      location: 'Lombok',
      image: '/images/img_depth_7_frame_0_99x176.png',
    },
    {
      id: '3',
      name: 'Gunung Bromo',
      location: 'Jawa Timur',
      image: '/images/img_depth_7_frame_0_1.png',
    },
    {
      id: '4',
      name: 'Gunung Semeru',
      location: 'Jawa Timur',
      image: '/images/img_depth_7_frame_0_2.png',
    },
    {
      id: '5',
      name: 'Gunung Merbabu',
      location: 'Jawa Tengah',
      image: '/images/img_depth_7_frame_0_3.png',
    },
    {
      id: '6',
      name: 'Gunung Arjuna',
      location: 'Jawa Timur',
      image: '/images/img_depth_7_frame_0_4.png',
    },
    {
      id: '7',
      name: 'Gunung Gede',
      location: 'Jawa Barat',
      image: '/images/img_depth_7_frame_0_4.png',
    },
    {
      id: '8',
      name: 'Gunung Kerinci',
      location: 'Sumatera',
      image: '/images/img_depth_7_frame_0_4.png',
    },
    {
      id: '9',
      name: 'Gunung Argopuro',
      location: 'Jawa Timur',
      image: '/images/img_depth_7_frame_0_4.png',
    },
    {
      id: '10',
      name: 'Gunung Slamet',
      location: 'Jawa Tengah',
      image: '/images/img_depth_7_frame_0_4.png',
    },
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

 

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-global-2">
      <div className="flex flex-col flex-1 bg-global-1">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex flex-col items-center w-full max-w-[1200px] mx-auto px-4 py-8">
          {/* Hero Section */}
          <div
            className="relative flex flex-col w-full h-[480px] rounded-xl overflow-hidden mb-8"
            style={{
              background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
              backgroundImage: 'url(/images/img_.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-5xl font-extrabold leading-[61px] text-global-4 font-plus-jakarta mb-4">
                Jelajahi Gunung Impianmu
              </h1>
              <p className="text-base font-normal leading-6 text-global-4 font-plus-jakarta max-w-[600px]">
                Temukan petualangan mendaki gunung yang tak terlupakan di seluruh Indonesia. Pesan
                tiketmu sekarang dan rasakan keindahan alam yang memukau.
              </p>

              {/* Search Bar */}
              <div className="flex flex-row w-full max-w-[480px] h-16 mt-12">
                <div className="flex items-center justify-center w-16 h-16 bg-global-1 border border-[#cee8db] rounded-l-xl">
                  <Image src="/images/img_search.svg" alt="Search" width={20} height={20} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari gunung impianmu..."
                  className="flex-1 h-16 px-4 text-base font-normal leading-[21px] text-global-2 font-plus-jakarta bg-global-1 border-t border-b border-[#cee8db] outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="w-[92px] h-16 text-base font-bold leading-[21px] text-center text-global-3 font-plus-jakarta bg-global-1 border border-[#cee8db] rounded-r-xl hover:bg-global-3 hover:text-global-1 transition-colors"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>

          {/* Mountain Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full mb-8">
            {mountains.map((mountain) => (
              <div key={mountain.id} className="flex flex-col items-center w-full">
                <div className="w-full h-[156px]">
                  <Image
                    src={mountain.image}
                    alt={mountain.name}
                    width={176}
                    height={99}
                    className="w-full h-[99px] object-cover rounded-xl"
                  />
                  <h3 className="mt-3 text-base font-medium leading-[21px] text-global-1 font-plus-jakarta text-center">
                    {mountain.name}
                  </h3>
                  <p className="mt-1 text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta text-center">
                    {mountain.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-row items-center justify-center gap-4 w-full">
            <Image
              src="/images/img_arrowright.svg"
              alt="Previous"
              width={40}
              height={40}
              className="cursor-pointer"
            />
            <Pagination currentPage={currentPage} totalPages={4} onPageChange={handlePageChange} />
            <Image
              src="/images/img_arrowright_gray_900.svg"
              alt="Next"
              width={40}
              height={40}
              className="cursor-pointer"
            />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MountainDiscoveryPage;
