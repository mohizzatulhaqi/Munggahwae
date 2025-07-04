'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Download,
  Eye,
  Check,
  X,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Clock,
  Users,
  File,
  FileText as FileTextIcon,
} from 'lucide-react';
import AdminLayout from '@/components/pages/admin/admin-layout';

type Booker = {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  age: number;
  gender: string;
  isCompanion: boolean;
  idCardFile: string;
  healthCertificateFile: string;
};

type User = {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
};

type Booking = {
  id: string;
  bookingCode: string;
  mountain: string;
  location: string;
  route: string;
  user: User;
  entryDate: string;
  exitDate: string;
  numberOfBookers: number;
  totalAmount: string;
  status: string;
  bookingDate: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentDate: string;
  duration: string;
  bookersData: Booker[];
};

const AdminBookingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; type: 'ktp' | 'health' } | null>(
    null
  );
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [bookingToReject, setBookingToReject] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await fetch('/api/admin/bookings/list');
        const result = await res.json();
        if (result.success) {
          setBookings(result.bookings.map((b: any) => ({
            id: b.id,
            bookingCode: b.booking_code || b.bookingCode || b.id || '-',
            mountain: b.mountain || '-',
            location: b.location || '-',
            route: b.route || '-',
            user: {
              name: b.user_name || '-',
              email: b.user_email || '-',
              phone: b.user_phone || '-',
              idNumber: b.user_id_number || '-',
              birthDate: b.user_birth_date || '-',
              birthPlace: b.user_birth_place || '-',
              gender: b.user_gender || '-',
            },
            entryDate: b.entry_date || '-',
            exitDate: b.exit_date || '-',
            numberOfBookers: b.number_of_bookers || 0,
            totalAmount: b.total_amount || '-',
            status: b.status || '-',
            bookingDate: b.booking_date || '-',
            paymentStatus: b.payment_status || '-',
            paymentMethod: b.payment_method || '-',
            paymentDate: b.payment_date || '-',
            duration: b.duration || '-',
            bookersData: b.bookers_data || [],
          })));
        } else {
          setFetchError(result.message || 'Gagal mengambil data booking');
        }
      } catch (err: any) {
        setFetchError(err.message || 'Gagal mengambil data booking');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const refreshBookings = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/bookings/list');
      const result = await res.json();
      if (result.success) {
        setBookings(result.bookings.map((b: any) => ({
          id: b.id,
          bookingCode: b.booking_code || b.bookingCode || b.id || '-',
          mountain: b.mountain || '-',
          location: b.location || '-',
          route: b.route || '-',
          user: {
            name: b.user_name || '-',
            email: b.user_email || '-',
            phone: b.user_phone || '-',
            idNumber: b.user_id_number || '-',
            birthDate: b.user_birth_date || '-',
            birthPlace: b.user_birth_place || '-',
            gender: b.user_gender || '-',
          },
          entryDate: b.entry_date || '-',
          exitDate: b.exit_date || '-',
          numberOfBookers: b.number_of_bookers || 0,
          totalAmount: b.total_amount || '-',
          status: b.status || '-',
          bookingDate: b.booking_date || '-',
          paymentStatus: b.payment_status || '-',
          paymentMethod: b.payment_method || '-',
          paymentDate: b.payment_date || '-',
          duration: b.duration || '-',
          bookersData: b.bookers_data || [],
        })));
      } else {
        setFetchError(result.message || 'Gagal mengambil data booking');
      }
    } catch (err: any) {
      setFetchError(err.message || 'Gagal mengambil data booking');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.mountain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'pending':
        return 'Menunggu';
      case 'cancelled':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleApprove = async (bookingId: string) => {
    if (!window.confirm('Konfirmasi booking ini?')) return;
    try {
      const res = await fetch('/api/admin/bookings/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId }),
      });
      const result = await res.json();
      if (result.success) {
        alert('Booking berhasil dikonfirmasi!');
        refreshBookings();
      } else {
        alert('Gagal konfirmasi booking: ' + result.message);
      }
    } catch (err: any) {
      alert('Gagal konfirmasi booking: ' + err.message);
    }
  };

  const handleReject = (bookingId: string) => {
    setBookingToReject(bookingId);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (rejectReason.trim() === '') {
      alert('Harap masukkan alasan penolakan');
      return;
    }
    try {
      const res = await fetch('/api/admin/bookings/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingToReject, reason: rejectReason }),
      });
      const result = await res.json();
      if (result.success) {
        alert('Booking berhasil ditolak!');
        setShowRejectModal(false);
        setRejectReason('');
        setBookingToReject(null);
        refreshBookings();
      } else {
        alert('Gagal menolak booking: ' + result.message);
      }
    } catch (err: any) {
      alert('Gagal menolak booking: ' + err.message);
    }
  };

  const handleExport = () => {
    console.log('Exporting bookings data');
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

  const renderFilePreview = (fileUrl: string, fileType: 'ktp' | 'health') => {
    const label = fileType === 'ktp' ? 'KTP' : 'Surat Kesehatan';
    const iconColor = fileType === 'ktp' ? 'text-blue-500' : 'text-green-500';
    const borderColor = fileType === 'ktp' ? 'border-blue-200' : 'border-green-200';

    return (
      <div
        className={`mt-2 p-3 border rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-50 ${borderColor}`}
        onClick={() => setPreviewFile({ url: fileUrl, type: fileType })}
      >
        <FileTextIcon className={`w-5 h-5 ${iconColor}`} />
        <div>
          <p className="text-sm font-medium">Lihat {label}</p>
          <p className="text-xs text-gray-500">Format: PDF</p>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Booking</h1>
            <p className="text-gray-600">Kelola semua booking pendakian</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari kode booking, gunung, atau nama pengguna..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="cancelled">Ditolak</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Booking ({filteredBookings.length})
            </h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Kode Booking</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Gunung</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Pengguna</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Tanggal</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Jumlah</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.bookingCode}</p>
                          <p className="text-sm text-gray-500">{booking.bookingDate}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{booking.mountain}</p>
                            <p className="text-sm text-gray-500">{booking.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{booking.user.name}</p>
                            <p className="text-sm text-gray-500">{booking.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900">{booking.entryDate}</p>
                            <p className="text-sm text-gray-500">s/d {booking.exitDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.totalAmount}</p>
                          <p className="text-sm text-gray-500">{booking.numberOfBookers} orang</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                        >
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetail(booking)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(booking.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleReject(booking.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {showDetailModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Detail Transaksi</h2>
                <Button variant="ghost" onClick={closeModal}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Booking Information */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Informasi Booking
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Kode Booking</p>
                        <p className="font-medium">{selectedBooking.bookingCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Booking</p>
                        <p className="font-medium">{selectedBooking.bookingDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gunung</p>
                        <p className="font-medium">{selectedBooking.mountain}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Lokasi</p>
                        <p className="font-medium">{selectedBooking.location}</p>
                      </div>
                      {/* Tambahkan ini untuk menampilkan jalur */}
                      <div>
                        <p className="text-sm text-gray-600">Jalur Pendakian</p>
                        <p className="font-medium">{selectedBooking.route}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Masuk</p>
                        <p className="font-medium">{selectedBooking.entryDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Keluar</p>
                        <p className="font-medium">{selectedBooking.exitDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Durasi</p>
                        <p className="font-medium">{selectedBooking.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}
                        >
                          {getStatusText(selectedBooking.status)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Informasi Pembayaran
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Pembayaran</p>
                        <p className="font-medium text-lg">{selectedBooking.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status Pembayaran</p>
                        <p className="font-medium">{selectedBooking.paymentStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Metode Pembayaran</p>
                        <p className="font-medium">{selectedBooking.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Pembayaran</p>
                        <p className="font-medium">{selectedBooking.paymentDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Person */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Kontak Person
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nama Lengkap</p>
                        <p className="font-medium">{selectedBooking.user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Jenis Kelamin</p>
                        <p className="font-medium">
                          {selectedBooking.user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{selectedBooking.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Nomor Telepon</p>
                          <p className="font-medium">{selectedBooking.user.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nomor Identitas</p>
                        <p className="font-medium">{selectedBooking.user.idNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tempat, Tanggal Lahir</p>
                        <p className="font-medium">
                          {selectedBooking.user.birthPlace}, {selectedBooking.user.birthDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bookers List */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Daftar Pendaki ({selectedBooking.numberOfBookers} orang)
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedBooking.bookersData.map((booker, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-lg">Pendaki ke-{index + 1}</h4>
                            {booker.isCompanion && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Pendamping
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Nama</p>
                              <p className="font-medium">{booker.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Email</p>
                              <p className="font-medium">{booker.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Telepon</p>
                              <p className="font-medium">{booker.phone}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">No. Identitas</p>
                              <p className="font-medium">{booker.idNumber}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Usia</p>
                              <p className="font-medium">{booker.age} tahun</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Jenis Kelamin</p>
                              <p className="font-medium">{booker.gender}</p>
                            </div>
                          </div>

                          {/* File Upload Section */}
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="font-medium mb-2 flex items-center gap-2">
                              <File className="w-4 h-4" />
                              Dokumen Pendukung
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Kartu Tanda Pengenal (KTP)
                                </p>
                                {renderFilePreview(booker.idCardFile, 'ktp')}
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Surat Kesehatan</p>
                                {renderFilePreview(booker.healthCertificateFile, 'health')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons for Pending Bookings */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApprove(selectedBooking.id);
                        closeModal();
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Setujui Booking
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      onClick={() => {
                        handleReject(selectedBooking.id);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Tolak Booking
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {previewFile.type === 'ktp' ? 'Kartu Tanda Penduduk (KTP)' : 'Surat Kesehatan'}
                </h2>
                <Button variant="ghost" onClick={() => setPreviewFile(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6">
                <iframe
                  src={previewFile.url}
                  className="w-full h-[75vh] border rounded-md"
                  title={`Preview ${previewFile.type === 'ktp' ? 'KTP' : 'Surat Kesehatan'}`}
                />
              </div>
              <div className="p-4 border-t flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Dokumen {previewFile.type === 'ktp' ? 'KTP' : 'Surat Kesehatan'} dalam format PDF
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = previewFile.url;
                    link.download = previewFile.type === 'ktp' ? 'ktp.pdf' : 'surat-sehat.pdf';
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Unduh PDF
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Reason Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#f7fcf9] rounded-lg shadow-xl max-w-md w-full">
              <div className="border-b border-[#e8f2ed] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Alasan Penolakan</h2>
                <Button variant="ghost" onClick={() => setShowRejectModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-700">
                  Silakan berikan alasan mengapa booking ini ditolak. Alasan ini akan dikirimkan ke
                  pengguna.
                </p>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0fbd66] focus:border-transparent"
                  rows={4}
                  placeholder="Masukkan alasan penolakan..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                ></textarea>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Batal
                  </Button>
                  <Button className="bg-[#0fbd66] hover:bg-[#0daa5a]" onClick={confirmReject}>
                    Konfirmasi Penolakan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookingsPage;