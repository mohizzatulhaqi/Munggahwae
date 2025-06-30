import { BookingService, CreateBookingRequest } from '../../domain/services/BookingService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IGunungRepository } from '../../domain/repositories/IGunungRepository';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { Booking } from '../../domain/entities/Booking';

export interface CreateBookingInput {
  userId: string;
  mountainId: string;
  trailId: string;
  tanggalMasuk: string;
  tanggalKeluar: string;
  jumlahPemesan: number;
  anggotaPemesan: {
    email: string;
    nama: string;
    noIdentitas: string;
    kewarganegaraan?: string;
    jenisKelamin?: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    fileKtp?: string;
    isCompanion?: boolean;
  }[];
  specialRequests?: string;
}

export interface CreateBookingOutput {
  success: boolean;
  booking?: Booking;
  error?: string;
  validationErrors?: string[];
  warnings?: string[];
}

export class CreateBookingUseCase {
  private bookingService: BookingService;

  constructor(
    userRepository: IUserRepository,
    gunungRepository: IGunungRepository,
    bookingRepository: IBookingRepository
  ) {
    this.bookingService = new BookingService(bookingRepository, gunungRepository, userRepository);
  }

  async execute(input: CreateBookingInput): Promise<CreateBookingOutput> {
    try {
      // Validate input
      const validationResult = this.validateInput(input);
      if (!validationResult.isValid) {
        return {
          success: false,
          validationErrors: validationResult.errors,
          warnings: validationResult.warnings,
        };
      }

      // Transform input to domain request
      const bookingRequest: CreateBookingRequest = {
        userId: input.userId,
        mountainId: input.mountainId,
        trailId: input.trailId,
        tanggalMasuk: new Date(input.tanggalMasuk),
        tanggalKeluar: new Date(input.tanggalKeluar),
        jumlahPemesan: input.jumlahPemesan,
        anggotaPemesan: input.anggotaPemesan.map(ap => ({
          email: ap.email,
          nama: ap.nama,
          noIdentitas: ap.noIdentitas,
          kewarganegaraan: ap.kewarganegaraan,
          jenisKelamin: ap.jenisKelamin,
          tempatLahir: ap.tempatLahir,
          tanggalLahir: ap.tanggalLahir ? new Date(ap.tanggalLahir) : undefined,
          fileKtp: ap.fileKtp,
          isCompanion: ap.isCompanion,
        })),
        specialRequests: input.specialRequests,
      };

      // Execute domain service
      const booking = await this.bookingService.createBooking(bookingRequest);

      return {
        success: true,
        booking,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui',
      };
    }
  }

  private validateInput(input: CreateBookingInput): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (!input.userId) {
      errors.push('User ID harus diisi');
    }

    if (!input.mountainId) {
      errors.push('Mountain ID harus diisi');
    }

    if (!input.trailId) {
      errors.push('Trail ID harus diisi');
    }

    if (!input.tanggalMasuk) {
      errors.push('Tanggal masuk harus diisi');
    }

    if (!input.tanggalKeluar) {
      errors.push('Tanggal keluar harus diisi');
    }

    if (!input.jumlahPemesan || input.jumlahPemesan < 1) {
      errors.push('Jumlah pemesan minimal 1');
    }

    if (input.jumlahPemesan > 10) {
      errors.push('Jumlah pemesan maksimal 10');
    }

    // Validate dates
    if (input.tanggalMasuk && input.tanggalKeluar) {
      const tanggalMasuk = new Date(input.tanggalMasuk);
      const tanggalKeluar = new Date(input.tanggalKeluar);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (tanggalMasuk < today) {
        errors.push('Tanggal masuk tidak boleh kurang dari hari ini');
      }

      if (tanggalKeluar <= tanggalMasuk) {
        errors.push('Tanggal keluar harus setelah tanggal masuk');
      }

      const durationInDays = Math.ceil((tanggalKeluar.getTime() - tanggalMasuk.getTime()) / (1000 * 60 * 60 * 24));
      if (durationInDays > 3) {
        errors.push('Durasi pendakian maksimal 3 hari');
      }
    }

    // Validate anggota pemesan
    if (!input.anggotaPemesan || input.anggotaPemesan.length === 0) {
      errors.push('Anggota pemesan harus diisi');
    } else {
      if (input.anggotaPemesan.length !== input.jumlahPemesan) {
        errors.push('Jumlah anggota pemesan harus sesuai dengan jumlah pemesan');
      }

      // Check for minors
      const minorsCount = input.anggotaPemesan.filter(ap => {
        if (!ap.tanggalLahir) return false;
        const birthDate = new Date(ap.tanggalLahir);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age < 17;
      }).length;

      if (minorsCount > 0) {
        warnings.push(`${minorsCount} anggota di bawah umur terdeteksi`);
      }

      // Validate each anggota pemesan
      input.anggotaPemesan.forEach((ap, index) => {
        if (!ap.email || !ap.email.includes('@')) {
          errors.push(`Email anggota ${index + 1} tidak valid`);
        }

        if (!ap.nama || ap.nama.trim().length < 2) {
          errors.push(`Nama anggota ${index + 1} minimal 2 karakter`);
        }

        if (!ap.noIdentitas || ap.noIdentitas.length < 10) {
          errors.push(`Nomor identitas anggota ${index + 1} minimal 10 digit`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
} 