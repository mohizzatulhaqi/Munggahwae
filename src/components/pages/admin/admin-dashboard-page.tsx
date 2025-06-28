'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mountain,
  Calendar,
  TrendingUp,
  Eye,
  Plus,
  ArrowUpRight,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';
import AdminLayout from './admin-layout';
import { useRouter } from 'next/navigation';

interface Booker {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  age: number;
  gender: string;
  isCompanion: boolean;
  idCardFile: string;
  healthCertificateFile: string;
}

interface User {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
}

interface Booking {
  id: string;
  bookingCode: string;
  mountain: string;
  location: string;
  user: User;
  entryDate: string;
  exitDate: string;
  numberOfBookers: number;
  totalAmount: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentDate: string;
  duration: string;
  bookersData: Booker[];
}

const bookings: Booking[] = [
  {
    id: 'BK001',
    bookingCode: 'MNG-2025-001',
    mountain: 'Gunung Rinjani',
    location: 'Lombok, NTB',
    user: {
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@email.com',
      phone: '081234567890',
      idNumber: '3273012345670001',
      birthDate: '1990-05-15',
      birthPlace: 'Jakarta',
      gender: 'male',
    },
    entryDate: '2025-02-15',
    exitDate: '2025-02-17',
    numberOfBookers: 2,
    totalAmount: 'Rp 700,000',
    status: 'confirmed',
    bookingDate: '2025-01-20',
    paymentStatus: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2025-01-20 14:30:00',
    duration: '3 hari 2 malam',
    bookersData: [
      {
        name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@email.com',
        phone: '081234567890',
        idNumber: '3273012345670001',
        age: 34,
        gender: 'Laki-laki',
        isCompanion: false,
        idCardFile: '/uploads/ktp-ahmad-fauzi.pdf',
        healthCertificateFile: '/uploads/surat-sehat-ahmad-fauzi.pdf',
      },
      {
        name: 'Siti Aminah',
        email: 'siti.aminah@email.com',
        phone: '081234567891',
        idNumber: '3273012345670002',
        age: 32,
        gender: 'Perempuan',
        isCompanion: false,
        idCardFile: '/uploads/ktp-siti-aminah.pdf',
        healthCertificateFile: '/uploads/surat-sehat-siti-aminah.pdf',
      },
    ],
  },
  {
    id: 'BK002',
    bookingCode: 'MNG-2025-002',
    mountain: 'Gunung Semeru',
    location: 'Lumajang, Jawa Timur',
    user: {
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '082134567890',
      idNumber: '3578012309870001',
      birthDate: '1988-11-20',
      birthPlace: 'Surabaya',
      gender: 'male',
    },
    entryDate: '2025-03-10',
    exitDate: '2025-03-12',
    numberOfBookers: 4,
    totalAmount: 'Rp 3.200.000',
    status: 'pending',
    bookingDate: '2025-02-15',
    paymentStatus: 'pending',
    paymentMethod: 'Bank Transfer',
    paymentDate: '',
    duration: '3 hari 2 malam',
    bookersData: [
      {
        name: 'Budi Santoso',
        email: 'budi.santoso@email.com',
        phone: '082134567890',
        idNumber: '3578012309870001',
        age: 36,
        gender: 'Laki-laki',
        isCompanion: false,
        idCardFile: '/uploads/ktp-budi-santoso.pdf',
        healthCertificateFile: '/uploads/surat-sehat-budi-santoso.pdf',
      },
      {
        name: 'Dewi Lestari',
        email: 'dewi.lestari@email.com',
        phone: '082134567891',
        idNumber: '3578012309870002',
        age: 35,
        gender: 'Perempuan',
        isCompanion: false,
        idCardFile: '/uploads/ktp-dewi-lestari.pdf',
        healthCertificateFile: '/uploads/surat-sehat-dewi-lestari.pdf',
      },
      {
        name: 'Rudi Hermawan',
        email: 'rudi.hermawan@email.com',
        phone: '082134567892',
        idNumber: '3578012309870003',
        age: 28,
        gender: 'Laki-laki',
        isCompanion: false,
        idCardFile: '/uploads/ktp-rudi-hermawan.pdf',
        healthCertificateFile: '/uploads/surat-sehat-rudi-hermawan.pdf',
      },
      {
        name: 'Ani Wijaya',
        email: 'ani.wijaya@email.com',
        phone: '082134567893',
        idNumber: '3578012309870004',
        age: 25,
        gender: 'Perempuan',
        isCompanion: false,
        idCardFile: '/uploads/ktp-ani-wijaya.pdf',
        healthCertificateFile: '/uploads/surat-sehat-ani-wijaya.pdf',
      },
    ],
  },
  {
    id: 'BK003',
    bookingCode: 'MNG-2025-003',
    mountain: 'Gunung Bromo',
    location: 'Probolinggo, Jawa Timur',
    user: {
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@email.com',
      phone: '081345678901',
      idNumber: '3501012345670001',
      birthDate: '1992-08-10',
      birthPlace: 'Malang',
      gender: 'female',
    },
    entryDate: '2025-02-28',
    exitDate: '2025-03-02',
    numberOfBookers: 1,
    totalAmount: 'Rp 450,000',
    status: 'confirmed',
    bookingDate: '2025-01-25',
    paymentStatus: 'paid',
    paymentMethod: 'E-Wallet',
    paymentDate: '2025-01-25 10:15:00',
    duration: '3 hari 2 malam',
    bookersData: [
      {
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@email.com',
        phone: '081345678901',
        idNumber: '3501012345670001',
        age: 32,
        gender: 'Perempuan',
        isCompanion: false,
        idCardFile: '/uploads/ktp-siti-nurhaliza.pdf',
        healthCertificateFile: '/uploads/surat-sehat-siti-nurhaliza.pdf',
      },
    ],
  },
  {
    id: 'BK004',
    bookingCode: 'MNG-2025-004',
    mountain: 'Gunung Merbabu',
    location: 'Magelang, Jawa Tengah',
    user: {
      name: 'Maya Sari',
      email: 'maya.sari@email.com',
      phone: '082456789012',
      idNumber: '3371012345670001',
      birthDate: '1995-03-22',
      birthPlace: 'Semarang',
      gender: 'female',
    },
    entryDate: '2025-03-05',
    exitDate: '2025-03-07',
    numberOfBookers: 3,
    totalAmount: 'Rp 1.350.000',
    status: 'cancelled',
    bookingDate: '2025-02-10',
    paymentStatus: 'refunded',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2025-02-10 16:45:00',
    duration: '3 hari 2 malam',
    bookersData: [
      {
        name: 'Maya Sari',
        email: 'maya.sari@email.com',
        phone: '082456789012',
        idNumber: '3371012345670001',
        age: 29,
        gender: 'Perempuan',
        isCompanion: false,
        idCardFile: '/uploads/ktp-maya-sari.pdf',
        healthCertificateFile: '/uploads/surat-sehat-maya-sari.pdf',
      },
      {
        name: 'Dian Pratama',
        email: 'dian.pratama@email.com',
        phone: '082456789013',
        idNumber: '3371012345670002',
        age: 30,
        gender: 'Laki-laki',
        isCompanion: false,
        idCardFile: '/uploads/ktp-dian-pratama.pdf',
        healthCertificateFile: '/uploads/surat-sehat-dian-pratama.pdf',
      },
      {
        name: 'Rina Wulandari',
        email: 'rina.wulandari@email.com',
        phone: '082456789014',
        idNumber: '3371012345670003',
        age: 27,
        gender: 'Perempuan',
        isCompanion: false,
        idCardFile: '/uploads/ktp-rina-wulandari.pdf',
        healthCertificateFile: '/uploads/surat-sehat-rina-wulandari.pdf',
      },
    ],
  },
];

const AdminDashboardPage = () => {
  // Calculate statistics from real data
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;

  // Calculate total revenue from confirmed bookings
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, booking) => {
      const amount = parseInt(booking.totalAmount.replace(/[^\d]/g, ''));
      return sum + amount;
    }, 0);

  // Get recent bookings (latest 4)
  const recentBookings = bookings
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 4);

  const stats = [
    {
      title: 'Total Gunung',
      value: '15',
      change: '+2',
      changeType: 'positive',
      icon: Mountain,
      color: 'bg-green-500',
    },
    {
      title: 'Booking Bulan Ini',
      value: totalBookings.toString(),
      change: `+${pendingBookings}`,
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'Pendapatan',
      value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`,
      change: '+18%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  // Today's statistics from real data
  const todayStats = {
    newBookings: pendingBookings,
    activeUsers: bookings.reduce((sum, booking) => sum + booking.numberOfBookers, 0),
    popularMountain: 'Rinjani', // Could be calculated from data
  };

  const router = useRouter();

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
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              Lihat Laporan
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
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
                    <CardDescription>Daftar booking yang baru masuk hari ini</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentBookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      className={`p-6 ${index !== recentBookings.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-green-600">
                              {booking.user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{booking.user.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-3 h-3" />
                              {booking.mountain}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Jumlah Pendaki</p>
                            <p className="font-semibold text-gray-900 flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {booking.numberOfBookers}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <Clock className="w-3 h-3" />
                              {new Date(booking.entryDate).toLocaleDateString('id-ID')}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {booking.status === 'confirmed'
                                ? 'Dikonfirmasi'
                                : booking.status === 'pending'
                                  ? 'Menunggu'
                                  : 'Dibatalkan'}
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

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Aksi Cepat</CardTitle>
                <CardDescription>Shortcut untuk tugas admin yang sering dilakukan</CardDescription>
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
                  <span className="font-semibold text-gray-900">{todayStats.newBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Pendaki</span>
                  <span className="font-semibold text-gray-900">{todayStats.activeUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gunung Populer</span>
                  <span className="font-semibold text-gray-900">{todayStats.popularMountain}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booking Dikonfirmasi</span>
                  <span className="font-semibold text-gray-900">{confirmedBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booking Pending</span>
                  <span className="font-semibold text-yellow-600">{pendingBookings}</span>
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
