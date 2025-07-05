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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-4">Jelajahi Gunung</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari gunung..."
          className="mb-6 p-2 border rounded"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {mountains.map((mountain) => (
            <div key={mountain.id} className="border rounded-lg overflow-hidden shadow-sm">
              <Image
                src={mountain.image}
                alt={mountain.name}
                width={300}
                height={180}
                className="object-cover w-full h-[180px]"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{mountain.name}</h2>
                <p className="text-sm text-gray-600">{mountain.location}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MountainDiscoveryPage;