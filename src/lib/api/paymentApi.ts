import type { PaymentMethod, PaymentStatus } from '@/app/api/payment/route';

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
export interface PaymentMethodsConfig {
  bank_transfer: {
    name: string;
    fee: number;
    processingTime: string;
    banks: Array<{
      code: string;
      name: string;
      accountNumber: string;
      accountName: string;
    }>;
  };
  e_wallet: {
    name: string;
    fee: number;
    processingTime: string;
    wallets: Array<{
      code: string;
      name: string;
    }>;
  };
  credit_card: {
    name: string;
    fee: number;
    processingTime: string;
    cards: string[];
  };
  qris: {
    name: string;
    fee: number;
    processingTime: string;
    expiryMinutes: number;
  };
}

// Payment status response
export interface PaymentStatusResponse {
  success: boolean;
  paymentStatus?: PaymentStatus;
  booking?: any;
  error?: string;
}

// Payment methods response
export interface PaymentMethodsResponse {
  success: boolean;
  paymentMethods?: PaymentMethodsConfig;
  error?: string;
}

class PaymentApiService {
  private baseUrl = '/api/payment';

  // Create a new payment
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create payment',
          validationErrors: data.validationErrors,
        };
      }

      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      return {
        success: false,
        error: 'Network error occurred while creating payment',
      };
    }
  }

  // Confirm payment
  async confirmPayment(request: PaymentConfirmationRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to confirm payment',
        };
      }

      return data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: 'Network error occurred while confirming payment',
      };
    }
  }

  // Get payment status for a booking
  async getPaymentStatus(bookingId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await fetch(`${this.baseUrl}?bookingId=${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to get payment status',
        };
      }

      return data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      return {
        success: false,
        error: 'Network error occurred while getting payment status',
      };
    }
  }

  // Get payment methods configuration
  async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to get payment methods',
        };
      }

      return data;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return {
        success: false,
        error: 'Network error occurred while getting payment methods',
      };
    }
  }

  // Validate payment request
  validatePaymentRequest(request: PaymentRequest): string[] {
    const errors: string[] = [];

    if (!request.bookingId) {
      errors.push('Booking ID diperlukan');
    }

    if (!request.paymentMethod) {
      errors.push('Metode pembayaran diperlukan');
    }

    const validMethods: PaymentMethod[] = ['bank_transfer', 'e_wallet', 'credit_card', 'qris'];
    if (!validMethods.includes(request.paymentMethod)) {
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

  // Calculate payment fees
  calculatePaymentFees(amount: number, paymentMethod: PaymentMethod): number {
    const fees = {
      bank_transfer: 0,
      e_wallet: 2500,
      credit_card: 5000,
      qris: 0,
    };

    return fees[paymentMethod] || 0;
  }

  // Calculate total amount with fees
  calculateTotalAmount(amount: number, paymentMethod: PaymentMethod): number {
    const fee = this.calculatePaymentFees(amount, paymentMethod);
    return amount + fee;
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // Generate QRIS data (for frontend use)
  generateQRISData(paymentId: string, amount: number): string {
    const merchantId = 'ID1234567890123456';
    return `00020101021126580011ID.CO.QRIS.WWW0118${merchantId}02135${paymentId}5204000053033605802ID5925PT Munggahwae Indonesia6007Jakarta61051234062190515${amount}6304`;
  }

  // Copy text to clipboard
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  // Format time display for countdown
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

// Export singleton instance
export const paymentApi = new PaymentApiService(); 