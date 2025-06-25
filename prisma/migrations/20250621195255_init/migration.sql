/*
  Warnings:

  - The `jalur` column on the `Gunung` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Gunung" DROP COLUMN "jalur",
ADD COLUMN     "jalur" TEXT[];
