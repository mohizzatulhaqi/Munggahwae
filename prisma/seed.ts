import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const gunungSeed = await prisma.gunung.create({
    data: {
        id: '1',
        nama: 'Rinjani',
        kuota: 200,
        jalur: ['Torean'],
        deskripsi: 'Gunung di Nusa Tenggara Barat',
        gambar: 'rinjani.png',
        harga: 120000,
    },
  });

  console.log(gunungSeed);
}

main();