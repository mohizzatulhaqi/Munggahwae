# 🏔️ Munggahwae - Mountain Booking Application

Aplikasi booking gunung yang mengimplementasikan **Clean Architecture** dengan **Domain Modeling** untuk proses bisnis yang kompleks.

## 🏗️ Clean Architecture Implementation

### 📁 Project Structure

```
src/
├── domain/                    # 🎯 Domain Layer
│   ├── entities/             # Business entities with rich domain logic
│   │   ├── User.ts          # User domain entity
│   │   ├── Gunung.ts        # Mountain domain entity
│   │   ├── Booking.ts       # Booking domain entity
│   │   └── Jalur.ts         # Trail domain entity
│   ├── repositories/         # Repository interfaces
│   │   ├── IUserRepository.ts
│   │   ├── IGunungRepository.ts
│   │   └── IBookingRepository.ts
│   └── services/            # Domain services with complex business logic
│       └── BookingService.ts
├── application/              # 📋 Application Layer
│   └── use-cases/           # Use cases for application logic
│       └── CreateBookingUseCase.ts
├── infrastructure/           # 🔧 Infrastructure Layer
│   └── repositories/        # Repository implementations
│       ├── PrismaUserRepository.ts
│       ├── PrismaGunungRepository.ts
│       └── PrismaBookingRepository.ts
└── presentation/            # 🎨 Presentation Layer
    └── controllers/         # API controllers
        └── BookingController.ts
```

## 🎯 Domain Layer - Rich Domain Models

### Business Entities with Complex Logic

#### 1. **User Entity** (`src/domain/entities/User.ts`)
```typescript
export class User {
  // Business Rules & Validations
  private validateEmail(email: string): void
  private validateNamaLengkap(namaLengkap: string): void
  
  // Business Methods
  public updateProfile(namaLengkap?: string, phoneNumber?: string, avatarUrl?: string): void
  public canMakeBooking(): boolean
}
```

#### 2. **Gunung Entity** (`src/domain/entities/Gunung.ts`)
```typescript
export class Gunung {
  // Business Rules & Validations
  private validateNama(nama: string): void
  private validateKuota(kuota: number): void
  private validateHarga(harga: number, hargaPerOrang: number): void
  
  // Business Methods
  public updateGunungInfo(nama?: string, deskripsi?: string, ...): void
  public updatePricing(harga: number, hargaPerOrang: number): void
  public canAcceptBookings(): boolean
  public calculateTotalPrice(jumlahPemesan: number): number
}
```

#### 3. **Booking Entity** (`src/domain/entities/Booking.ts`)
```typescript
export class Booking {
  // Business Rules & Validations
  private validateDates(tanggalMasuk: Date, tanggalKeluar: Date): void
  private validateJumlahPemesan(jumlahPemesan: number): void
  
  // Business Methods
  public addAnggotaPemesan(anggota: AnggotaPemesanProps): void
  public confirmBooking(): void
  public cancelBooking(): void
  public canBeConfirmed(): boolean
  public getDurationInDays(): number
  public getAdultsCount(): number
  public getMinorsCount(): number
}
```

### Domain Services with Complex Business Logic

#### **BookingService** (`src/domain/services/BookingService.ts`)
```typescript
export class BookingService {
  // Complex Business Logic Methods
  async createBooking(request: CreateBookingRequest): Promise<Booking>
  async checkQuotaAvailability(mountainId: string, tanggalMasuk: Date, ...): Promise<QuotaCheckResult>
  validateBooking(booking: Booking): BookingValidationResult
  async getBookingStatistics(): Promise<{...}>
}
```

## 📋 Application Layer - Use Cases

### **CreateBookingUseCase** (`src/application/use-cases/CreateBookingUseCase.ts`)
```typescript
export class CreateBookingUseCase {
  async execute(input: CreateBookingInput): Promise<CreateBookingOutput>
  private validateInput(input: CreateBookingInput): { isValid: boolean; errors: string[]; warnings: string[] }
}
```

## 🔧 Infrastructure Layer - Repository Implementations

### Prisma Repository Implementations
- **PrismaUserRepository**: Implements `IUserRepository`
- **PrismaGunungRepository**: Implements `IGunungRepository`
- **PrismaBookingRepository**: Implements `IBookingRepository`

## 🎨 Presentation Layer - API Controllers

### **BookingController** (`src/presentation/controllers/BookingController.ts`)
```typescript
export class BookingController {
  async createBooking(request: NextRequest): Promise<NextResponse>
  async getBookings(request: NextRequest): Promise<NextResponse>
  async getBookingById(request: NextRequest, { params }): Promise<NextResponse>
  async confirmBooking(request: NextRequest, { params }): Promise<NextResponse>
  async cancelBooking(request: NextRequest, { params }): Promise<NextResponse>
  async getBookingStatistics(request: NextRequest): Promise<NextResponse>
}
```

## 🚀 Complex Business Processes Implemented

### 1. **Booking Creation Process**
- ✅ User validation (can make booking)
- ✅ Mountain validation (active and available)
- ✅ Quota availability check with date range
- ✅ Price calculation based on mountain pricing
- ✅ Multiple bookers validation
- ✅ Age validation (minors detection)
- ✅ Duration validation (max 3 days)

### 2. **Quota Management**
- ✅ Daily quota tracking
- ✅ Date range availability calculation
- ✅ Conflict detection with existing bookings
- ✅ Real-time quota updates

### 3. **Booking State Management**
- ✅ Status transitions (pending → confirmed → cancelled)
- ✅ Payment status tracking
- ✅ Business rule enforcement (can't cancel confirmed bookings)

### 4. **Domain Modeling Techniques Used**
- ✅ **Rich Domain Models**: Entities with business logic and validation
- ✅ **Value Objects**: Complex validation rules embedded in entities
- ✅ **Domain Services**: Complex business processes that span multiple entities
- ✅ **Repository Pattern**: Clean data access abstraction
- ✅ **Use Cases**: Application-specific business logic
- ✅ **Dependency Inversion**: Interfaces define contracts, implementations are injected

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Architecture**: Clean Architecture with Domain-Driven Design
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## 🏃‍♂️ Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:
- **Users**: User management with validation
- **Gunung**: Mountain information with pricing and quota
- **Jalur**: Trail information with difficulty levels
- **Bookings**: Booking management with complex business rules
- **AnggotaPemesan**: Booking members with validation
- **Peraturan**: Mountain-specific terms and conditions
- **GaleriGunung**: Mountain gallery management
- **KuotaHarian**: Daily quota tracking
- **Notifikasi**: User notification system

## 🎯 Clean Architecture Benefits

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Testability**: Business logic can be tested independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features or change implementations
5. **Domain Modeling**: Complex business rules are properly encapsulated

## 🔄 API Endpoints

### Booking Management
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings (with filters)
- `GET /api/bookings/[id]` - Get specific booking
- `PATCH /api/bookings/[id]` - Update booking status

### Example Usage
```typescript
// Create booking
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_id',
    mountainId: 'mountain_id',
    trailId: 'trail_id',
    tanggalMasuk: '2024-01-15',
    tanggalKeluar: '2024-01-17',
    jumlahPemesan: 2,
    anggotaPemesan: [
      {
        email: 'user@example.com',
        nama: 'John Doe',
        noIdentitas: '1234567890123456',
        jenisKelamin: 'Laki-laki',
        tanggalLahir: '1990-01-01'
      }
    ]
  })
});
```

## 📝 License

This project is developed for educational purposes demonstrating Clean Architecture implementation with Domain Modeling.