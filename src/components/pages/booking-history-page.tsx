'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Users,
  Clock,
  Search,
  FileText,
  CreditCard,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { formatCurrency } from '@/lib/utils';
import { BookingWithMountain } from '@/lib/api/historyApi';

interface BookingHistoryPageProps {
  bookings: BookingWithMountain[];
  onRefresh: () => void;
  loading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onStatusFilter?: (status: string) => void;
  onSearch?: (search: string) => void;
}

export default function BookingHistoryPage({ 
  bookings, 
  onRefresh, 
  loading,
  pagination,
  onPageChange,
  onStatusFilter,
  onSearch
}: BookingHistoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>(
    'all'
  );

  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Call parent search handler if provided
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle status filter
  const handleStatusFilter = (status: 'all' | 'approved' | 'rejected' | 'pending') => {
    setStatusFilter(status);
    
    // Call parent status filter handler if provided
    if (onStatusFilter) {
      onStatusFilter(status);
    }
  };

  // Filter bookings based on search and status (only if not using server-side filtering)
  const filteredBookings = onSearch ? bookings : bookings.filter((booking) => {
    const matchesSearch =
      booking.gunung.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.kodeBooking.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disetujui</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ditolak</Badge>;
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Menunggu Konfirmasi
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FileText className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Kamu Belum Melakukan Transaksi</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Mulai petualangan pendakianmu dengan memesan tiket gunung favoritmu sekarang juga!
      </p>
      <Button
        onClick={() => (window.location.href = '/mountain-discovery')}
        className="bg-green-600 hover:bg-green-700"
      >
        Jelajahi Gunung
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Booking</h1>
          <p className="text-gray-600">Lihat semua riwayat pemesanan pendakian gunung Anda</p>
        </div>

        {bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari berdasarkan nama gunung atau kode booking..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => handleStatusFilter('all')}
                  size="sm"
                >
                  Semua
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  onClick={() => handleStatusFilter('approved')}
                  size="sm"
                >
                  Disetujui
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => handleStatusFilter('pending')}
                  size="sm"
                >
                  Menunggu
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                  onClick={() => handleStatusFilter('rejected')}
                  size="sm"
                >
                  Ditolak
                </Button>
              </div>
            </div>

            {/* Booking Cards */}
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Mountain Image */}
                      <div className="lg:w-48 lg:h-32 w-full h-48">
                        <img
                          src={booking.gunung.urlGambar || '/placeholder.svg'}
                          alt={booking.gunung.nama}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {booking.gunung.nama}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {booking.gunung.lokasi}, {booking.gunung.provinsi}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(booking.status)}
                            <span className="text-sm text-gray-500">
                              {booking.kodeBooking}
                            </span>
                          </div>
                        </div>

                        {/* Booking Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Tanggal Masuk</p>
                              <p className="font-medium">{formatShortDate(new Date(booking.tanggalMasuk))}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Tanggal Keluar</p>
                              <p className="font-medium">{formatShortDate(new Date(booking.tanggalKeluar))}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Jumlah Pendaki</p>
                              <p className="font-medium">{booking.jumlahPemesan} orang</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Total Biaya</p>
                              <p className="font-medium">{formatCurrency(booking.totalBiaya)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/history/${booking.id}`}
                          >
                            Lihat Detail
                          </Button>
                          {booking.status === 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.href = `/history/${booking.id}/e-ticket`}
                            >
                              Download E-Ticket
                            </Button>
                          )}
                          {booking.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.href = `/history/${booking.id}`}
                            >
                              Lihat Status
                            </Button>
                          )}
                          {booking.status === 'rejected' && booking.alasanPenolakan && (
                            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-red-800">Alasan Penolakan:</p>
                                <p className="text-sm text-red-700">{booking.alasanPenolakan}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
