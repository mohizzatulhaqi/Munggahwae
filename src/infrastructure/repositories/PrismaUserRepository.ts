import { PrismaClient } from '@prisma/client';
import { User, UserProps } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!userData) return null;

    return new User({
      id: userData.id,
      namaLengkap: userData.namaLengkap,
      email: userData.email,
      phoneNumber: userData.phoneNumber || undefined,
      avatarUrl: userData.avatarUrl || undefined,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!userData) return null;

    return new User({
      id: userData.id,
      namaLengkap: userData.namaLengkap,
      email: userData.email,
      phoneNumber: userData.phoneNumber || undefined,
      avatarUrl: userData.avatarUrl || undefined,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  }

  async save(user: User): Promise<User> {
    const userData = await this.prisma.user.create({
      data: {
        id: user.id,
        namaLengkap: user.namaLengkap,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });

    return new User({
      id: userData.id,
      namaLengkap: userData.namaLengkap,
      email: userData.email,
      phoneNumber: userData.phoneNumber || undefined,
      avatarUrl: userData.avatarUrl || undefined,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  }

  async update(user: User): Promise<User> {
    const userData = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        namaLengkap: user.namaLengkap,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        updatedAt: user.updatedAt,
      }
    });

    return new User({
      id: userData.id,
      namaLengkap: userData.namaLengkap,
      email: userData.email,
      phoneNumber: userData.phoneNumber || undefined,
      avatarUrl: userData.avatarUrl || undefined,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }

  async findAll(): Promise<User[]> {
    const usersData = await this.prisma.user.findMany();

    return usersData.map(userData => new User({
      id: userData.id,
      namaLengkap: userData.namaLengkap,
      email: userData.email,
      phoneNumber: userData.phoneNumber || undefined,
      avatarUrl: userData.avatarUrl || undefined,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    }));
  }
} 