import { NextRequest, NextResponse } from 'next/server';
import { SupabaseBookingRepository } from '../../../infrastructure/repositories/SupabaseBookingRepository';
import { SupabaseGunungRepository } from '../../../infrastructure/repositories/SupabaseGunungRepository';
import { SupabaseUserRepository } from '../../../infrastructure/repositories/SupabaseUserRepository';

// Payment method types
export type PaymentMethod = 'bank_transfer' | 'e_wallet' | 'credit_card' | 'qris';

// Payment status types
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired' | 'cancelled';

// Payment request interface
export interface PaymentRequest {
  bookingId: string;
  paymentMethod: PaymentMethod;
  selectedBank?: string;
  selectedEWallet?: string;
  amount: number;
  currency?: string;
  description?: string;
}

// Payment response interface
export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  paymentUrl?: string;
  qrCodeData?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  expiresAt?: string;
  error?: string;
  validationErrors?: string[];
}

// Payment confirmation interface
export interface PaymentConfirmationRequest {
  paymentId: string;
  bookingId: string;
  transactionId?: string;
  paymentProof?: string;
}

// Payment methods configuration
const PAYMENT_METHODS = {
  bank_transfer: {
    name: 'Transfer Bank',
    fee: 0,
    processingTime: '1-24 jam',
    banks: [
      { code: 'bca', name: 'BCA', accountNumber: '1234567890', accountName: 'PT Munggahwae Indonesia' },
      { code: 'mandiri', name: 'Mandiri', accountNumber: '0987654321', accountName: 'PT Munggahwae Indonesia' },
      { code: 'bni', name: 'BNI', accountNumber: '1122334455', accountName: 'PT Munggahwae Indonesia' },
      { code: 'bri', name: 'BRI', accountNumber: '5544332211', accountName: 'PT Munggahwae Indonesia' },
    ]
  },
  e_wallet: {
    name: 'E-Wallet',
    fee: 2500,
    processingTime: 'Instan',
    wallets: [
      { code: 'gopay', name: 'GoPay' },
      { code: 'ovo', name: 'OVO' },
      { code: 'dana', name: 'DANA' },
      { code: 'shopeepay', name: 'ShopeePay' },
    ]
  },
  credit_card: {
    name: 'Kartu Kredit',
    fee: 5000,
    processingTime: 'Instan',
    cards: ['Visa', 'Mastercard', 'JCB']
  },
  qris: {
    name: 'QRIS',
    fee: 0,
    processingTime: 'Instan',
    expiryMinutes: 15
  }
};

// POST /api/payment - Create payment
export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();
    
    // Validate required fields
    const validationErrors = validatePaymentRequest(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        validationErrors
      }, { status: 400 });
    }

    const bookingRepository = new SupabaseBookingRepository();
    const gunungRepository = new SupabaseGunungRepository();
    const userRepository = new SupabaseUserRepository();

    // Get booking details
    const booking = await bookingRepository.findById(body.bookingId);
    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking tidak ditemukan'
      }, { status: 404 });
    }

    // Validate booking status
    if (booking.paymentStatus === 'paid') {
      return NextResponse.json({
        success: false,
        error: 'Booking sudah dibayar'
      }, { status: 400 });
    }

    // Calculate payment amount
    const paymentMethod = PAYMENT_METHODS[body.paymentMethod];
    const totalAmount = body.amount + paymentMethod.fee;

    // Generate payment ID
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Set expiry time for QRIS
    const expiresAt = body.paymentMethod === 'qris' 
      ? new Date(Date.now() + PAYMENT_METHODS.qris.expiryMinutes * 60 * 1000).toISOString()
      : undefined;

    // Generate QRIS data for QRIS payments
    let qrCodeData: string | undefined;
    if (body.paymentMethod === 'qris') {
      const merchantId = 'ID1234567890123456';
      qrCodeData = `00020101021126580011ID.CO.QRIS.WWW0118${merchantId}02135${paymentId}5204000053033605802ID5925PT Munggahwae Indonesia6007Jakarta61051234062190515${totalAmount}6304`;
    }

    // Get bank details for bank transfer
    let bankDetails: any = undefined;
    if (body.paymentMethod === 'bank_transfer' && body.selectedBank) {
      const selectedBank = PAYMENT_METHODS.bank_transfer.banks.find(
        bank => bank.code === body.selectedBank
      );
      if (selectedBank) {
        bankDetails = {
          bankName: selectedBank.name,
          accountNumber: selectedBank.accountNumber,
          accountName: selectedBank.accountName
        };
      }
    }

    // For payment processing, we'll just return the payment details
    // The actual payment status update will happen when payment is confirmed
    // This is a simplified approach - in a real implementation, you'd create a payment record

    // In a real implementation, you would save payment details to a payment table
    // For now, we'll return the payment information directly

    const response: PaymentResponse = {
      success: true,
      paymentId,
      qrCodeData,
      bankDetails,
      expiresAt
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// PUT /api/payment - Confirm payment
export async function PUT(request: NextRequest) {
  try {
    const body: PaymentConfirmationRequest = await request.json();
    
    // Validate required fields
    if (!body.paymentId || !body.bookingId) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID dan Booking ID diperlukan'
      }, { status: 400 });
    }

    const bookingRepository = new SupabaseBookingRepository();

    // Get booking details
    const booking = await bookingRepository.findById(body.bookingId);
    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking tidak ditemukan'
      }, { status: 404 });
    }

    // Update booking payment status to paid using the existing method
    booking.markAsPaid();
    await bookingRepository.update(booking);

    return NextResponse.json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi',
      booking: booking.toJSON()
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// GET /api/payment - Get payment methods and configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (bookingId) {
      // Get payment status for specific booking
      const bookingRepository = new SupabaseBookingRepository();
      const booking = await bookingRepository.findById(bookingId);
      
      if (!booking) {
        return NextResponse.json({
          success: false,
          error: 'Booking tidak ditemukan'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        paymentStatus: booking.paymentStatus,
        booking: booking.toJSON()
      });
    }

    // Return payment methods configuration
    return NextResponse.json({
      success: true,
      paymentMethods: PAYMENT_METHODS
    });

  } catch (error) {
    console.error('Payment info error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Helper function to validate payment request
function validatePaymentRequest(request: PaymentRequest): string[] {
  const errors: string[] = [];

  if (!request.bookingId) {
    errors.push('Booking ID diperlukan');
  }

  if (!request.paymentMethod) {
    errors.push('Metode pembayaran diperlukan');
  }

  if (!Object.keys(PAYMENT_METHODS).includes(request.paymentMethod)) {
    errors.push('Metode pembayaran tidak valid');
  }

  if (request.amount <= 0) {
    errors.push('Jumlah pembayaran harus lebih dari 0');
  }

  if (request.paymentMethod === 'bank_transfer' && !request.selectedBank) {
    errors.push('Bank harus dipilih untuk transfer bank');
  }

  if (request.paymentMethod === 'e_wallet' && !request.selectedEWallet) {
    errors.push('E-Wallet harus dipilih');
  }

  return errors;
} 