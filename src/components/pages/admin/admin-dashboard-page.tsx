'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mountain,
  Calendar,
  TrendingUp,
  Eye,
  ArrowUpRight,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';
import AdminLayout from '@/components/pages/admin/admin-layout';

interface SupabaseBooking {
  id: string;
  tanggalMasuk: string;
  tanggalKeluar: string;
  jumlahPemesan: number;
  totalHarga: number;
  status: string;
  paymentStatus: string;
  jalurId: string;
  penggunaId: string;
  gunungId: string;
  alasan_tolak: string | null;
  nama_gunung?: string; // Tambahkan properti ini untuk nama gunung
  lokasi_gunung?: string; // Tambahkan properti ini untuk lokasi gunung
}

interface DashboardStatistics {
  newBookings: number;
  activeUsers: number;
  popularMountain: string;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalMountains: number;
  totalRevenue: number;
  averageBookingValue: number;
  bookingSuccessRate: number;
}

const AdminDashboardPage = () => {
  const [bookings, setBookings] = useState<SupabaseBooking[]>([]);
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch bookings
        const bookingsRes = await fetch('/api/admin/bookings/list');
        const bookingsResult = await bookingsRes.json();
        if (!bookingsResult.success) throw new Error(bookingsResult.message);
        setBookings(bookingsResult.bookings);
        
        // Fetch statistics
        const statsRes = await fetch('/api/admin/statistics');
        const statsResult = await statsRes.json();
        if (!statsResult.success) throw new Error(statsResult.message);
        setStatistics(statsResult.statistics);
        
      } catch (err: any) {
        setError(err.message || 'Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <AdminLayout><p>Memuat data dashboard...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">Error: {error}</p></AdminLayout>;
  if (!statistics) return <AdminLayout><p>Data statistik tidak tersedia</p></AdminLayout>;

  // Helper functions for status styling (consistent with admin-booking-page)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'dikonfirmasi':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'menunggu':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'ditolak':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'dikonfirmasi':
        return 'Dikonfirmasi';
      case 'pending':
      case 'menunggu':
        return 'Menunggu';
      case 'cancelled':
      case 'ditolak':
      case 'rejected':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.tanggalMasuk).getTime() - new Date(a.tanggalMasuk).getTime())
    .slice(0, 4);

  const stats = [
    {
      title: 'Total Gunung',
      value: statistics.totalMountains.toString(),
      change: '+2',
      changeType: 'positive',
      icon: Mountain,
      color: 'bg-green-500',
    },
    {
      title: 'Total Booking',
      value: statistics.totalBookings.toString(),
      change: `+${statistics.newBookings}`,
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'Pendapatan',
      value: `Rp ${(statistics.totalRevenue / 1000000).toFixed(1)}M`,
      change: '+18%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-plus-jakarta">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Selamat datang kembali! Berikut ringkasan platform Munggahwae hari ini.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Booking Terbaru
                    </CardTitle>
                    <CardDescription>Daftar booking yang baru masuk</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentBookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      className={`p-6 ${
                        index !== recentBookings.length - 1
                          ? 'border-b border-gray-100'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-green-600">
                              {booking.penggunaId?.slice(0, 2).toUpperCase() || 'US'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Nama Gunung: {booking.nama_gunung || 'Tidak diketahui'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-3 h-3" />
                              Lokasi: {booking.lokasi_gunung || 'Tidak diketahui'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Jumlah Pendaki</p>
                            <p className="font-semibold text-gray-900 flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {booking.jumlahPemesan}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <Clock className="w-3 h-3" />
                              {new Date(booking.tanggalMasuk).toLocaleDateString('id-ID')}
                            </div>
                            <span
                              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium border min-w-[80px] ${getStatusColor(booking.status)}`}
                            >
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Today Stats */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Aksi Cepat</CardTitle>
                <CardDescription>Shortcut untuk tugas admin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => router.push('/admin/mountains')}
                  className="w-full justify-start gap-3 h-12 bg-green-600 hover:bg-green-700"
                >
                  <Mountain className="w-5 h-5" />
                  Tambah Gunung
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/bookings')}
                  className="w-full justify-start gap-3 h-12"
                >
                  <Calendar className="w-5 h-5" />
                  Lihat Booking
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Statistik Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booking Baru</span>
                  <span className="font-semibold text-gray-900">{statistics.newBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Pendaki</span>
                  <span className="font-semibold text-gray-900">{statistics.activeUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gunung Populer</span>
                  <span className="font-semibold text-gray-900">{statistics.popularMountain}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booking Dikonfirmasi</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{statistics.confirmedBookings}</span>
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium border min-w-[70px] bg-green-100 text-green-800 border-green-200">
                      Dikonfirmasi
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booking Pending</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{statistics.pendingBookings}</span>
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium border min-w-[70px] bg-yellow-100 text-yellow-800 border-yellow-200">
                      Menunggu
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booking Ditolak</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{statistics.cancelledBookings}</span>
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium border min-w-[70px] bg-red-100 text-red-800 border-red-200">
                      Ditolak
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;