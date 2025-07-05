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
  // const mountains: Mountain[] = [
  //   { id: '1', name: 'Gunung Agung', location: 'Bali', image: '/images/img_depth_7_frame_0.png' },
  //   {
  //     id: '2',
  //     name: 'Gunung Rinjani',
  //     location: 'Lombok',
  //     image: '/images/img_depth_7_frame_0_99x176.png',
  //   },
  //   {
  //     id: '3',
  //     name: 'Gunung Bromo',
  //     location: 'Jawa Timur',
  //     image: '/images/img_depth_7_frame_0_1.png',
  //   },
  //   {
  //     id: '4',
  //     name: 'Gunung Semeru',
  //     location: 'Jawa Timur',
  //     image: '/images/img_depth_7_frame_0_2.png',
  //   },
  //   {
  //     id: '5',
  //     name: 'Gunung Merbabu',
  //     location: 'Jawa Tengah',
  //     image: '/images/img_depth_7_frame_0_3.png',
  //   },
  //   {
  //     id: '6',
  //     name: 'Gunung Arjuna',
  //     location: 'Jawa Timur',
  //     image: '/images/img_depth_7_frame_0_4.png',
  //   },
  //   {
  //     id: '7',
  //     name: 'Gunung Gede',
  //     location: 'Jawa Barat',
  //     image: '/images/img_depth_7_frame_0_4.png',
  //   },
  //   {
  //     id: '8',
  //     name: 'Gunung Kerinci',
  //     location: 'Sumatera',
  //     image: '/images/img_depth_7_frame_0_4.png',
  //   },
  //   {
  //     id: '9',
  //     name: 'Gunung Argopuro',
  //     location: 'Jawa Timur',
  //     image: '/images/img_depth_7_frame_0_4.png',
  //   },
  //   {
  //     id: '10',
  //     name: 'Gunung Slamet',
  //     location: 'Jawa Tengah',
  //     image: '/images/img_depth_7_frame_0_4.png',
  //   },
  // ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

 

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  return (
    <>
      <Header />
      <main className="container py-10">
        <h1 className="text-2xl font-bold mb-4">Jelajahi Gunung</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mountains.map((mountain) => (
            <div key={mountain.id} className="text-center">
              <Image
                src={mountain.image}
                alt={mountain.name}
                width={200}
                height={120}
                className="rounded-lg object-cover mx-auto"
              />
              <p className="font-semibold mt-2">{mountain.name}</p>
              <p className="text-sm text-gray-500">{mountain.location}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MountainDiscoveryPage;
