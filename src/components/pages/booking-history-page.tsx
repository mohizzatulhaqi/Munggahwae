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

interface BookingHistory {
  id: string;
  bookingCode: string;
  mountainName: string;
  mountainImage: string;
  startDate: string;
  endDate: string;
  duration: number;
  climbers: number;
  totalCost: number;
  status: 'approved' | 'rejected' | 'pending';
  bookingDate: string;
  paymentMethod: string;
  trail: string;
  location: string;
  rejectionReason?: string;
}

// Sample booking data - in real app this would come from API
const sampleBookings: BookingHistory[] = [
  {
    id: '1',
    bookingCode: 'MNG-001-2024',
    mountainName: 'Gunung Rinjani',
    mountainImage: '/placeholder.svg?height=200&width=300',
    startDate: '2024-07-15',
    endDate: '2024-07-17',
    duration: 3,
    climbers: 2,
    totalCost: 1250000,
    status: 'approved',
    bookingDate: '2024-06-20',
    paymentMethod: 'Bank Transfer - BCA',
    trail: 'Jalur Senaru',
    location: 'Lombok, Nusa Tenggara Barat',
  },
  {
    id: '2',
    bookingCode: 'MNG-002-2024',
    mountainName: 'Gunung Semeru',
    mountainImage: '/placeholder.svg?height=200&width=300',
    startDate: '2024-08-10',
    endDate: '2024-08-12',
    duration: 3,
    climbers: 4,
    totalCost: 2100000,
    status: 'pending',
    bookingDate: '2024-06-25',
    paymentMethod: 'E-Wallet - GoPay',
    trail: 'Jalur Ranu Pani',
    location: 'Malang, Jawa Timur',
  },
  {
    id: '3',
    bookingCode: 'MNG-003-2024',
    mountainName: 'Gunung Bromo',
    mountainImage: '/placeholder.svg?height=200&width=300',
    startDate: '2024-06-01',
    endDate: '2024-06-02',
    duration: 2,
    climbers: 3,
    totalCost: 850000,
    status: 'rejected',
    bookingDate: '2024-05-15',
    paymentMethod: 'Credit Card',
    trail: 'Jalur Cemoro Lawang',
    location: 'Probolinggo, Jawa Timur',
    rejectionReason:
      'Dokumen identitas tidak jelas.',
  },
];

export default function BookingHistoryPage() {
  const [bookings] = useState<BookingHistory[]>(sampleBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>(
    'all'
  );

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.mountainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase());
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

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  size="sm"
                >
                  Semua
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('approved')}
                  size="sm"
                >
                  Disetujui
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('rejected')}
                  size="sm"
                >
                  Ditolak
                </Button>
              </div>
            </div>

            {/* Booking Cards */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Tidak ada booking yang sesuai dengan pencarian Anda.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        {/* Mountain Image */}
                        <div className="lg:w-1/4 relative">
                          <img
                            src={booking.mountainImage || '/placeholder.svg'}
                            alt={booking.mountainName}
                            className="w-full h-48 lg:h-full object-cover"
                          />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {booking.mountainName}
                              </h3>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                                <MapPin className="w-3 h-3" />
                                {booking.location}
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                Kode Booking: {booking.bookingCode}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">Jalur: {booking.trail}</p>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="text-right mt-4 sm:mt-0">
                              <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(booking.totalCost)}
                              </p>
                              <p className="text-sm text-gray-500">Total Biaya</p>
                            </div>
                          </div>

                          {/* Rejection Reason */}
                          {booking.status === 'rejected' && booking.rejectionReason && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-red-900 mb-1">
                                    Alasan Penolakan:
                                  </p>
                                  <p className="text-sm text-red-800">{booking.rejectionReason}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Booking Info Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Tanggal Mulai</p>
                                <p className="text-sm font-medium">
                                  {formatDate(booking.startDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Durasi</p>
                                <p className="text-sm font-medium">{booking.duration} hari</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Pendaki</p>
                                <p className="text-sm font-medium">{booking.climbers} orang</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Pembayaran</p>
                                <p className="text-sm font-medium">{booking.paymentMethod}</p>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => (window.location.href = `/history/${booking.id}`)}
                            >
                              Lihat Detail
                            </Button>
                            {booking.status === 'approved' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  (window.location.href = `/history/${booking.id}/e-ticket`)
                                }
                              >
                                Download E-Ticket
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
