'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Pagination from '@/components/ui/Pagination';
import ProvinceFilter from '../ui/ProvinceFilter';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Gunung } from '@/domain/entities/Gunung';

interface MountainDiscoveryPageProps {
  mountains: Gunung[];
  selectedProvinsi: string;
  onProvinsiChange: (provinsi: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

const MountainDiscoveryPage: React.FC<MountainDiscoveryPageProps> = ({
  mountains,
  selectedProvinsi,
  onProvinsiChange,
  onRefresh,
  loading
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Automatically reset search when input is cleared
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setAppliedSearchQuery('');
    }
  }, [searchQuery]);

  const filteredMountains = useMemo(() => {
    let filtered = mountains || [];

    if (appliedSearchQuery.trim()) {
      filtered = filtered.filter(
        (mountain) =>
          mountain.nama.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
          mountain.lokasi.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
          mountain.provinsi.toLowerCase().includes(appliedSearchQuery.toLowerCase())
      );
    }

    if (selectedProvinsi && selectedProvinsi !== 'Semua Provinsi') {
      filtered = filtered.filter((mountain) => mountain.provinsi === selectedProvinsi);
    }

    return filtered;
  }, [appliedSearchQuery, selectedProvinsi, mountains]);

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleProvinceChange = (province: string) => {
    onProvinsiChange(province);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredMountains.length / itemsPerPage);
  const currentItems = filteredMountains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showResultsInfo = selectedProvinsi !== 'Semua Provinsi' || appliedSearchQuery.trim() !== '';

  return (
    <div className="flex flex-col min-h-screen bg-global-2">
      <div className="flex flex-col flex-1 bg-global-1">
        <Header />

        <main className="flex flex-col items-center w-full max-w-[1200px] mx-auto px-4 py-8">
          {/* Hero Section */}
          <div
            className="relative flex flex-col w-full h-[480px] rounded-xl overflow-hidden mb-8"
            style={{
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url(/placeholder.svg?height=480&width=1200)',
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
                  <Search size={20} color="#000000" />
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
                  className="w-[92px] h-16 text-base font-bold leading-[21px] text-center text-global-1 font-plus-jakarta bg-[#1af286] border border-[#cee8db] rounded-r-xl hover:bg-global-4 transition-colors"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-8">
            <div className="flex justify-center">
              <ProvinceFilter
                selectedProvince={selectedProvinsi || 'Semua Provinsi'}
                onProvinceChange={handleProvinceChange}
              />
            </div>
          </div>

          {!loading && showResultsInfo && (
            <div className="w-full mb-4">
              <p className="text-sm text-global-2 font-plus-jakarta text-center">
                Menampilkan {currentItems.length} dari {filteredMountains.length} gunung
                {selectedProvinsi !== 'Semua Provinsi' && ` di ${selectedProvinsi}`}
                {appliedSearchQuery.trim() && ` untuk "${appliedSearchQuery}"`}
              </p>
            </div>
          )}

          {/* Mountain Grid */}
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-lg text-global-2 font-plus-jakarta">Memuat data gunung...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full mb-8">
              {currentItems.length > 0 ? (
                currentItems.map((mountain) => (
                  <Link key={mountain.id} href={`/mountain/${mountain.id}`}>
                    <div className="flex flex-col items-center w-full cursor-pointer hover:transform hover:scale-105 transition-transform">
                      <div className="w-full h-[156px]">
                        <img
                          src={mountain.urlGambar || '/placeholder.svg'}
                          alt={mountain.nama}
                          className="w-full h-[99px] object-cover rounded-xl"
                        />
                        <h3 className="mt-3 text-base font-medium leading-[21px] text-global-1 font-plus-jakarta text-center">
                          {mountain.nama}
                        </h3>
                        <p className="mt-1 text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta text-center">
                          {mountain.lokasi === mountain.provinsi
                            ? mountain.provinsi
                            : `${mountain.lokasi}, ${mountain.provinsi}`}
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
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-row items-center justify-center gap-4 w-full">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={40} className="cursor-pointer text-global-1" />
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
                <ChevronRight size={40} className="cursor-pointer text-global-1" />
              </button>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MountainDiscoveryPage;
