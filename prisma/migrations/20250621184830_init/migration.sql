/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AnggotaPemesan` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Pemesanan` table. All the data in the column will be lost.
  - You are about to drop the column `kodeLokasi` on the `Pemesanan` table. All the data in the column will be lost.
  - You are about to drop the column `namaLokasi` on the `Pemesanan` table. All the data in the column will be lost.
  - You are about to drop the column `sudahSetuju` on the `Pemesanan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnggotaPemesan" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Pemesanan" DROP COLUMN "createdAt",
DROP COLUMN "kodeLokasi",
DROP COLUMN "namaLokasi",
DROP COLUMN "sudahSetuju";
