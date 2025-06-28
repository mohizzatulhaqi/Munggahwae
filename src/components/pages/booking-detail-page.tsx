'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Users,
  MapPin,
  CreditCard,
  Download,
  ArrowLeft,
  Phone,
  Mail,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  VenusAndMars,
  Cake,
  Home,
} from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { formatCurrency } from '@/lib/utils';

interface BookingDetail {
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
  description: string;
  climberDetails: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    birthDate: string;
    birthPlace: string;
    idNumber: string;
  }[];
  paymentDetails: {
    subtotal: number;
    adminFee: number;
    paymentFee: number;
    total: number;
  };
  rejectionReason?: string;
}

// Sample booking detail data - different for each ID
const getBookingData = (id: string): BookingDetail => {
  const bookingData: { [key: string]: BookingDetail } = {
    '1': {
      id: '1',
      bookingCode: 'MNG-001-2024',
      mountainName: 'Gunung Rinjani',
      mountainImage: '/placeholder.svg?height=400&width=600',
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
      description:
        'Pendakian 3 hari 2 malam melalui jalur Senaru dengan pemandangan Danau Segara Anak yang menakjubkan.',
      climberDetails: [
        {
          name: 'Ahmad Rizki',
          email: 'ahmad.rizki@email.com',
          phone: '081234567890',
          gender: 'Laki-laki',
          birthDate: '1990-05-15',
          birthPlace: 'Jakarta',
          idNumber: '3201234567890123',
        },
        {
          name: 'Sari Dewi',
          email: 'sari.dewi@email.com',
          phone: '081234567891',
          gender: 'Perempuan',
          birthDate: '1992-08-20',
          birthPlace: 'Bandung',
          idNumber: '3201234567890124',
        },
      ],
      paymentDetails: {
        subtotal: 1200000,
        adminFee: 5000,
        paymentFee: 0,
        total: 1250000,
      },
    },
    '2': {
      id: '2',
      bookingCode: 'MNG-002-2024',
      mountainName: 'Gunung Semeru',
      mountainImage: '/placeholder.svg?height=400&width=600',
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
      description:
        'Pendakian 3 hari 2 malam menuju puncak Mahameru melalui jalur Ranu Pani dengan pemandangan Ranu Kumbolo.',
      climberDetails: [
        {
          name: 'Budi Santoso',
          email: 'budi.santoso@email.com',
          phone: '081234567892',
          gender: 'Laki-laki',
          birthDate: '1988-03-10',
          birthPlace: 'Surabaya',
          idNumber: '3201234567890125',
        },
        {
          name: 'Rina Sari',
          email: 'rina.sari@email.com',
          phone: '081234567893',
          gender: 'Perempuan',
          birthDate: '1991-11-25',
          birthPlace: 'Yogyakarta',
          idNumber: '3201234567890126',
        },
        {
          name: 'Doni Pratama',
          email: 'doni.pratama@email.com',
          phone: '081234567894',
          gender: 'Laki-laki',
          birthDate: '1993-07-18',
          birthPlace: 'Semarang',
          idNumber: '3201234567890127',
        },
        {
          name: 'Lisa Maharani',
          email: 'lisa.maharani@email.com',
          phone: '081234567895',
          gender: 'Perempuan',
          birthDate: '1995-02-14',
          birthPlace: 'Medan',
          idNumber: '3201234567890128',
        },
      ],
      paymentDetails: {
        subtotal: 2000000,
        adminFee: 50000,
        paymentFee: 50000,
        total: 2100000,
      },
    },
    '3': {
      id: '3',
      bookingCode: 'MNG-003-2024',
      mountainName: 'Gunung Bromo',
      mountainImage: '/placeholder.svg?height=400&width=600',
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
      description:
        'Pendakian 2 hari 1 malam untuk menyaksikan sunrise di Gunung Bromo melalui jalur Cemoro Lawang.',
      climberDetails: [
        {
          name: 'Dewi Sartika',
          email: 'dewi.sartika@email.com',
          phone: '081234567893',
          gender: 'Perempuan',
          birthDate: '1989-09-30',
          birthPlace: 'Denpasar',
          idNumber: '3201234567890129',
        },
        {
          name: 'Andi Wijaya',
          email: 'andi.wijaya@email.com',
          phone: '081234567896',
          gender: 'Laki-laki',
          birthDate: '1990-12-05',
          birthPlace: 'Makassar',
          idNumber: '3201234567890130',
        },
        {
          name: 'Maya Putri',
          email: 'maya.putri@email.com',
          phone: '081234567897',
          gender: 'Perempuan',
          birthDate: '1994-04-22',
          birthPlace: 'Palembang',
          idNumber: '3201234567890131',
        },
      ],
      paymentDetails: {
        subtotal: 800000,
        adminFee: 25000,
        paymentFee: 25000,
        total: 850000,
      },
      rejectionReason:
        'Dokumen identitas yang diunggah tidak jelas dan tidak dapat diverifikasi.',
    },
  };

  return bookingData[id] || bookingData['1'];
};

export default function BookingDetailPage({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBooking(getBookingData(bookingId));
      setLoading(false);
    }, 1000);
  }, [bookingId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disetujui
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Ditolak
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertCircle className="w-3 h-3 mr-1" />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">Booking dengan ID tersebut tidak dapat ditemukan.</p>
            <Button onClick={() => window.history.back()}>Kembali</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Riwayat
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{booking.mountainName}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                {booking.location}
              </div>
              <p className="text-gray-600">Kode Booking: {booking.bookingCode}</p>
            </div>
            <div className="mt-4 sm:mt-0">{getStatusBadge(booking.status)}</div>
          </div>
        </div>

        {/* Rejection Reason Alert */}
        {booking.status === 'rejected' && booking.rejectionReason && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Alasan Penolakan</h3>
                  <p className="text-red-800 text-sm leading-relaxed">{booking.rejectionReason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mountain Image */}
            <Card>
              <CardContent className="p-0">
                <img
                  src={booking.mountainImage || '/placeholder.svg'}
                  alt={booking.mountainName}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Deskripsi Pendakian</h3>
                  <p className="text-gray-600">{booking.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Informasi Pendakian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tanggal & Waktu</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal Mulai:</span>
                        <span className="font-medium">{formatDate(booking.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal Selesai:</span>
                        <span className="font-medium">{formatDate(booking.endDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durasi:</span>
                        <span className="font-medium">{booking.duration} hari</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Detail Pendakian</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jalur:</span>
                        <span className="font-medium">{booking.trail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jumlah Pendaki:</span>
                        <span className="font-medium">{booking.climbers} orang</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal Booking:</span>
                        <span className="font-medium">{formatDate(booking.bookingDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Climber Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Data Pendaki
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {booking.climberDetails.map((climber, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                    >
                      <h4 className="font-medium text-gray-900 mb-3">Pendaki {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-600">Nama:</span>
                            <span className="font-medium ml-2">{climber.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium ml-2">{climber.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-600">Telepon:</span>
                            <span className="font-medium ml-2">{climber.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <VenusAndMars className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-600">Jenis Kelamin:</span>
                            <span className="font-medium ml-2">{climber.gender}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cake className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-600">Tanggal Lahir:</span>
                            <span className="font-medium ml-2">{formatDate(climber.birthDate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-600">Tempat Lahir:</span>
                            <span className="font-medium ml-2">{climber.birthPlace}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:col-span-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-600">No. KTP:</span>
                            <span className="font-medium ml-2">{climber.idNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Ringkasan Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(booking.paymentDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Admin:</span>
                    <span>{formatCurrency(booking.paymentDetails.adminFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Pembayaran:</span>
                    <span>{formatCurrency(booking.paymentDetails.paymentFee)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      {formatCurrency(booking.paymentDetails.total)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Metode Pembayaran: {booking.paymentMethod}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {booking.status === 'approved' && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => (window.location.href = `/history/${booking.id}/e-ticket`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download E-Ticket
                    </Button>
                  )}
                  <Button variant="outline" className="w-full bg-transparent">
                    Hubungi Customer Service
                  </Button>
                  {booking.status === 'rejected' && (
                    <Button variant="outline" className="w-full bg-transparent">
                      Booking Ulang
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}