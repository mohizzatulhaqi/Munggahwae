export interface Mountain {
  id: string;
  name: string;
  location: string;
  province: string;
  image: string;
  heroImage: string;
  description: string;
  quota: string; // Overall mountain quota for display
  trails: string;
  available: string; // Overall availability for display
  trailDetails: TrailInfo[];
  galleryImages: string[];
  bookingTerms: string[];
  price?: number; // Optional price per person for the mountain
}

export interface TrailInfo {
  name: string;
  description: string;
  icon: string;
  quota: number; // Daily quota for this specific trail
  available: number; // Current available spots for this trail
   // Optional price per person for this trail
}

// Di mountain-data.ts
export const mountainsData = [
  {
    id: '1',
    name: 'Gunung Agung',
    location: 'Karangasem',
    province: 'Bali',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Agung adalah gunung berapi aktif di Bali yang merupakan titik tertinggi di pulau tersebut dengan ketinggian 3.031 mdpl. Gunung ini dianggap suci oleh masyarakat Hindu Bali dan menawarkan pemandangan sunrise yang spektakuler.',
    quota: '75 pendaki/hari',
    trails: '3 Jalur',
    available: '45/75',
    trailDetails: [
      {
        name: 'Jalur Pasar Agung',
        description:
          'Jalur paling populer dengan akses mudah dari Pasar Agung Temple. Perjalanan memakan waktu 4-5 jam dengan pemandangan pura dan hutan.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 35,
        available: 20,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 10,
          '2025-06-30': 5,
          '2025-07-01': 8,
          '2025-07-02': 7,
        },
        price: 150000,
      },
      {
        name: 'Jalur Besakih',
        description:
          'Jalur yang dimulai dari Pura Besakih, lebih menantang dengan medan yang curam dan berbatu.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 25,
        available: 15,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 175000,
      },
      {
        name: 'Jalur Sebudi',
        description:
          'Jalur alternatif yang lebih sepi dengan pemandangan alam yang masih asri dan udara yang sejuk.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 15,
        available: 10,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 0,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian hanya diperbolehkan melalui jalur resmi yang telah ditetapkan: Pasar Agung, Besakih, dan Sebudi.',
      'Wajib membawa identitas diri yang sah dan surat keterangan sehat dari fasilitas kesehatan resmi.',
      'Pendakian dimulai pukul 02.00 - 04.00 WITA untuk mencapai puncak saat sunrise.',
      'Dilarang mendaki sendirian, minimal 2 orang atau dengan pemandu resmi.',
      'Usia minimal 17 tahun, di bawah usia tersebut harus didampingi orang dewasa.',
      'Wajib membawa perlengkapan: jaket tebal, senter, sepatu gunung, air minum minimal 2 liter.',
      'Dilarang meninggalkan sampah di area pendakian.',
      'Menghormati tempat suci dan tidak merusak lingkungan sekitar pura.',
      'Pendakian dapat ditutup sewaktu-waktu jika terjadi aktivitas vulkanik.',
    ],
  },
  {
    id: '2',
    name: 'Gunung Rinjani',
    location: 'Lombok',
    province: 'Nusa Tenggara Barat',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      "Gunung Rinjani adalah gunung yang berlokasi di Pulau Lombok, Nusa Tenggara Barat. Gunung yang merupakan gunung berapi kedua tertinggi di Indonesia dengan ketinggian 3.726 mdpl serta terletak pada lintang 8º25' LS dan 116º28' BT ini merupakan gunung favorit bagi pendaki Indonesia karena keindahan pemandangannya.",
    quota: '100 pendaki/hari',
    trails: '4 Jalur',
    available: '65/100',
    trailDetails: [
      {
        name: 'Jalur Senaru',
        description:
          'Terletak di Desa Senaru, Kecamatan Bayan. Jalur ini adalah jalur paling populer yang menawarkan pemandangan indah dan tanjakan bertahap.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 40,
        available: 25,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 5,
          '2025-06-30': 10,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 200000,
      },
      {
        name: 'Jalur Sembalun',
        description:
          'Terletak di Desa Sembalun Lawang, Kecamatan Sembalun. Ini merupakan jalur terpendek tetapi juga paling curam.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 35,
        available: 20,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 185000,
      },
      {
        name: 'Jalur Torean',
        description:
          'Terletak di Desa Torean, Kecamatan Bayan. Merupakan jalur yang menantang dengan jalur melewati hutan lebat dan menyusuri sungai.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 15,
        available: 12,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 2,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 220000,
      },
      {
        name: 'Jalur Timbanuh',
        description:
          'Terletak di Desa Timbanuh, Kecamatan Pringgasela. Jalur ini juga menantang, melewati hutan lebat dan sungai.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 10,
        available: 8,
        dailyQuotas: {
          '2025-06-28': 3,
          '2025-06-29': 0,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 250000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian hanya diperbolehkan melalui jalur resmi yang telah ditetapkan, seperti Senaru, Sembalun, Torean, dan Timbanuh. Pendaki wajib mengikuti seluruh prosedur dan instruksi dari petugas di pintu masuk jalur pendakian.',
      'Setiap pendaki wajib membawa identitas diri yang sah dan masih berlaku, seperti KTP untuk WNI atau paspor/KITAS untuk WNA, serta menunjukkan surat keterangan sehat dari fasilitas kesehatan resmi.',
      'Pendaki diperbolehkan naik mulai pukul 07.00 hingga 15.00 WITA, dan wajib keluar dari jalur pendakian paling lambat pukul 21.00 WITA.',
      'Pendaki dilarang melakukan pendakian seorang diri. Jika tidak memiliki teman mendaki, wajib didampingi oleh pemandu resmi. Pemandu dan porter yang ikut wajib memiliki surat izin dari pihak pengelola taman nasional.',
      'Pendaki berusia di bawah 17 tahun harus didampingi oleh orang dewasa dan menyerahkan surat izin tertulis dari orang tua atau wali.',
      'Perlengkapan wajib yang harus dibawa antara lain tenda, matras, sleeping bag, pakaian hangat, jas hujan, sepatu gunung, senter, makanan, dan air minum yang cukup.',
      'Semua pendaki harus membawa turun kembali sampahnya masing-masing dan dilarang meninggalkan sampah di area jalur atau camping ground. Pemeriksaan sampah dilakukan saat keluar jalur.',
      'Wadah makanan dan minuman harus menggunakan bahan yang dapat digunakan kembali. Dilarang membawa wadah sekali pakai seperti styrofoam, kaleng, atau botol plastik sekali pakai.',
      'Kuota pendakian dibatasi per hari untuk menjaga kelestarian alam. Pendaki yang datang tanpa mengikuti aturan kuota tidak akan diizinkan naik.',
      'Pendaki wajib menjaga etika dan kelestarian lingkungan, termasuk tidak merusak tumbuhan, tidak membunuh atau memberi makan satwa liar, tidak membuat api unggun sembarangan, dan tidak membawa bahan berbahaya seperti alkohol, narkoba, atau senjata tajam.',
      'Kebijakan zero waste diterapkan. Pendaki harus melaporkan barang-barang berpotensi menjadi sampah sejak awal dan memastikan jumlahnya sesuai saat kembali.',
      'Dalam keadaan darurat atau cuaca ekstrem, pendakian dapat ditutup sewaktu-waktu oleh petugas tanpa pemberitahuan sebelumnya demi keselamatan semua pihak.',
    ],
  },
  {
    id: '3',
    name: 'Gunung Bromo',
    location: 'Probolinggo',
    province: 'Jawa Timur',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Bromo adalah gunung berapi aktif di Jawa Timur dengan ketinggian 2.329 mdpl. Terkenal dengan pemandangan sunrise yang menakjubkan dan lautan pasir yang luas, Bromo menjadi salah satu destinasi wisata paling populer di Indonesia.',
    quota: '200 pendaki/hari',
    trails: '2 Jalur',
    available: '150/200',
    trailDetails: [
      {
        name: 'Jalur Cemoro Lawang',
        description:
          'Jalur utama yang paling mudah diakses dengan kendaraan hingga area parkir, dilanjutkan trekking ringan ke kawah.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 150,
        available: 100,
        dailyQuotas: {
          '2025-06-28': 30,
          '2025-06-29': 40,
          '2025-06-30': 30,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 100000,
      },
      {
        name: 'Jalur Wonokitri',
        description:
          'Jalur alternatif yang lebih menantang dengan pemandangan savana dan hutan yang indah.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 50,
        available: 50,
        dailyQuotas: {
          '2025-06-28': 20,
          '2025-06-29': 10,
          '2025-06-30': 20,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian hanya diperbolehkan melalui jalur resmi Cemoro Lawang dan Wonokitri.',
      'Wajib membawa identitas diri yang sah dan surat keterangan sehat.',
      'Jam operasional pendakian: 04.00 - 17.00 WIB.',
      'Dilarang mendekati kawah saat status gunung dalam kondisi waspada.',
      'Wajib menggunakan masker pelindung dari gas vulkanik.',
      'Dilarang bermalam di area kawah atau lautan pasir.',
      'Menjaga kebersihan dan tidak membuang sampah sembarangan.',
      'Mengikuti instruksi petugas dan guide lokal.',
    ],
  },
  {
    id: '4',
    name: 'Gunung Semeru',
    location: 'Lumajang',
    province: 'Jawa Timur',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Semeru adalah gunung tertinggi di Pulau Jawa dengan ketinggian 3.676 mdpl. Dikenal sebagai Mahameru, gunung ini menawarkan tantangan pendakian yang menantang dengan pemandangan yang luar biasa indah.',
    quota: '80 pendaki/hari',
    trails: '2 Jalur',
    available: '50/80',
    trailDetails: [
      {
        name: 'Jalur Ranu Pani',
        description:
          'Jalur utama yang dimulai dari Ranu Pani dengan pemandangan danau dan savana yang indah.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 60,
        available: 35,
        dailyQuotas: {
          '2025-06-28': 15,
          '2025-06-29': 10,
          '2025-06-30': 10,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 150000,
      },
      {
        name: 'Jalur Watu Rejeng',
        description:
          'Jalur alternatif yang lebih menantang dengan medan berbatu dan tanjakan curam.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 20,
        available: 15,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 175000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian hanya diperbolehkan melalui jalur resmi Ranu Pani dan Watu Rejeng.',
      'Wajib membawa surat keterangan sehat dan identitas diri yang sah.',
      'Pendakian minimal 3 hari 2 malam dengan persiapan fisik yang baik.',
      'Dilarang mendaki sendirian, minimal 3 orang atau dengan guide bersertifikat.',
      'Wajib membawa perlengkapan lengkap termasuk tenda 4 season dan sleeping bag.',
      'Dilarang mendekati kawah saat erupsi atau status waspada.',
      'Membawa turun semua sampah dan menjaga kelestarian alam.',
      'Mengikuti jalur yang telah ditentukan dan tidak merusak vegetasi.',
    ],
  },
  {
    id: '5',
    name: 'Gunung Merbabu',
    location: 'Magelang',
    province: 'Jawa Tengah',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Merbabu adalah gunung berapi yang sudah tidak aktif dengan ketinggian 3.145 mdpl. Terkenal dengan savana yang luas dan pemandangan sunrise yang memukau, cocok untuk pendaki pemula hingga berpengalaman.',
    quota: '150 pendaki/hari',
    trails: '4 Jalur',
    available: '100/150',
    trailDetails: [
      {
        name: 'Jalur Selo',
        description: 'Jalur paling populer dengan akses mudah dan pemandangan savana yang indah.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 80,
        available: 50,
        dailyQuotas: {
          '2025-06-28': 20,
          '2025-06-29': 15,
          '2025-06-30': 15,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 100000,
      },
      {
        name: 'Jalur Wekas',
        description: 'Jalur yang lebih menantang dengan hutan pinus dan pemandangan yang eksotis.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 40,
        available: 30,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 10,
          '2025-06-30': 10,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
      {
        name: 'Jalur Thekelan',
        description: 'Jalur alternatif dengan medan yang bervariasi dan pemandangan Gunung Merapi.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 20,
        available: 15,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 150000,
      },
      {
        name: 'Jalur Cunthel',
        description:
          'Jalur yang jarang digunakan dengan tantangan lebih berat namun pemandangan yang menawan.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 10,
        available: 5,
        dailyQuotas: {
          '2025-06-28': 3,
          '2025-06-29': 2,
          '2025-06-30': 0,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 175000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian diperbolehkan melalui jalur Selo, Wekas, Thekelan, dan Cunthel.',
      'Wajib membawa identitas diri dan surat keterangan sehat.',
      'Jam pendakian: 05.00 - 17.00 WIB.',
      'Dilarang membuat api unggun di area savana.',
      'Wajib camping di area yang telah ditentukan.',
      'Membawa perlengkapan camping yang memadai.',
      'Menjaga kebersihan dan membawa turun semua sampah.',
      'Tidak merusak tanaman dan ekosistem savana.',
    ],
  },
  {
    id: '6',
    name: 'Gunung Prau',
    location: 'Wonosobo',
    province: 'Jawa Tengah',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Prau adalah gunung dengan ketinggian 2.565 mdpl yang terkenal dengan hamparan bunga edelweis dan pemandangan sunrise yang spektakuler. Cocok untuk pendaki pemula dengan jalur yang relatif mudah.',
    quota: '200 pendaki/hari',
    trails: '3 Jalur',
    available: '150/200',
    trailDetails: [
      {
        name: 'Jalur Dieng',
        description:
          'Jalur paling populer dan mudah dengan pemandangan Telaga Warna dan hamparan edelweis.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 120,
        available: 90,
        dailyQuotas: {
          '2025-06-28': 30,
          '2025-06-29': 30,
          '2025-06-30': 30,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 75000,
      },
      {
        name: 'Jalur Patak Banteng',
        description:
          'Jalur alternatif dengan medan yang lebih menantang dan pemandangan yang berbeda.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 60,
        available: 45,
        dailyQuotas: {
          '2025-06-28': 15,
          '2025-06-29': 15,
          '2025-06-30': 15,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 100000,
      },
      {
        name: 'Jalur Igirmranak',
        description: 'Jalur yang jarang digunakan dengan akses melalui desa dan hutan pinus.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 20,
        available: 15,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian diperbolehkan melalui jalur Dieng, Patak Banteng, dan Igirmranak.',
      'Wajib membawa identitas diri yang sah.',
      'Dilarang memetik bunga edelweis atau merusak vegetasi.',
      'Camping hanya diperbolehkan di area yang telah ditentukan.',
      'Membawa jaket tebal karena suhu dingin di malam hari.',
      'Menjaga kebersihan dan tidak membuang sampah sembarangan.',
      'Mengikuti jalur yang telah ditentukan.',
      'Menghormati budaya lokal dan masyarakat sekitar.',
    ],
  },
  {
    id: '7',
    name: 'Gunung Merapi',
    location: 'Sleman',
    province: 'DI Yogyakarta',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Merapi adalah gunung berapi paling aktif di Indonesia dengan ketinggian 2.930 mdpl. Menawarkan tantangan pendakian yang menantang dengan pemandangan kawah aktif dan lava dome yang menakjubkan.',
    quota: '50 pendaki/hari',
    trails: '2 Jalur',
    available: '30/50',
    trailDetails: [
      {
        name: 'Jalur Selo',
        description:
          'Jalur utama yang paling aman dengan pemandangan kawah dan monitoring ketat aktivitas vulkanik.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 35,
        available: 20,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 150000,
      },
      {
        name: 'Jalur New Selo',
        description:
          'Jalur alternatif yang dibuka setelah erupsi dengan medan yang lebih menantang.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 15,
        available: 10,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 3,
          '2025-06-30': 2,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 175000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian hanya diperbolehkan saat status normal atau waspada level 1.',
      'Wajib didampingi guide bersertifikat dari BPPTKG.',
      'Membawa surat keterangan sehat dan asuransi perjalanan.',
      'Pendakian dibatasi hingga radius aman dari kawah aktif.',
      'Wajib menggunakan masker dan pelindung dari gas vulkanik.',
      'Dilarang bermalam di area berbahaya.',
      'Mengikuti instruksi petugas dan sistem peringatan dini.',
      'Siap dievakuasi sewaktu-waktu jika terjadi peningkatan aktivitas.',
    ],
  },
  {
    id: '8',
    name: 'Gunung Lawu',
    location: 'Karanganyar',
    province: 'Jawa Tengah',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Lawu adalah gunung berapi yang sudah tidak aktif dengan ketinggian 3.265 mdpl. Terkenal dengan situs sejarah Candi Cetho dan Sukuh, serta pemandangan sunrise yang memukau dari puncak Hargo Dumilah.',
    quota: '120 pendaki/hari',
    trails: '3 Jalur',
    available: '80/120',
    trailDetails: [
      {
        name: 'Jalur Cemoro Sewu',
        description:
          'Jalur paling populer dengan akses mudah dan pemandangan hutan cemara yang indah.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 70,
        available: 45,
        dailyQuotas: {
          '2025-06-28': 15,
          '2025-06-29': 15,
          '2025-06-30': 15,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 100000,
      },
      {
        name: 'Jalur Cemoro Kandang',
        description:
          'Jalur alternatif dengan medan yang lebih menantang dan pemandangan yang berbeda.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 35,
        available: 25,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 5,
          '2025-06-30': 10,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
      {
        name: 'Jalur Candi Cetho',
        description:
          'Jalur yang melewati situs bersejarah dengan nilai budaya dan spiritual yang tinggi.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 15,
        available: 10,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 0,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 150000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian diperbolehkan melalui jalur Cemoro Sewu, Cemoro Kandang, dan Candi Cetho.',
      'Wajib membawa identitas diri dan surat keterangan sehat.',
      'Menghormati situs bersejarah dan tidak merusak peninggalan budaya.',
      'Dilarang membuat api unggun di area hutan cemara.',
      'Membawa perlengkapan hangat karena suhu dingin di malam hari.',
      'Camping hanya di area yang telah ditentukan.',
      'Menjaga kebersihan dan membawa turun semua sampah.',
      'Tidak mengganggu aktivitas spiritual masyarakat lokal.',
    ],
  },
  {
    id: '9',
    name: 'Gunung Ijen',
    location: 'Banyuwangi',
    province: 'Jawa Timur',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Ijen adalah gunung berapi dengan ketinggian 2.443 mdpl yang terkenal dengan fenomena blue fire dan danau kawah belerang terbesar di dunia. Menawarkan pengalaman pendakian yang unik dan menakjubkan.',
    quota: '100 pendaki/hari',
    trails: '2 Jalur',
    available: '70/100',
    trailDetails: [
      {
        name: 'Jalur Paltuding',
        description:
          'Jalur utama yang paling mudah diakses dengan pemandangan kawah belerang yang spektakuler.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 80,
        available: 50,
        dailyQuotas: {
          '2025-06-28': 20,
          '2025-06-29': 15,
          '2025-06-30': 15,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
      {
        name: 'Jalur Sempol',
        description:
          'Jalur alternatif yang lebih panjang dengan pemandangan perkebunan kopi dan hutan.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 20,
        available: 20,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 150000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian diperbolehkan melalui jalur Paltuding dan Sempol.',
      'Wajib menggunakan masker gas untuk melindungi dari gas belerang.',
      'Pendakian blue fire dimulai pukul 01.00 - 05.00 WIB.',
      'Dilarang turun ke kawah tanpa guide berpengalaman.',
      'Membawa senter dan perlengkapan safety yang memadai.',
      'Tidak menyentuh atau mengambil belerang dari kawah.',
      'Menjaga jarak aman dari area penambangan belerang.',
      'Mengikuti instruksi petugas dan guide lokal.',
    ],
  },
  {
    id: '10',
    name: 'Gunung Kerinci',
    location: 'Kerinci',
    province: 'Jambi',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Kerinci adalah gunung tertinggi di Sumatera dengan ketinggian 3.805 mdpl. Terletak di Taman Nasional Kerinci Seblat dengan keanekaragaman hayati yang luar biasa dan tantangan pendakian yang menantang.',
    quota: '60 pendaki/hari',
    trails: '2 Jalur',
    available: '40/60',
    trailDetails: [
      {
        name: 'Jalur Kersik Tuo',
        description:
          'Jalur utama yang paling populer dengan akses melalui Desa Kersik Tuo dan pemandangan hutan tropis.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 45,
        available: 30,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 10,
          '2025-06-30': 10,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 200000,
      },
      {
        name: 'Jalur Pelompek',
        description:
          'Jalur alternatif yang lebih menantang dengan medan yang berat dan pemandangan yang eksotis.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 15,
        available: 10,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 3,
          '2025-06-30': 2,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 250000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian hanya diperbolehkan dengan izin dari TNKS (Taman Nasional Kerinci Seblat).',
      'Wajib didampingi guide lokal yang bersertifikat.',
      'Pendakian minimal 4 hari 3 malam dengan persiapan fisik yang baik.',
      'Membawa perlengkapan camping lengkap dan makanan yang cukup.',
      'Tidak mengganggu satwa liar dan menjaga kelestarian hutan.',
      'Dilarang berburu atau mengambil flora fauna.',
      'Membawa turun semua sampah dan menjaga kebersihan alam.',
      'Mengikuti jalur yang telah ditentukan dan tidak tersesat.',
    ],
  },
  {
    id: '11',
    name: 'Gunung Batur',
    location: 'Bangli',
    province: 'Bali',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Batur adalah gunung berapi aktif dengan ketinggian 1.717 mdpl yang terkenal dengan pemandangan sunrise di atas Danau Batur. Pendakian yang relatif mudah dan cocok untuk pemula.',
    quota: '300 pendaki/hari',
    trails: '3 Jalur',
    available: '200/300',
    trailDetails: [
      {
        name: 'Jalur Toya Bungkah',
        description:
          'Jalur paling populer dan mudah dengan pemandangan danau dan sunrise yang spektakuler.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 200,
        available: 140,
        dailyQuotas: {
          '2025-06-28': 50,
          '2025-06-29': 50,
          '2025-06-30': 40,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 100000,
      },
      {
        name: 'Jalur Pura Jati',
        description:
          'Jalur alternatif yang melewati pura dengan nilai spiritual dan pemandangan yang indah.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 75,
        available: 45,
        dailyQuotas: {
          '2025-06-28': 20,
          '2025-06-29': 15,
          '2025-06-30': 10,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
      {
        name: 'Jalur Songan',
        description:
          'Jalur yang jarang digunakan dengan akses melalui desa dan pemandangan yang berbeda.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 25,
        available: 15,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 3,
          '2025-06-30': 2,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 150000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian diperbolehkan melalui jalur Toya Bungkah, Pura Jati, dan Songan.',
      'Wajib didampingi guide lokal untuk keamanan.',
      'Pendakian sunrise dimulai pukul 03.30 - 06.00 WITA.',
      'Menghormati tempat suci dan budaya lokal Bali.',
      'Membawa jaket hangat untuk cuaca dingin di pagi hari.',
      'Tidak merusak lingkungan dan menjaga kebersihan.',
      'Mengikuti instruksi guide dan petugas setempat.',
      'Membayar retribusi sesuai ketentuan yang berlaku.',
    ],
  },
  {
    id: '12',
    name: 'Gunung Papandayan',
    location: 'Garut',
    province: 'Jawa Barat',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Papandayan adalah gunung berapi dengan ketinggian 2.665 mdpl yang terkenal dengan kawah aktif dan fenomena geothermal. Menawarkan pemandangan alam yang unik dengan aktivitas vulkanik yang masih aktif.',
    quota: '150 pendaki/hari',
    trails: '2 Jalur',
    available: '100/150',
    trailDetails: [
      {
        name: 'Jalur Pondok Salada',
        description:
          'Jalur utama yang mudah diakses dengan pemandangan kawah dan aktivitas geothermal.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 120,
        available: 80,
        dailyQuotas: {
          '2025-06-28': 30,
          '2025-06-29': 25,
          '2025-06-30': 25,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 100000,
      },
      {
        name: 'Jalur Cisurupan',
        description:
          'Jalur alternatif yang lebih menantang dengan pemandangan hutan dan perkebunan teh.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 30,
        available: 20,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian diperbolehkan melalui jalur Pondok Salada dan Cisurupan.',
      'Wajib menggunakan masker untuk melindungi dari gas vulkanik.',
      'Dilarang mendekati kawah aktif saat status waspada.',
      'Membawa perlengkapan safety dan P3K.',
      'Tidak menyentuh atau mengambil material vulkanik.',
      'Menjaga jarak aman dari area geothermal.',
      'Mengikuti jalur yang telah ditentukan.',
      'Membawa turun semua sampah dan menjaga kebersihan.',
    ],
  },
  {
    id: '13',
    name: 'Gunung Gede Pangrango',
    location: 'Bogor',
    province: 'Jawa Barat',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Gede Pangrango adalah kompleks gunung kembar dengan ketinggian 2.958 mdpl (Gede) dan 3.019 mdpl (Pangrango). Terletak di Taman Nasional Gede Pangrango dengan keanekaragaman hayati yang tinggi.',
    quota: '100 pendaki/hari',
    trails: '3 Jalur',
    available: '70/100',
    trailDetails: [
      {
        name: 'Jalur Gunung Putri',
        description:
          'Jalur paling populer dengan akses mudah dan pemandangan air terjun Cibeureum.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 60,
        available: 40,
        dailyQuotas: {
          '2025-06-28': 15,
          '2025-06-29': 15,
          '2025-06-30': 10,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 100000,
      },
      {
        name: 'Jalur Salabintana',
        description:
          'Jalur yang lebih menantang dengan medan yang berat dan pemandangan hutan yang lebat.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 30,
        available: 20,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
      {
        name: 'Jalur Putri',
        description: 'Jalur alternatif dengan akses melalui Sukabumi dan pemandangan yang berbeda.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 10,
        available: 10,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 3,
          '2025-06-30': 2,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 150000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian hanya diperbolehkan dengan izin dari Taman Nasional Gede Pangrango.',
      'Wajib registrasi dan membayar tiket masuk taman nasional.',
      'Pendakian maksimal 3 hari 2 malam.',
      'Dilarang berburu atau mengambil flora fauna.',
      'Camping hanya di area yang telah ditentukan.',
      'Membawa perlengkapan camping yang memadai.',
      'Menjaga kebersihan dan membawa turun semua sampah.',
      'Mengikuti jalur yang telah ditentukan dan tidak merusak vegetasi.',
    ],
  },
  {
    id: '14',
    name: 'Gunung Ciremai',
    location: 'Cirebon',
    province: 'Jawa Barat',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Ciremai adalah gunung tertinggi di Jawa Barat dengan ketinggian 3.078 mdpl. Terletak di Taman Nasional Gunung Ciremai, menawarkan keanekaragaman hayati dan pemandangan yang menakjubkan.',
    quota: '80 pendaki/hari',
    trails: '4 Jalur',
    available: '50/80',
    trailDetails: [
      {
        name: 'Jalur Linggarjati',
        description: 'Jalur paling populer dengan akses mudah dan pemandangan hutan yang indah.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 40,
        available: 25,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 8,
          '2025-06-30': 7,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 100000,
      },
      {
        name: 'Jalur Apuy',
        description:
          'Jalur yang lebih menantang dengan medan yang berat dan pemandangan yang eksotis.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 20,
        available: 15,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
      {
        name: 'Jalur Palutungan',
        description: 'Jalur alternatif dengan akses melalui Kuningan dan pemandangan perkebunan.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 15,
        available: 7,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 2,
          '2025-06-30': 0,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 150000,
      },
      {
        name: 'Jalur Cigugur',
        description:
          'Jalur yang jarang digunakan dengan tantangan lebih berat namun pemandangan yang menawan.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 5,
        available: 3,
        dailyQuotas: {
          '2025-06-28': 2,
          '2025-06-29': 1,
          '2025-06-30': 0,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 175000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian hanya diperbolehkan dengan izin dari Taman Nasional Gunung Ciremai.',
      'Wajib registrasi dan membayar tiket masuk taman nasional.',
      'Pendakian maksimal 4 hari 3 malam.',
      'Dilarang berburu atau mengambil flora fauna.',
      'Membawa guide lokal untuk keamanan.',
      'Camping hanya di area yang telah ditentukan.',
      'Menjaga kebersihan dan membawa turun semua sampah.',
      'Tidak merusak vegetasi dan ekosistem hutan.',
    ],
  },
  {
    id: '15',
    name: 'Gunung Raung',
    location: 'Banyuwangi',
    province: 'Jawa Timur',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Raung adalah gunung berapi dengan ketinggian 3.344 mdpl yang terkenal dengan kawah terbesar di Jawa Timur. Menawarkan tantangan pendakian yang berat dengan pemandangan kawah yang spektakuler.',
    quota: '50 pendaki/hari',
    trails: '2 Jalur',
    available: '30/50',
    trailDetails: [
      {
        name: 'Jalur Sumberwringin',
        description:
          'Jalur utama yang paling populer dengan akses melalui perkebunan kopi dan hutan.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 35,
        available: 20,
        dailyQuotas: {
          '2025-06-28': 10,
          '2025-06-29': 5,
          '2025-06-30': 5,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 150000,
      },
      {
        name: 'Jalur Kalibaru',
        description:
          'Jalur alternatif yang lebih menantang dengan medan yang berat dan pemandangan yang berbeda.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 15,
        available: 10,
        dailyQuotas: {
          '2025-06-28': 5,
          '2025-06-29': 3,
          '2025-06-30': 2,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 175000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian hanya diperbolehkan saat status normal atau waspada level 1.',
      'Wajib didampingi guide lokal yang berpengalaman.',
      'Pendakian minimal 4 hari 3 malam dengan persiapan fisik yang baik.',
      'Membawa perlengkapan camping lengkap dan makanan yang cukup.',
      'Dilarang mendekati kawah saat aktivitas vulkanik meningkat.',
      'Tidak mengganggu satwa liar dan menjaga kelestarian hutan.',
      'Membawa turun semua sampah dan menjaga kebersihan alam.',
      'Mengikuti jalur yang telah ditentukan dan tidak tersesat.',
    ],
  },
  {
    id: '16',
    name: 'Gunung Buthak',
    location: 'Malang',
    province: 'Jawa Timur',
    image: '/placeholder.svg?height=99&width=176',
    heroImage: '/placeholder.svg?height=320&width=928',
    description:
      'Gunung Butak adalah sebuah gunung berapi kerucut yang terletak di perbatasan Kabupaten Malang dan Kabupaten Blitar dalam wilayah Provinsi Jawa Timur, Indonesia.',
    quota: '300 pendaki/hari',
    trails: '2 Jalur',
    available: '180/300',
    trailDetails: [
      {
        name: 'Jalur Panderman',
        description: 'Jalur yang paling populer dengan pemandangan sabana yang indah.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 200,
        available: 120,
        dailyQuotas: {
          '2025-06-28': 50,
          '2025-06-29': 40,
          '2025-06-30': 30,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 100000,
      },
      {
        name: 'Jalur Sirah Kencong',
        description: 'Jalur yang di mulai perkebunan teh sirah kencong.',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 100,
        available: 60,
        dailyQuotas: {
          '2025-06-28': 30,
          '2025-06-29': 20,
          '2025-06-30': 10,
          '2025-07-01': 0,
          '2025-07-02': 0,
        },
        price: 125000,
      },
    ],
    galleryImages: [
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
      '/placeholder.svg?height=169&width=301',
    ],
    bookingTerms: [
      'Pendakian hanya diperbolehkan saat status normal atau waspada level 1.',
      'Wajib didampingi guide lokal yang berpengalaman.',
      'Pendakian minimal 4 hari 3 malam dengan persiapan fisik yang baik.',
      'Membawa perlengkapan camping lengkap dan makanan yang cukup.',
      'Dilarang mendekati kawah saat aktivitas vulkanik meningkat.',
      'Tidak mengganggu satwa liar dan menjaga kelestarian hutan.',
      'Membawa turun semua sampah dan menjaga kebersihan alam.',
      'Mengikuti jalur yang telah ditentukan dan tidak tersesat.',
    ],
  },
];

export function getMountainById(id: string): Mountain | undefined {
  return mountainsData.find((mountain) => mountain.id === id);
}

export function getAllMountains(): Mountain[] {
  return mountainsData;
}

// Helper function to get total available spots across all trails
export function getTotalAvailableSpots(mountain: Mountain): number {
  return mountain.trailDetails.reduce((total, trail) => total + trail.available, 0);
}

// Helper function to get total quota across all trails
export function getTotalQuota(mountain: Mountain): number {
  return mountain.trailDetails.reduce((total, trail) => total + trail.quota, 0);
}
