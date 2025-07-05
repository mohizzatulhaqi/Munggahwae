'use client';
import type React from 'react';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Pagination from '@/components/ui/Pagination';
import ProvinceFilter from '../ui/ProvinceFilter';

const MountainDiscoveryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('Semua Provinsi');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [mountains, setMountains] = useState<any[]>([]);
  const [totalMountains, setTotalMountains] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMountains = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', itemsPerPage.toString());
        if (appliedSearchQuery.trim()) params.append('search', appliedSearchQuery);
        if (selectedProvince !== 'Semua Provinsi') params.append('provinsi', selectedProvince);
        const res = await fetch(`/api/gunung?${params.toString()}`);
        const data = await res.json();
        console.log('Data gunung:', data.mountains); // 👈 Tambahkan ini di sini

        if (data.success) {
          setMountains(data.mountains || []);
          setTotalMountains(data.meta?.total || 0);
        } else {
          setError(data.error || 'Gagal memuat data gunung');
        }
      } catch (err) {
        setError('Gagal memuat data gunung');
      } finally {
        setLoading(false);
      }
    };
    fetchMountains();
  }, [appliedSearchQuery, selectedProvince, currentPage]);

  const totalPages = Math.ceil(totalMountains / itemsPerPage);

  const showResultsInfo = selectedProvince !== 'Semua Provinsi' || appliedSearchQuery.trim() !== '';

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
    setSelectedProvince(province);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-global-2">
      <div className="flex flex-col flex-1 bg-global-1">
        <Header />
        <main className="flex flex-col items-center w-full max-w-[1200px] mx-auto px-4 py-8">
          <div
            className="relative flex flex-col w-full h-[480px] rounded-xl overflow-hidden mb-8"
            style={{
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url(/images/hero-gunung.jpg)',
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

              <div className="flex flex-row w-full max-w-[480px] h-16 mt-12">
                <div className="flex items-center justify-center w-16 h-16 bg-global-1 border border-[#cee8db] rounded-l-xl">
                  <Image
                    src="/placeholder.svg?height=20&width=20"
                    alt="Search"
                    width={20}
                    height={20}
                  />
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

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-8">
            <div className="flex justify-center">
              <ProvinceFilter
                selectedProvince={selectedProvince}
                onProvinceChange={handleProvinceChange}
              />
            </div>
          </div>

          {loading ? (
            <div className="w-full text-center py-12">Memuat data gunung...</div>
          ) : error ? (
            <div className="w-full text-center py-12 text-red-600">{error}</div>
          ) : (
            <>
              {showResultsInfo && (
                <div className="w-full mb-4">
                  <p className="text-sm text-global-2 font-plus-jakarta text-center">
                    Menampilkan {mountains.length} dari {totalMountains} gunung
                    {selectedProvince !== 'Semua Provinsi' && ` di ${selectedProvince}`}
                    {appliedSearchQuery && ` untuk "${appliedSearchQuery}"`}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full mb-8">
                {mountains.length > 0 ? (
                  mountains.map((mountain) => (
                    <Link key={mountain.id} href={`/mountain/${mountain.id}`}>
                      <div className="flex flex-col items-center w-full cursor-pointer hover:transform hover:scale-105 transition-transform">
                        <div className="w-full h-[156px]">
                          <Image
                            src={mountain.urlGambar || '/placeholder.svg'}
                            alt={mountain.nama}
                            width={176}
                            height={99}
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
              {totalPages > 1 && (
                <div className="flex flex-row items-center justify-center gap-4 w-full">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Previous"
                      width={40}
                      height={40}
                      className="cursor-pointer"
                    />
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
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Next"
                      width={40}
                      height={40}
                      className="cursor-pointer"
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MountainDiscoveryPage;
