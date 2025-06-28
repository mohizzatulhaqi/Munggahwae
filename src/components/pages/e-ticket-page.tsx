'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, Printer, Phone, Mail } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { formatCurrency } from '@/lib/utils';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ETicketData {
  id: string;
  bookingCode: string;
  mountainName: string;
  location: string;
  trail: string;
  startDate: string;
  endDate: string;
  climbers: string[];
  totalCost: number;
  qrCode: string;
  validUntil: string;
  issueDate: string;
}

export default function ETicketPage({ bookingId }: { bookingId: string }) {
  const [ticket, setTicket] = useState<ETicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API call to get ticket data
    setTimeout(() => {
      const sampleTicket: ETicketData = {
        id: bookingId,
        bookingCode: 'MNG-001-2024',
        mountainName: 'Gunung Rinjani',
        location: 'Lombok, Nusa Tenggara Barat',
        trail: 'Jalur Senaru',
        startDate: '2024-07-15',
        endDate: '2024-07-17',
        climbers: ['Ahmad Rizki', 'Sari Dewi'],
        totalCost: 1250000,
        qrCode: 'https://munggahwae.com/verify/MNG-001-2024',
        validUntil: '2024-07-17',
        issueDate: '2024-06-20',
      };
      setTicket(sampleTicket);
      setLoading(false);
    }, 1000);
  }, [bookingId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`E-Ticket-${ticket?.bookingCode}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">E-Ticket Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">E-Ticket dengan ID tersebut tidak dapat ditemukan.</p>
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
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 print:hidden">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Detail
        </Button>

        {/* E-Ticket */}
        <div ref={ticketRef}>
          <Card className="max-w-4xl mx-auto bg-white shadow-lg">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">MUNGGAHWAE</h1>
                    <p className="text-green-100">E-Ticket Pendakian Gunung</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-100">Kode Booking</p>
                    <p className="text-xl font-bold">{ticket.bookingCode}</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Booking Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {ticket.mountainName}
                      </h2>
                      <p className="text-gray-600 mb-4">{ticket.location}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Informasi Pendakian</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Jalur:</span>
                              <span className="font-medium">{ticket.trail}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tanggal Masuk:</span>
                              <span className="font-medium">{formatDate(ticket.startDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tanggal Keluar:</span>
                              <span className="font-medium">{formatDate(ticket.endDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Jumlah Pendaki:</span>
                              <span className="font-medium">{ticket.climbers.length} orang</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Daftar Pendaki</h3>
                          <div className="space-y-1 text-sm">
                            {ticket.climbers.map((climber, index) => (
                              <div key={index} className="flex justify-between">
                                <span className="text-gray-600">{index + 1}.</span>
                                <span className="font-medium">{climber}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Informasi Pembayaran</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Biaya:</span>
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(ticket.totalCost)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - QR Code */}
                  <div className="lg:col-span-1">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-4">QR Code Verifikasi</h3>
                      <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                          <QRCode
                            value={ticket.qrCode}
                            size={120}
                            level="H"
                            includeMargin={true}
                            fgColor="#1f2937"
                            bgColor="#ffffff"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        Tunjukkan QR Code ini kepada petugas di gerbang masuk
                      </p>
                    </div>

                    <div className="mt-6 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tanggal Terbit:</span>
                          <span className="font-medium">{formatDate(ticket.issueDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Berlaku Hingga:</span>
                          <span className="font-medium">{formatDate(ticket.validUntil)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border-t p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Catatan Penting:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• E-Ticket ini harus ditunjukkan kepada petugas di gerbang masuk</li>
                  <li>• Pastikan membawa identitas diri yang masih berlaku</li>
                  <li>• Datang minimal 30 menit sebelum waktu pendakian</li>
                  <li>• E-Ticket tidak dapat dipindahtangankan</li>
                  <li>• Hubungi customer service jika ada pertanyaan</li>
                </ul>
              </div>

              {/* Footer */}
              <div className="bg-gray-100 p-6 text-center">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+62 21 1234 5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>support@munggahwae.com</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  © 2024 Munggahwae. Semua hak dilindungi undang-undang.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Action Buttons */}
      <div className="flex justify-center mb-6 print:hidden">
        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      
      <Footer />
    </div>
  );
}
