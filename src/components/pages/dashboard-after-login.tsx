'use client';
import type React from 'react';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Pagination from '@/components/ui/Pagination';
import ProvinceFilter from '../ui/ProvinceFilter';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalBookings?: number;
  totalMountainsClimbed?: number;
}

const DashboardAfterLogin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('Semua Provinsi');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'wishlist'>('explore');

  const [mountains, setMountains] = useState<any[]>([]);
  const [totalMountains, setTotalMountains] = useState(0);
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock user data - dalam implementasi nyata, ini akan diambil dari context/state management
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    totalBookings: 3,
    totalMountainsClimbed: 2
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === 'explore') {
          const params = new URLSearchParams();
          params.append('page', currentPage.toString());
          params.append('limit', itemsPerPage.toString());
          if (appliedSearchQuery.trim()) params.append('search', appliedSearchQuery);
          if (selectedProvince !== 'Semua Provinsi') params.append('provinsi', selectedProvince);
          
          const res = await fetch(`/api/gunung?${params.toString()}`);
          const data = await res.json();
          if (data.success) {
            setMountains(data.mountains || []);
            setTotalMountains(data.meta?.total || 0);
          } else {
            setError(data.error || 'Gagal memuat data gunung');
          }
        } else if (activeTab === 'bookings') {
          // Fetch user bookings
          const res = await fetch(`/api/bookings?userId=${user.id}`);
          const data = await res.json();
          if (data.success) {
            setBookings(data.bookings || []);
          }
        } else if (activeTab === 'wishlist') {
          // Fetch user wishlist
          const res = await fetch(`/api/wishlist?userId=${user.id}`);
          const data = await res.json();
          if (data.success) {
            setWishlist(data.wishlist || []);
          }
        }
      } catch (err) {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appliedSearchQuery, selectedProvince, currentPage, activeTab, user.id]);

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

  const handleTabChange = (tab: 'explore' | 'bookings' | 'wishlist') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };





  const renderExploreTab = () => (
    <>
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
            <div key={mountain.id} className="flex flex-col items-center w-full">
              <div className="w-full h-[200px] relative">
                <Link href={`/mountain/${mountain.id}`}>
                  <Image
                    src={mountain.gambar || '/placeholder.svg'}
                    alt={mountain.nama}
                    width={176}
                    height={99}
                    className="w-full h-[99px] object-cover rounded-xl cursor-pointer hover:transform hover:scale-105 transition-transform"
                  />
                </Link>
                <button
                  onClick={() => {
                    // Add to wishlist logic
                    console.log('Add to wishlist:', mountain.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-global-1 rounded-full shadow-md hover:bg-global-3 hover:text-global-1 transition-colors"
                >
                  <Image
                    src="/placeholder.svg?height=16&width=16"
                    alt="Wishlist"
                    width={16}
                    height={16}
                  />
                </button>
                <Link href={`/mountain/${mountain.id}`}>
                  <h3 className="mt-3 text-base font-medium leading-[21px] text-global-1 font-plus-jakarta text-center cursor-pointer hover:text-global-3">
                    {mountain.nama}
                  </h3>
                </Link>
                <p className="mt-1 text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta text-center">
                  {mountain.lokasi === mountain.provinsi
                    ? mountain.provinsi
                    : `${mountain.lokasi}, ${mountain.provinsi}`}
                </p>
                <Link href={`/mountain/${mountain.id}`}>
                  <button className="mt-2 w-full px-4 py-2 bg-global-3 text-global-1 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                    Lihat Detail
                  </button>
                </Link>
              </div>
            </div>
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
    </>
  );

  const renderBookingsTab = () => (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-global-1 font-plus-jakarta mb-6 text-center">
        Pemesanan Saya
      </h2>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-global-1 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={booking.mountain?.gambar || '/placeholder.svg'}
                  alt={booking.mountain?.nama || 'Gunung'}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-bold text-global-2 font-plus-jakarta">
                    {booking.mountain?.nama || 'Gunung'}
                  </h3>
                  <p className="text-sm text-global-2 font-plus-jakarta">
                    {booking.tanggal_pendakian}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-global-2 font-plus-jakarta">
                  Status: <span className={`font-medium ${
                    booking.status === 'confirmed' ? 'text-green-600' : 
                    booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {booking.status === 'confirmed' ? 'Dikonfirmasi' : 
                     booking.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
                  </span>
                </p>
                <p className="text-sm text-global-2 font-plus-jakarta">
                  Jumlah Peserta: {booking.jumlah_peserta}
                </p>
                <p className="text-sm text-global-2 font-plus-jakarta">
                  Total: Rp {booking.total_harga?.toLocaleString('id-ID') || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-global-2 font-plus-jakarta mb-2">
            Belum ada pemesanan
          </p>
          <p className="text-sm text-global-2 font-plus-jakarta mb-4">
            Mulai petualangan Anda dengan memesan tiket pendakian
          </p>
          <button
            onClick={() => handleTabChange('explore')}
            className="px-6 py-3 bg-global-3 text-global-1 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Jelajahi Gunung
          </button>
        </div>
      )}
    </div>
  );

  const renderWishlistTab = () => (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-global-1 font-plus-jakarta mb-6 text-center">
        Wishlist Saya
      </h2>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="flex flex-col items-center w-full">
              <div className="w-full h-[200px] relative">
                <Link href={`/mountain/${item.mountain?.id}`}>
                  <Image
                    src={item.mountain?.gambar || '/placeholder.svg'}
                    alt={item.mountain?.nama || 'Gunung'}
                    width={176}
                    height={99}
                    className="w-full h-[99px] object-cover rounded-xl cursor-pointer hover:transform hover:scale-105 transition-transform"
                  />
                </Link>
                <button
                  onClick={() => {
                    // Remove from wishlist logic
                    console.log('Remove from wishlist:', item.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                >
                  <Image
                    src="/placeholder.svg?height=16&width=16"
                    alt="Remove"
                    width={16}
                    height={16}
                  />
                </button>
                <Link href={`/mountain/${item.mountain?.id}`}>
                  <h3 className="mt-3 text-base font-medium leading-[21px] text-global-1 font-plus-jakarta text-center cursor-pointer hover:text-global-3">
                    {item.mountain?.nama || 'Gunung'}
                  </h3>
                </Link>
                <p className="mt-1 text-sm font-normal leading-[18px] text-global-2 font-plus-jakarta text-center">
                  {item.mountain?.lokasi === item.mountain?.provinsi
                    ? item.mountain?.provinsi
                    : `${item.mountain?.lokasi}, ${item.mountain?.provinsi}`}
                </p>
                <Link href={`/mountain/${item.mountain?.id}`}>
                  <button className="mt-2 w-full px-4 py-2 bg-global-3 text-global-1 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                    Lihat Detail
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-global-2 font-plus-jakarta mb-2">
            Wishlist kosong
          </p>
          <p className="text-sm text-global-2 font-plus-jakarta mb-4">
            Simpan gunung favorit Anda untuk dikunjungi nanti
          </p>
          <button
            onClick={() => handleTabChange('explore')}
            className="px-6 py-3 bg-global-3 text-global-1 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Jelajahi Gunung
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-global-2">
      <div className="flex flex-col flex-1 bg-global-1">
        <Header />
        




        <main className="flex flex-col items-center w-full max-w-[1200px] mx-auto px-4 py-8">
          {loading ? (
            <div className="w-full text-center py-12">Memuat data...</div>
          ) : error ? (
            <div className="w-full text-center py-12 text-red-600">{error}</div>
          ) : (
            <>
              {activeTab === 'explore' && renderExploreTab()}
              {activeTab === 'bookings' && renderBookingsTab()}
              {activeTab === 'wishlist' && renderWishlistTab()}
            </>
          )}

          {/* Pagination for explore tab */}
          {activeTab === 'explore' && totalPages > 1 && (
            <div className="flex flex-row items-center justify-center gap-4 w-full mt-8">
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
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardAfterLogin;