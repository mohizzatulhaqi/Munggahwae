/*
  Warnings:

  - You are about to drop the column `gambar` on the `Gunung` table. All the data in the column will be lost.
  - You are about to drop the column `jalur` on the `Gunung` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AnggotaPemesan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pemesanan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hargaPerOrang` to the `Gunung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lokasi` to the `Gunung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinsi` to the `Gunung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Gunung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlGambar` to the `Gunung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termText` to the `Peraturan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AnggotaPemesan" DROP CONSTRAINT "AnggotaPemesan_pemesananId_fkey";

-- AlterTable
ALTER TABLE "Gunung" DROP COLUMN "gambar",
DROP COLUMN "jalur",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hargaPerOrang" BIGINT NOT NULL,
ADD COLUMN     "kuotaPerHari" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "lokasi" TEXT NOT NULL,
ADD COLUMN     "provinsi" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "urlGambar" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Peraturan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "termText" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "AnggotaPemesan";

-- DropTable
DROP TABLE "Pemesanan";

-- CreateTable
CREATE TABLE "Jalur" (
    "id" TEXT NOT NULL,
    "mountainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "difficultyLevel" TEXT,
    "estimatedDurationHours" INTEGER,
    "maxAltitude" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Jalur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "mountainId" TEXT,
    "trailId" TEXT,
    "tanggalMasuk" TIMESTAMP(3) NOT NULL,
    "tanggalKeluar" TIMESTAMP(3) NOT NULL,
    "jumlahPemesan" INTEGER NOT NULL,
    "totalHarga" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "specialRequests" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnggotaPemesanan" (
    "id" TEXT NOT NULL,
    "pemesananId" TEXT,
    "email" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "noIdentitas" TEXT NOT NULL,
    "kewarganegaraan" TEXT NOT NULL DEFAULT 'Indonesia',
    "jenisKelamin" TEXT,
    "tempatLahir" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "fileKtp" TEXT,
    "isCompanion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnggotaPemesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GaleriGunung" (
    "id" TEXT NOT NULL,
    "mountainId" TEXT,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GaleriGunung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KuotaHarian" (
    "id" TEXT NOT NULL,
    "mountainId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "totalQuota" INTEGER NOT NULL,
    "bookedQuota" INTEGER NOT NULL DEFAULT 0,
    "availableQuota" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KuotaHarian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "bookingId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Jalur" ADD CONSTRAINT "Jalur_mountainId_fkey" FOREIGN KEY ("mountainId") REFERENCES "Gunung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_mountainId_fkey" FOREIGN KEY ("mountainId") REFERENCES "Gunung"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "Jalur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnggotaPemesanan" ADD CONSTRAINT "AnggotaPemesanan_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GaleriGunung" ADD CONSTRAINT "GaleriGunung_mountainId_fkey" FOREIGN KEY ("mountainId") REFERENCES "Gunung"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KuotaHarian" ADD CONSTRAINT "KuotaHarian_mountainId_fkey" FOREIGN KEY ("mountainId") REFERENCES "Gunung"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
