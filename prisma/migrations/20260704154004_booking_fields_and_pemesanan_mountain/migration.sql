/*
  Warnings:

  - You are about to drop the column `kewarganegaraan` on the `AnggotaPemesan` table. All the data in the column will be lost.
  - Added the required column `nomorTelepon` to the `AnggotaPemesan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mountainId` to the `Pemesanan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AnggotaPemesan" DROP CONSTRAINT "AnggotaPemesan_pemesananId_fkey";

-- AlterTable
ALTER TABLE "AnggotaPemesan" DROP COLUMN "kewarganegaraan",
ADD COLUMN     "isCompanion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nomorTelepon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pemesanan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "mountainId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AnggotaPemesan" ADD CONSTRAINT "AnggotaPemesan_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES "Pemesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
