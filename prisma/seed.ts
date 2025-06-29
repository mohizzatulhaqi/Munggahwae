import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check if Gunung Bromo already exists
  const existingGunung = await prisma.gunung.findFirst({
    where: { nama: 'Gunung Bromo' }
  });

  if (existingGunung) {
    console.log('Gunung Bromo already exists, skipping creation');
  } else {
    // Create Gunung Bromo
    const gunungBromo = await prisma.gunung.create({
      data: {
          nama: 'Gunung Bromo',
          kuota: 150,
          deskripsi: 'Gunung Bromo adalah gunung berapi aktif yang terletak di Jawa Timur, Indonesia. Gunung ini merupakan bagian dari kompleks Pegunungan Tengger dan terkenal dengan pemandangan sunrise yang spektakuler serta kawah yang masih aktif. Ketinggian Gunung Bromo mencapai 2.329 meter di atas permukaan laut.',
          urlGambar: '/images/bromo.jpg',
          harga: 150000,
          lokasi: 'Probolinggo',
          provinsi: 'Jawa Timur',
          kuotaPerHari: 75,
          hargaPerOrang: 250000,
          status: 'active',
          peraturan: {
            create: [
              {
                isi: 'Pendaki wajib membawa identitas diri yang sah dan surat keterangan sehat',
                termText: 'Dokumen Wajib',
                orderIndex: 1
              },
              {
                isi: 'Pendakian dimulai pukul 03.00 WIB untuk mencapai puncak saat sunrise',
                termText: 'Waktu Pendakian',
                orderIndex: 2
              },
              {
                isi: 'Dilarang mendaki sendirian, minimal 2 orang atau dengan pemandu resmi',
                termText: 'Pendakian Berkelompok',
                orderIndex: 3
              },
              {
                isi: 'Usia minimal 17 tahun, di bawah usia tersebut harus didampingi orang dewasa',
                termText: 'Persyaratan Usia',
                orderIndex: 4
              },
              {
                isi: 'Wajib membawa perlengkapan: jaket tebal, senter, sepatu gunung, air minum minimal 2 liter',
                termText: 'Perlengkapan Wajib',
                orderIndex: 5
              },
              {
                isi: 'Dilarang meninggalkan sampah di area pendakian',
                termText: 'Kebersihan Lingkungan',
                orderIndex: 6
              },
              {
                isi: 'Menghormati adat istiadat masyarakat Tengger',
                termText: 'Menghormati Budaya Lokal',
                orderIndex: 7
              },
              {
                isi: 'Pendakian dapat ditutup sewaktu-waktu jika terjadi aktivitas vulkanik',
                termText: 'Keamanan Vulkanik',
                orderIndex: 8
              }
            ]
          },
          jalur: {
            create: [
              {
                name: 'Jalur Cemoro Lawang',
                description: 'Jalur utama yang dimulai dari Desa Cemoro Lawang. Jalur ini paling populer dan mudah diakses dengan pemandangan yang indah.',
                difficultyLevel: 'Mudah',
                estimatedDurationHours: 4,
                maxAltitude: 2329
              },
              {
                name: 'Jalur Tosari',
                description: 'Jalur alternatif yang dimulai dari Desa Tosari. Jalur ini lebih sepi dan menawarkan pemandangan yang berbeda.',
                difficultyLevel: 'Sedang',
                estimatedDurationHours: 5,
                maxAltitude: 2329
              },
              {
                name: 'Jalur Ngadisari',
                description: 'Jalur yang dimulai dari Desa Ngadisari. Jalur ini menawarkan pengalaman pendakian yang lebih menantang.',
                difficultyLevel: 'Sulit',
                estimatedDurationHours: 6,
                maxAltitude: 2329
              }
            ]
          },
          galeriGunung: {
            create: [
              {
                imageUrl: '/images/bromo-sunrise.jpg',
                caption: 'Sunrise di Gunung Bromo',
                orderIndex: 1
              },
              {
                imageUrl: '/images/bromo-crater.jpg',
                caption: 'Kawah Gunung Bromo',
                orderIndex: 2
              },
              {
                imageUrl: '/images/bromo-sea-sand.jpg',
                caption: 'Lautan Pasir Bromo',
                orderIndex: 3
              },
              {
                imageUrl: '/images/bromo-temple.jpg',
                caption: 'Pura Luhur Poten',
                orderIndex: 4
              }
            ]
          }
      },
    });

    console.log('Created Gunung Bromo:', gunungBromo.id);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'john@example.com' }
  });

  if (existingUser) {
    console.log('User john@example.com already exists, skipping creation');
  } else {
    // Create a user
    const userSeed = await prisma.user.create({
      data: {
        namaLengkap: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+6281234567890'
      }
    });

    console.log('Created user:', userSeed.id);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });