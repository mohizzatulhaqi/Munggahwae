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

interface AdminDashboardPageProps {
  statistics: any;
  onRefresh: () => void;
  loading: boolean;
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

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ statistics, onRefresh, loading }) => {
  const router = useRouter();

  const handleViewBookings = () => {
    router.push('/admin/bookings');
  };

  const handleViewMountains = () => {
    router.push('/admin/mountains');
  };

  const handleAddMountain = () => {
    router.push('/admin/mountains/add');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <Button onClick={onRefresh} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics?.totalBookings || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Semua pemesanan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {statistics?.pendingBookings || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Menunggu konfirmasi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {statistics?.confirmedBookings || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Sudah dikonfirmasi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {statistics?.totalRevenue?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Pendapatan total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewBookings}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Kelola Bookings
              </CardTitle>
              <CardDescription>
                Lihat dan kelola semua pemesanan pendakian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Lihat Bookings
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewMountains}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-5 w-5" />
                Kelola Gunung
              </CardTitle>
              <CardDescription>
                Kelola data gunung dan jalur pendakian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Lihat Gunung
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleAddMountain}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Tambah Gunung
              </CardTitle>
              <CardDescription>
                Tambah gunung baru ke sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Tambah Baru
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Aktivitas pemesanan terbaru dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Booking baru diterima</p>
                    <p className="text-sm text-gray-500">Gunung Rinjani - 2 pendaki</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 menit yang lalu</span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Booking dikonfirmasi</p>
                    <p className="text-sm text-gray-500">Gunung Semeru - 4 pendaki</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">15 menit yang lalu</span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Pembayaran diterima</p>
                    <p className="text-sm text-gray-500">Gunung Bromo - 1 pendaki</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">1 jam yang lalu</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
