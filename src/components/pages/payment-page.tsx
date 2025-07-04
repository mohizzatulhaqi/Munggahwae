'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CreditCard,
  Building2,
  Smartphone,
  Clock,
  Shield,
  CheckCircle,
  ArrowLeft,
  Copy,
  QrCode,
  
} from 'lucide-react';
import Image from 'next/image';
import type { BookingData } from '@/app/mountain/[id]/booking-terms/booking-form/page';
import { Mountain } from '@/lib/mountain-data';
import { useParams } from 'next/navigation';
interface PaymentPageProps {
  bookingData: BookingData;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
}

type PaymentMethod = 'bank_transfer' | 'e_wallet' | 'credit_card' | 'qris';

const PAYMENT_METHODS = [
  {
    id: 'bank_transfer' as PaymentMethod,
    name: 'Transfer Bank',
    icon: Building2,
    description: 'BCA, Mandiri, BNI, BRI',
    fee: 0,
  },
  {
    id: 'e_wallet' as PaymentMethod,
    name: 'E-Wallet',
    icon: Smartphone,
    description: 'GoPay, OVO, DANA, ShopeePay',
    fee: 2500,
  },
  {
    id: 'credit_card' as PaymentMethod,
    name: 'Kartu Kredit',
    icon: CreditCard,
    description: 'Visa, Mastercard, JCB',
    fee: 5000,
  },
  {
    id: 'qris' as PaymentMethod,
    name: 'QRIS',
    icon: QrCode,
    description: 'Scan QR Code',
    fee: 0,
  },
];

const BANKS = [
  { code: 'bca', name: 'BCA', logo: '/images/bca.png' },
  { code: 'mandiri', name: 'Mandiri', logo: '/images/mandiri.png' },
  { code: 'bni', name: 'BNI', logo: '/images/bni.png' },
  { code: 'bri', name: 'BRI', logo: '/images/bri.png' },
];

const E_WALLETS = [
  { code: 'gopay', name: 'GoPay', logo: '/images/gopay.png' },
  { code: 'ovo', name: 'OVO', logo: '/images/ovo.jpg' },
  { code: 'dana', name: 'DANA', logo: '/images/dana.jpg' },
  { code: 'shopeepay', name: 'ShopeePay', logo: '/images/spay.png' },
];

// Simple QR Code component using a service (you could also use a library like qrcode)
const QRCodeDisplay = ({ value, size = 200 }: { value: string; size?: number }) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

  return (
    <div className="flex justify-center">
      <img src={qrCodeUrl} alt="QR Code" width={size} height={size} className="border rounded-lg" />
    </div>
  );
};

export default function PaymentPage({
  bookingData,
  onPaymentSuccess,
  onPaymentCancel,
}: PaymentPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bank_transfer');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedEWallet, setSelectedEWallet] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  // Generate stable booking ID and order data that won't change during component lifecycle
  const stableOrderData = useMemo(() => {
    const timestamp = Date.now();
    const bookingId = timestamp.toString().slice(-8);
    const orderId = `ORDER-${timestamp}`;

    return {
      bookingId,
      orderId,
      timestamp,
      createdDate: new Date(timestamp).toLocaleDateString('id-ID'),
    };
  }, []); // Empty dependency array ensures this only runs once
  const params = useParams();
  const mountainId = params?.id as string;
  // For now, we'll use a fixed base cost since mountain data is not available
  const baseCost = 350000;

  // Calculate costs
  const days = Math.ceil(
    (new Date(bookingData.exitDate).getTime() - new Date(bookingData.entryDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const subtotal = baseCost * bookingData.numberOfBookers * days;
  const adminFee = 5000;
  const paymentFee = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.fee || 0;
  const total = subtotal + adminFee + paymentFee;

  // Generate stable QRIS data using the stable order data
  const qrisData = useMemo(() => {
    const merchantId = 'ID1234567890123456';
    const amount = total;
    const { orderId } = stableOrderData;

    // This is a simplified QRIS data format
    // In real implementation, you would get this from your payment processor
    return `00020101021126580011ID.CO.QRIS.WWW0118${merchantId}02135${orderId}5204000053033605802ID5925PT Munggahwae Indonesia6007Jakarta61051234062190515${amount}6304`;
  }, [total, stableOrderData]);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // In a real implementation, you would first create a booking
      // and then use the booking ID for payment
      // For now, we'll simulate the payment process
      
      if (selectedMethod === 'bank_transfer' || selectedMethod === 'qris') {
        setShowPaymentDetails(true);
        // Reset timer when showing payment details
        if (selectedMethod === 'qris') {
          setTimeLeft(15 * 60); // Reset to 15 minutes
        }
      } else {
        // For other methods, simulate immediate success
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran');
    } finally {
      setIsProcessing(false);
    }
  };

  // Timer effect for QRIS countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (showPaymentDetails && selectedMethod === 'qris' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer expired
            setShowPaymentDetails(false);
            alert('QR Code telah kedaluwarsa. Silakan ulangi pembayaran.');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showPaymentDetails, selectedMethod, timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Berhasil disalin!');
  };

  // QRIS Payment Details Page
  if (showPaymentDetails && selectedMethod === 'qris') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center">Pembayaran QRIS</h1>
              <p className="text-center text-gray-600">
                Scan QR Code dengan aplikasi e-wallet atau mobile banking Anda
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code Display */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <QRCodeDisplay value={qrisData} size={250} />
                <div className="text-center mt-4">
                  <p className="text-lg font-bold text-green-600">
                    Rp {total.toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500">Jumlah yang harus dibayar</p>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">Cara Pembayaran QRIS:</h3>
                <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                  <li>Buka aplikasi e-wallet atau mobile banking Anda</li>
                  <li>Pilih menu "Scan QR" atau "Bayar dengan QR"</li>
                  <li>Arahkan kamera ke QR code di atas</li>
                  <li>Pastikan nominal pembayaran sesuai</li>
                  <li>Konfirmasi pembayaran</li>
                  <li>Simpan bukti pembayaran</li>
                </ol>
              </div>

              {/* Supported Payment Apps */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Aplikasi yang Didukung:</h3>
                <div className="grid grid-cols-4 gap-4">
                  {E_WALLETS.map((wallet) => (
                    <div key={wallet.code} className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-1 border">
                        <Image
                          src={wallet.logo}
                          alt={wallet.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs text-gray-600 text-center">{wallet.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Dan aplikasi mobile banking lainnya yang mendukung QRIS
                </p>
              </div>

              {/* Order Details */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Detail Pesanan:</h3>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-mono">#{stableOrderData.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal:</span>
                    <span>{stableOrderData.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Batas Waktu:</span>
                    <span>15 menit</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDetails(false)}
                  className="flex-1 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <Button
                  onClick={onPaymentSuccess}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Saya Sudah Bayar
                </Button>
              </div>

              {/* Timer (optional - you can add countdown functionality) */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  QR Code akan kedaluwarsa dalam{' '}
                  <span
                    className={`font-semibold ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </p>
                {timeLeft <= 60 && (
                  <p className="text-xs text-red-500 mt-1">Segera selesaikan pembayaran Anda!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Bank Transfer Payment Details Page (existing code)
  if (showPaymentDetails && selectedMethod === 'bank_transfer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center">Menunggu Pembayaran</h1>
              <p className="text-center text-gray-600">Silakan transfer ke rekening berikut</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">
                    Bank {BANKS.find((b) => b.code === selectedBank)?.name || 'BCA'}
                  </span>
                  <Image
                    src={BANKS.find((b) => b.code === selectedBank)?.logo || '/banks/bca.png'}
                    alt={BANKS.find((b) => b.code === selectedBank)?.name || 'BCA'}
                    width={60}
                    height={30}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Nomor Rekening:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">1234567890</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('1234567890')}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Atas Nama:</span>
                    <span className="font-semibold">PT Munggahwae Indonesia</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Jumlah Transfer:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-green-600">
                        Rp {total.toLocaleString('id-ID')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(total.toString())}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Petunjuk Pembayaran:</h3>
                <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Transfer sesuai jumlah yang tertera</li>
                  <li>Simpan bukti transfer</li>
                  <li>Pembayaran akan dikonfirmasi dalam 1x24 jam</li>
                  <li>Anda akan menerima email konfirmasi setelah pembayaran terverifikasi</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onPaymentCancel}
                  className="flex-1 bg-transparent"
                >
                  Kembali
                </Button>
                <Button
                  onClick={onPaymentSuccess}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Saya Sudah Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onPaymentCancel}
            className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold">Pembayaran</h1>
          <p className="text-gray-600">Pilih metode pembayaran yang Anda inginkan</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {method.fee > 0 && (
                            <p className="text-sm whitespace-nowrap">
                              +Rp {method.fee.toLocaleString('id-ID')}
                            </p>
                          )}
                          <div
                            className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                              selectedMethod === method.id
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedMethod === method.id && (
                              <CheckCircle className="w-3 h-3 text-white fill-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Bank Selection */}
            {selectedMethod === 'bank_transfer' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Pilih Bank</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {BANKS.map((bank) => (
                      <div
                        key={bank.code}
                        className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center ${
                          selectedBank === bank.code
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedBank(bank.code)}
                      >
                        <Image
                          src={bank.logo}
                          alt={bank.name}
                          width={80}
                          height={40}
                          className="mb-3 object-contain h-10"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedBank === bank.code
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedBank === bank.code && (
                            <CheckCircle className="w-3 h-3 text-white fill-white" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* E-Wallet Selection */}
            {selectedMethod === 'e_wallet' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Pilih E-Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {E_WALLETS.map((wallet) => (
                      <div
                        key={wallet.code}
                        className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center ${
                          selectedEWallet === wallet.code
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedEWallet(wallet.code)}
                      >
                        <Image
                          src={wallet.logo}
                          alt={wallet.name}
                          width={80}
                          height={40}
                          className="mb-3 object-contain h-10"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedEWallet === wallet.code
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedEWallet === wallet.code && (
                            <CheckCircle className="w-3 h-3 text-white fill-white" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Credit Card Form */}
            {selectedMethod === 'credit_card' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Informasi Kartu Kredit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Nomori Kartu</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Berlaku Hingga</Label>
                      <Input id="expiry" placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" maxLength={3} type="password" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nama di Kartu</Label>
                    <Input id="cardName" placeholder="JOHN DOE" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tanggal Pendakian:</span>
                    <span className="font-medium">
                      {new Date(bookingData.entryDate).toLocaleDateString('id-ID')} -{' '}
                      {new Date(bookingData.exitDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Durasi:</span>
                    <span className="font-medium">{days} hari</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jumlah Pendaki:</span>
                    <span className="font-medium">{bookingData.numberOfBookers} orang</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Admin:</span>
                    <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                  </div>
                  {paymentFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Biaya Pembayaran:</span>
                      <span>Rp {paymentFee.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-3">
                    <span>Total:</span>
                    <span className="text-green-600">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-green-700">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-medium">Pembayaran Aman</span>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Transaksi Anda dilindungi dengan enkripsi SSL
                  </p>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={
                    isProcessing ||
                    (selectedMethod === 'bank_transfer' && !selectedBank) ||
                    (selectedMethod === 'e_wallet' && !selectedEWallet)
                  }
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg"
                >
                  {isProcessing ? 'Memproses...' : `Bayar Rp ${total.toLocaleString('id-ID')}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
