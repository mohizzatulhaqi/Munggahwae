# Payment API Documentation

## Overview

The Payment API provides endpoints for handling payment processing in the Munggahwae booking system. It supports multiple payment methods including bank transfer, e-wallet, credit card, and QRIS.

## Base URL

```
/api/payment
```

## Endpoints

### 1. Create Payment

**POST** `/api/payment`

Creates a new payment for a booking.

#### Request Body

```typescript
{
  bookingId: string;
  paymentMethod: 'bank_transfer' | 'e_wallet' | 'credit_card' | 'qris';
  selectedBank?: string;        // Required for bank_transfer
  selectedEWallet?: string;     // Required for e_wallet
  amount: number;
  currency?: string;            // Default: 'IDR'
  description?: string;
}
```

#### Response

```typescript
{
  success: boolean;
  paymentId?: string;
  paymentUrl?: string;
  qrCodeData?: string;          // For QRIS payments
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  expiresAt?: string;           // For QRIS payments
  error?: string;
  validationErrors?: string[];
}
```

#### Example

```javascript
const response = await fetch('/api/payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    bookingId: 'booking_123',
    paymentMethod: 'bank_transfer',
    selectedBank: 'bca',
    amount: 500000
  })
});
```

### 2. Confirm Payment

**PUT** `/api/payment`

Confirms a payment after it has been processed.

#### Request Body

```typescript
{
  paymentId: string;
  bookingId: string;
  transactionId?: string;
  paymentProof?: string;
}
```

#### Response

```typescript
{
  success: boolean;
  message?: string;
  booking?: any;
  error?: string;
}
```

#### Example

```javascript
const response = await fetch('/api/payment', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    paymentId: 'PAY-123456789',
    bookingId: 'booking_123',
    transactionId: 'TXN-987654321'
  })
});
```

### 3. Get Payment Status

**GET** `/api/payment?bookingId={bookingId}`

Gets the payment status for a specific booking.

#### Response

```typescript
{
  success: boolean;
  paymentStatus?: 'pending' | 'processing' | 'completed' | 'failed' | 'expired' | 'cancelled';
  booking?: any;
  error?: string;
}
```

#### Example

```javascript
const response = await fetch('/api/payment?bookingId=booking_123');
```

### 4. Get Payment Methods

**GET** `/api/payment`

Gets available payment methods and their configuration.

#### Response

```typescript
{
  success: boolean;
  paymentMethods?: {
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
  };
  error?: string;
}
```

## Payment Methods

### Bank Transfer
- **Fee**: Rp 0
- **Processing Time**: 1-24 hours
- **Supported Banks**: BCA, Mandiri, BNI, BRI
- **Required Fields**: `selectedBank`

### E-Wallet
- **Fee**: Rp 2,500
- **Processing Time**: Instant
- **Supported Wallets**: GoPay, OVO, DANA, ShopeePay
- **Required Fields**: `selectedEWallet`

### Credit Card
- **Fee**: Rp 5,000
- **Processing Time**: Instant
- **Supported Cards**: Visa, Mastercard, JCB

### QRIS
- **Fee**: Rp 0
- **Processing Time**: Instant
- **Expiry Time**: 15 minutes
- **Features**: QR code generation, countdown timer

## Error Handling

All endpoints return consistent error responses:

```typescript
{
  success: false,
  error: string;
  validationErrors?: string[];
}
```

Common error codes:
- `400` - Bad Request (validation errors)
- `404` - Booking not found
- `500` - Internal server error

## Frontend Integration

Use the `paymentApi` service for easy integration:

```typescript
import { paymentApi } from '@/lib/api/paymentApi';

// Create payment
const payment = await paymentApi.createPayment({
  bookingId: 'booking_123',
  paymentMethod: 'bank_transfer',
  selectedBank: 'bca',
  amount: 500000
});

// Confirm payment
const confirmation = await paymentApi.confirmPayment({
  paymentId: 'PAY-123456789',
  bookingId: 'booking_123'
});

// Get payment status
const status = await paymentApi.getPaymentStatus('booking_123');

// Get payment methods
const methods = await paymentApi.getPaymentMethods();
```

## Security Considerations

1. **Input Validation**: All inputs are validated on both client and server side
2. **Payment Status**: Only confirmed payments can update booking status
3. **Expiry Handling**: QRIS payments have automatic expiry handling
4. **Error Logging**: All payment errors are logged for monitoring

## Future Enhancements

1. **Payment Gateway Integration**: Real payment gateway integration
2. **Webhook Support**: Payment status webhooks
3. **Refund Processing**: Automated refund handling
4. **Payment Analytics**: Payment success/failure analytics
5. **Multi-currency Support**: Support for multiple currencies 