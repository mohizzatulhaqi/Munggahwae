import { PrismaClient } from '@prisma/client';
import { Booking, BookingProps, AnggotaPemesanProps } from '../../domain/entities/Booking';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';

export class PrismaBookingRepository implements IBookingRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Booking | null> {
    const bookingData = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        anggotaPemesanan: true,
      }
    });

    if (!bookingData) return null;

    return new Booking({
      id: bookingData.id,
      userId: bookingData.userId || undefined,
      mountainId: bookingData.mountainId || undefined,
      trailId: bookingData.trailId || undefined,
      tanggalMasuk: bookingData.tanggalMasuk,
      tanggalKeluar: bookingData.tanggalKeluar,
      jumlahPemesan: bookingData.jumlahPemesan,
      totalHarga: bookingData.totalHarga,
      status: bookingData.status,
      paymentStatus: bookingData.paymentStatus,
      specialRequests: bookingData.specialRequests || undefined,
      anggotaPemesan: bookingData.anggotaPemesanan.map(ap => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin || undefined,
        tempatLahir: ap.tempatLahir || undefined,
        tanggalLahir: ap.tanggalLahir || undefined,
        fileKtp: ap.fileKtp || undefined,
        isCompanion: ap.isCompanion,
      })),
      createdAt: bookingData.createdAt,
      updatedAt: bookingData.updatedAt,
    });
  }

  async save(booking: Booking): Promise<Booking> {
    const bookingData = await this.prisma.booking.create({
      data: {
        id: booking.id,
        userId: booking.userId,
        mountainId: booking.mountainId,
        trailId: booking.trailId,
        tanggalMasuk: booking.tanggalMasuk,
        tanggalKeluar: booking.tanggalKeluar,
        jumlahPemesan: booking.jumlahPemesan,
        totalHarga: booking.totalHarga,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        specialRequests: booking.specialRequests,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        anggotaPemesanan: {
          create: booking.anggotaPemesan.map(ap => ({
            id: ap.id,
            email: ap.email,
            nama: ap.nama,
            noIdentitas: ap.noIdentitas,
            kewarganegaraan: ap.kewarganegaraan,
            jenisKelamin: ap.jenisKelamin,
            tempatLahir: ap.tempatLahir,
            tanggalLahir: ap.tanggalLahir,
            fileKtp: ap.fileKtp,
            isCompanion: ap.isCompanion,
            createdAt: new Date(),
          }))
        }
      },
      include: {
        anggotaPemesanan: true,
      }
    });

    return new Booking({
      id: bookingData.id,
      userId: bookingData.userId || undefined,
      mountainId: bookingData.mountainId || undefined,
      trailId: bookingData.trailId || undefined,
      tanggalMasuk: bookingData.tanggalMasuk,
      tanggalKeluar: bookingData.tanggalKeluar,
      jumlahPemesan: bookingData.jumlahPemesan,
      totalHarga: bookingData.totalHarga,
      status: bookingData.status,
      paymentStatus: bookingData.paymentStatus,
      specialRequests: bookingData.specialRequests || undefined,
      anggotaPemesan: bookingData.anggotaPemesanan.map(ap => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin || undefined,
        tempatLahir: ap.tempatLahir || undefined,
        tanggalLahir: ap.tanggalLahir || undefined,
        fileKtp: ap.fileKtp || undefined,
        isCompanion: ap.isCompanion,
      })),
      createdAt: bookingData.createdAt,
      updatedAt: bookingData.updatedAt,
    });
  }

  async update(booking: Booking): Promise<Booking> {
    const bookingData = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        userId: booking.userId,
        mountainId: booking.mountainId,
        trailId: booking.trailId,
        tanggalMasuk: booking.tanggalMasuk,
        tanggalKeluar: booking.tanggalKeluar,
        jumlahPemesan: booking.jumlahPemesan,
        totalHarga: booking.totalHarga,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        specialRequests: booking.specialRequests,
        updatedAt: booking.updatedAt,
      },
      include: {
        anggotaPemesanan: true,
      }
    });

    return new Booking({
      id: bookingData.id,
      userId: bookingData.userId || undefined,
      mountainId: bookingData.mountainId || undefined,
      trailId: bookingData.trailId || undefined,
      tanggalMasuk: bookingData.tanggalMasuk,
      tanggalKeluar: bookingData.tanggalKeluar,
      jumlahPemesan: bookingData.jumlahPemesan,
      totalHarga: bookingData.totalHarga,
      status: bookingData.status,
      paymentStatus: bookingData.paymentStatus,
      specialRequests: bookingData.specialRequests || undefined,
      anggotaPemesan: bookingData.anggotaPemesanan.map(ap => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin || undefined,
        tempatLahir: ap.tempatLahir || undefined,
        tanggalLahir: ap.tanggalLahir || undefined,
        fileKtp: ap.fileKtp || undefined,
        isCompanion: ap.isCompanion,
      })),
      createdAt: bookingData.createdAt,
      updatedAt: bookingData.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.booking.delete({
      where: { id }
    });
  }

  async findAll(): Promise<Booking[]> {
    const bookingsData = await this.prisma.booking.findMany({
      include: {
        anggotaPemesanan: true,
      }
    });

    return bookingsData.map(data => new Booking({
      id: data.id,
      userId: data.userId || undefined,
      mountainId: data.mountainId || undefined,
      trailId: data.trailId || undefined,
      tanggalMasuk: data.tanggalMasuk,
      tanggalKeluar: data.tanggalKeluar,
      jumlahPemesan: data.jumlahPemesan,
      totalHarga: data.totalHarga,
      status: data.status,
      paymentStatus: data.paymentStatus,
      specialRequests: data.specialRequests || undefined,
      anggotaPemesan: data.anggotaPemesanan.map(ap => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin || undefined,
        tempatLahir: ap.tempatLahir || undefined,
        tanggalLahir: ap.tanggalLahir || undefined,
        fileKtp: ap.fileKtp || undefined,
        isCompanion: ap.isCompanion,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const bookingsData = await this.prisma.booking.findMany({
      where: { userId },
      include: {
        anggotaPemesanan: true,
      }
    });

    return bookingsData.map(data => new Booking({
      id: data.id,
      userId: data.userId || undefined,
      mountainId: data.mountainId || undefined,
      trailId: data.trailId || undefined,
      tanggalMasuk: data.tanggalMasuk,
      tanggalKeluar: data.tanggalKeluar,
      jumlahPemesan: data.jumlahPemesan,
      totalHarga: data.totalHarga,
      status: data.status,
      paymentStatus: data.paymentStatus,
      specialRequests: data.specialRequests || undefined,
      anggotaPemesan: data.anggotaPemesanan.map(ap => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin || undefined,
        tempatLahir: ap.tempatLahir || undefined,
        tanggalLahir: ap.tanggalLahir || undefined,
        fileKtp: ap.fileKtp || undefined,
        isCompanion: ap.isCompanion,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
  }

  async findByMountainId(mountainId: string): Promise<Booking[]> {
    const bookingsData = await this.prisma.booking.findMany({
      where: { mountainId },
      include: {
        anggotaPemesanan: true,
      }
    });

    return bookingsData.map(data => new Booking({
      id: data.id,
      userId: data.userId || undefined,
      mountainId: data.mountainId || undefined,
      trailId: data.trailId || undefined,
      tanggalMasuk: data.tanggalMasuk,
      tanggalKeluar: data.tanggalKeluar,
      jumlahPemesan: data.jumlahPemesan,
      totalHarga: data.totalHarga,
      status: data.status,
      paymentStatus: data.paymentStatus,
      specialRequests: data.specialRequests || undefined,
      anggotaPemesan: data.anggotaPemesanan.map(ap => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin || undefined,
        tempatLahir: ap.tempatLahir || undefined,
        tanggalLahir: ap.tanggalLahir || undefined,
        fileKtp: ap.fileKtp || undefined,
        isCompanion: ap.isCompanion,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
  }

  async findByStatus(status: string): Promise<Booking[]> {
    const bookingsData = await this.prisma.booking.findMany({
      where: { status },
      include: {
        anggotaPemesanan: true,
      }
    });

    return bookingsData.map(data => new Booking({
      id: data.id,
      userId: data.userId || undefined,
      mountainId: data.mountainId || undefined,
      trailId: data.trailId || undefined,
      tanggalMasuk: data.tanggalMasuk,
      tanggalKeluar: data.tanggalKeluar,
      jumlahPemesan: data.jumlahPemesan,
      totalHarga: data.totalHarga,
      status: data.status,
      paymentStatus: data.paymentStatus,
      specialRequests: data.specialRequests || undefined,
      anggotaPemesan: data.anggotaPemesanan.map(ap => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin || undefined,
        tempatLahir: ap.tempatLahir || undefined,
        tanggalLahir: ap.tanggalLahir || undefined,
        fileKtp: ap.fileKtp || undefined,
        isCompanion: ap.isCompanion,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
  }

  async findByPaymentStatus(paymentStatus: string): Promise<Booking[]> {
    const bookingsData = await this.prisma.booking.findMany({
      where: { paymentStatus },
      include: {
        anggotaPemesanan: true,
      }
    });

    return bookingsData.map(data => new Booking({
      id: data.id,
      userId: data.userId || undefined,
      mountainId: data.mountainId || undefined,
      trailId: data.trailId || undefined,
      tanggalMasuk: data.tanggalMasuk,
      tanggalKeluar: data.tanggalKeluar,
      jumlahPemesan: data.jumlahPemesan,
      totalHarga: data.totalHarga,
      status: data.status,
      paymentStatus: data.paymentStatus,
      specialRequests: data.specialRequests || undefined,
      anggotaPemesan: data.anggotaPemesanan.map(ap => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin || undefined,
        tempatLahir: ap.tempatLahir || undefined,
        tanggalLahir: ap.tanggalLahir || undefined,
        fileKtp: ap.fileKtp || undefined,
        isCompanion: ap.isCompanion,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    const bookingsData = await this.prisma.booking.findMany({
      where: {
        OR: [
          {
            tanggalMasuk: {
              gte: startDate,
              lte: endDate,
            }
          },
          {
            tanggalKeluar: {
              gte: startDate,
              lte: endDate,
            }
          },
          {
            AND: [
              { tanggalMasuk: { lte: startDate } },
              { tanggalKeluar: { gte: endDate } }
            ]
          }
        ]
      },
      include: {
        anggotaPemesanan: true,
      }
    });

    return bookingsData.map(data => new Booking({
      id: data.id,
      userId: data.userId || undefined,
      mountainId: data.mountainId || undefined,
      trailId: data.trailId || undefined,
      tanggalMasuk: data.tanggalMasuk,
      tanggalKeluar: data.tanggalKeluar,
      jumlahPemesan: data.jumlahPemesan,
      totalHarga: data.totalHarga,
      status: data.status,
      paymentStatus: data.paymentStatus,
      specialRequests: data.specialRequests || undefined,
      anggotaPemesan: data.anggotaPemesanan.map(ap => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin || undefined,
        tempatLahir: ap.tempatLahir || undefined,
        tanggalLahir: ap.tanggalLahir || undefined,
        fileKtp: ap.fileKtp || undefined,
        isCompanion: ap.isCompanion,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
  }

  async findPendingBookings(): Promise<Booking[]> {
    return this.findByStatus('pending');
  }

  async findConfirmedBookings(): Promise<Booking[]> {
    return this.findByStatus('confirmed');
  }

  async findUnpaidBookings(): Promise<Booking[]> {
    return this.findByPaymentStatus('unpaid');
  }
} 