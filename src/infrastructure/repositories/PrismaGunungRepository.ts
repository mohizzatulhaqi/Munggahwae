import { PrismaClient } from '@prisma/client';
import { Gunung, GunungProps } from '../../domain/entities/Gunung';
import { IGunungRepository } from '../../domain/repositories/IGunungRepository';

export class PrismaGunungRepository implements IGunungRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Gunung | null> {
    const gunungData = await this.prisma.gunung.findUnique({
      where: { id }
    });

    if (!gunungData) return null;

    return new Gunung({
      id: gunungData.id,
      nama: gunungData.nama,
      kuota: gunungData.kuota,
      deskripsi: gunungData.deskripsi,
      urlGambar: gunungData.urlGambar,
      harga: gunungData.harga,
      lokasi: gunungData.lokasi,
      provinsi: gunungData.provinsi,
      kuotaPerHari: gunungData.kuotaPerHari,
      hargaPerOrang: Number(gunungData.hargaPerOrang),
      status: gunungData.status,
      createdAt: gunungData.createdAt,
      updatedAt: gunungData.updatedAt,
    });
  }

  async save(gunung: Gunung): Promise<Gunung> {
    const gunungData = await this.prisma.gunung.create({
      data: {
        id: gunung.id,
        nama: gunung.nama,
        kuota: gunung.kuota,
        deskripsi: gunung.deskripsi,
        urlGambar: gunung.urlGambar,
        harga: gunung.harga,
        lokasi: gunung.lokasi,
        provinsi: gunung.provinsi,
        kuotaPerHari: gunung.kuotaPerHari,
        hargaPerOrang: BigInt(gunung.hargaPerOrang),
        status: gunung.status,
        createdAt: gunung.createdAt,
        updatedAt: gunung.updatedAt,
      }
    });

    return new Gunung({
      id: gunungData.id,
      nama: gunungData.nama,
      kuota: gunungData.kuota,
      deskripsi: gunungData.deskripsi,
      urlGambar: gunungData.urlGambar,
      harga: gunungData.harga,
      lokasi: gunungData.lokasi,
      provinsi: gunungData.provinsi,
      kuotaPerHari: gunungData.kuotaPerHari,
      hargaPerOrang: Number(gunungData.hargaPerOrang),
      status: gunungData.status,
      createdAt: gunungData.createdAt,
      updatedAt: gunungData.updatedAt,
    });
  }

  async update(gunung: Gunung): Promise<Gunung> {
    const gunungData = await this.prisma.gunung.update({
      where: { id: gunung.id },
      data: {
        nama: gunung.nama,
        kuota: gunung.kuota,
        deskripsi: gunung.deskripsi,
        urlGambar: gunung.urlGambar,
        harga: gunung.harga,
        lokasi: gunung.lokasi,
        provinsi: gunung.provinsi,
        kuotaPerHari: gunung.kuotaPerHari,
        hargaPerOrang: BigInt(gunung.hargaPerOrang),
        status: gunung.status,
        updatedAt: gunung.updatedAt,
      }
    });

    return new Gunung({
      id: gunungData.id,
      nama: gunungData.nama,
      kuota: gunungData.kuota,
      deskripsi: gunungData.deskripsi,
      urlGambar: gunungData.urlGambar,
      harga: gunungData.harga,
      lokasi: gunungData.lokasi,
      provinsi: gunungData.provinsi,
      kuotaPerHari: gunungData.kuotaPerHari,
      hargaPerOrang: Number(gunungData.hargaPerOrang),
      status: gunungData.status,
      createdAt: gunungData.createdAt,
      updatedAt: gunungData.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.gunung.delete({
      where: { id }
    });
  }

  async findAll(): Promise<Gunung[]> {
    const gunungData = await this.prisma.gunung.findMany();

    return gunungData.map(data => new Gunung({
      id: data.id,
      nama: data.nama,
      kuota: data.kuota,
      deskripsi: data.deskripsi,
      urlGambar: data.urlGambar,
      harga: data.harga,
      lokasi: data.lokasi,
      provinsi: data.provinsi,
      kuotaPerHari: data.kuotaPerHari,
      hargaPerOrang: Number(data.hargaPerOrang),
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
  }

  async findByProvinsi(provinsi: string): Promise<Gunung[]> {
    const gunungData = await this.prisma.gunung.findMany({
      where: { provinsi }
    });

    return gunungData.map(data => new Gunung({
      id: data.id,
      nama: data.nama,
      kuota: data.kuota,
      deskripsi: data.deskripsi,
      urlGambar: data.urlGambar,
      harga: data.harga,
      lokasi: data.lokasi,
      provinsi: data.provinsi,
      kuotaPerHari: data.kuotaPerHari,
      hargaPerOrang: Number(data.hargaPerOrang),
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
  }

  async findByStatus(status: string): Promise<Gunung[]> {
    const gunungData = await this.prisma.gunung.findMany({
      where: { status }
    });

    return gunungData.map(data => new Gunung({
      id: data.id,
      nama: data.nama,
      kuota: data.kuota,
      deskripsi: data.deskripsi,
      urlGambar: data.urlGambar,
      harga: data.harga,
      lokasi: data.lokasi,
      provinsi: data.provinsi,
      kuotaPerHari: data.kuotaPerHari,
      hargaPerOrang: Number(data.hargaPerOrang),
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
  }

  async findActiveMountains(): Promise<Gunung[]> {
    return this.findByStatus('active');
  }

  async findAvailableMountains(): Promise<Gunung[]> {
    const gunungData = await this.prisma.gunung.findMany({
      where: {
        status: 'active',
        kuota: { gt: 0 }
      }
    });

    return gunungData.map(data => new Gunung({
      id: data.id,
      nama: data.nama,
      kuota: data.kuota,
      deskripsi: data.deskripsi,
      urlGambar: data.urlGambar,
      harga: data.harga,
      lokasi: data.lokasi,
      provinsi: data.provinsi,
      kuotaPerHari: data.kuotaPerHari,
      hargaPerOrang: Number(data.hargaPerOrang),
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));
  }
} 