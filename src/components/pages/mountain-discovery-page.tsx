'use client';
import type React from 'react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Pagination from '@/components/ui/Pagination';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton';
import { getAllMountains } from '@/lib/mountain-data';
import ProvinceFilter from '../ui/ProvinceFilter';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const MountainDiscoveryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>(''); // New state for applied search
  const [selectedProvince, setSelectedProvince] = useState<string>('Semua Provinsi');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const mountains = getAllMountains();

  // Filter mountains based on applied search query and selected province
  const filteredMountains = useMemo(() => {
    let filtered = mountains;

    // Filter by applied search query (only when search button is clicked)
    if (appliedSearchQuery.trim()) {
      filtered = filtered.filter(
        (mountain) =>
          mountain.name.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
          mountain.location.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
          mountain.province.toLowerCase().includes(appliedSearchQuery.toLowerCase())
      );
    }

    // Filter by province
    if (selectedProvince !== 'Semua Provinsi') {
      filtered = filtered.filter((mountain) => mountain.province === selectedProvince);
    }

    return filtered;
  }, [appliedSearchQuery, selectedProvince, mountains]);

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery); // Apply the search when button is clicked
    setCurrentPage(1); // Reset to first page when searching
    console.log('Searching for:', searchQuery);
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setCurrentPage(1); // Reset to first page when changing province
    console.log('Province changed to:', province);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  // Calculate total pages based on filtered results
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredMountains.length / itemsPerPage);

  // Get current page items
  const currentItems = filteredMountains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Show results info only when province filter is active or search is active
  const showResultsInfo = selectedProvince !== 'Semua Provinsi' || appliedSearchQuery.trim() !== '';

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
              background: 'linear-gradient(135deg, #0FBD66 0%, #05603A 100%)',
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
                  <Search className="w-5 h-5 text-global-2" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
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

          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-8">
            {/* Province Filter */}
            <div className="flex justify-center">
              <ProvinceFilter
                selectedProvince={selectedProvince}
                onProvinceChange={handleProvinceChange}
              />
            </div>
          </div>

          {/* Results Info - Only show when filtering */}
          {showResultsInfo && (
            <div className="w-full mb-4">
              <p className="text-sm text-global-2 font-plus-jakarta text-center">
                Menampilkan {currentItems.length} dari {filteredMountains.length} gunung
                {selectedProvince !== 'Semua Provinsi' && ` di ${selectedProvince}`}
                {appliedSearchQuery && ` untuk "${appliedSearchQuery}"`}
              </p>
            </div>
          )}

          {/* Mountain Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full mb-8">
            {currentItems.length > 0 ? (
              currentItems.map((mountain) => (
                <Link key={mountain.id} href={`/mountain/${mountain.id}`}>
                  <div className="flex flex-col items-center w-full cursor-pointer hover:transform hover:scale-105 transition-transform">
                    <div className="w-full h-[156px]">
                      {mountain.image ? (
                        <ImageWithSkeleton
                          src={mountain.image}
                          alt={mountain.name}
                          unoptimized
                          wrapperClassName="w-full h-[99px] rounded-xl"
                        />
                      ) : (
                        <ImagePlaceholder className="w-full h-[99px] rounded-xl" />
                      )}
                      <h3 className="mt-3 text-base font-medium leading-[21px] text-global-1 font-plus-jakarta text-center">
                        {mountain.name}
                      </h3>
                      <p className="mt-1 text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta text-center">
                        {mountain.location === mountain.province
                          ? mountain.province
                          : `${mountain.location}, ${mountain.province}`}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-global-2 font-plus-jakarta mb-2">
                  Tidak ada gunung ditemukan
                </p>
                <p className="text-sm text-global-2 font-plus-jakarta">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-row items-center justify-center gap-4 w-full">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-10 h-10 cursor-pointer" />
              </button>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-10 h-10 cursor-pointer" />
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MountainDiscoveryPage;
