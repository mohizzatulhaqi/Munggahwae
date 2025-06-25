-- CreateTable
CREATE TABLE "Pemesanan" (
    "id" TEXT NOT NULL,
    "namaLokasi" TEXT NOT NULL,
    "kodeLokasi" TEXT,
    "tanggalMasuk" TIMESTAMP(3) NOT NULL,
    "tanggalKeluar" TIMESTAMP(3) NOT NULL,
    "jumlahPemesan" INTEGER NOT NULL,
    "sudahSetuju" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pemesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnggotaPemesan" (
    "id" TEXT NOT NULL,
    "pemesananId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "noIdentitas" TEXT NOT NULL,
    "kewarganegaraan" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "tempatLahir" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "fileKtp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnggotaPemesan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnggotaPemesan" ADD CONSTRAINT "AnggotaPemesan_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES "Pemesanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
