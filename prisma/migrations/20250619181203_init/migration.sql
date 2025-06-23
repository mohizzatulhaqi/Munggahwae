-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gunung" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kuota" INTEGER NOT NULL,
    "jalur" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,

    CONSTRAINT "Gunung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peraturan" (
    "id" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "gunungId" TEXT NOT NULL,

    CONSTRAINT "Peraturan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Peraturan" ADD CONSTRAINT "Peraturan_gunungId_fkey" FOREIGN KEY ("gunungId") REFERENCES "Gunung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
