export interface Mountain {
  id: string
  name: string
  location: string
  province: string
  coordinates: { lat: number; lng: number }
  image: string
  heroImage: string
  description: string
  quota: string
  trails: string
  available: string
  trailDetails: TrailInfo[]
  galleryImages: string[]
  bookingTerms: string[]
}

export interface TrailInfo {
  name: string
  description: string
  coordinates?: { lat: number; lng: number }
}

export const mountainsData: Mountain[] = [
  {
    id: "1",
    name: "Gunung Agung",
    location: "Karangasem",
    province: "Bali",
    coordinates: { lat: -8.343, lng: 115.508 },
    image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Gunung_Agung_1.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Gunung_Agung_Amed.jpg",
    description:
      "Gunung Agung adalah gunung berapi aktif di Bali yang merupakan titik tertinggi di pulau tersebut dengan ketinggian 3.031 mdpl. Gunung ini dianggap suci oleh masyarakat Hindu Bali dan menawarkan pemandangan sunrise yang spektakuler.",
    quota: "75 pendaki/hari",
    trails: "3 Jalur",
    available: "75/75",
    trailDetails: [
      {
        name: "Jalur Pasar Agung",
        description:
          "Jalur paling populer dengan akses mudah dari Pasar Agung Temple. Perjalanan memakan waktu 4-5 jam dengan pemandangan pura dan hutan.",
        coordinates: { lat: -8.360, lng: 115.480 },
      },
      {
        name: "Jalur Besakih",
        description: "Jalur yang dimulai dari Pura Besakih, lebih menantang dengan medan yang curam dan berbatu.",
        coordinates: { lat: -8.374, lng: 115.452 },
      },
      {
        name: "Jalur Sebudi",
        description: "Jalur alternatif yang lebih sepi dengan pemandangan alam yang masih asri dan udara yang sejuk.",
        coordinates: { lat: -8.360, lng: 115.490 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/7/78/Gunung_Agung_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/Gunung_Agung_Amed.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Gunung_Agung_Descension.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/dd/Mount_Agung_June_2025.jpg",
    ],
    bookingTerms: [
      "Pendakian hanya diperbolehkan melalui jalur resmi yang telah ditetapkan: Pasar Agung, Besakih, dan Sebudi.",
      "Wajib membawa identitas diri yang sah dan surat keterangan sehat dari fasilitas kesehatan resmi.",
      "Pendakian dimulai pukul 02.00 - 04.00 WITA untuk mencapai puncak saat sunrise.",
      "Dilarang mendaki sendirian, minimal 2 orang atau dengan pemandu resmi.",
      "Usia minimal 17 tahun, di bawah usia tersebut harus didampingi orang dewasa.",
      "Wajib membawa perlengkapan: jaket tebal, senter, sepatu gunung, air minum minimal 2 liter.",
      "Dilarang meninggalkan sampah di area pendakian.",
      "Menghormati tempat suci dan tidak merusak lingkungan sekitar pura.",
      "Pendakian dapat ditutup sewaktu-waktu jika terjadi aktivitas vulkanik.",
    ],
  },
  {
    id: "2",
    name: "Gunung Rinjani",
    location: "Lombok",
    province: "Nusa Tenggara Barat",
    coordinates: { lat: -8.411, lng: 116.457 },
    image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Gunung_Rinjani_dan_danau_Segara_Anak.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Mount_Rinjani_Panorama.jpg",
    description:
      "Gunung Rinjani adalah gunung yang berlokasi di Pulau Lombok, Nusa Tenggara Barat. Gunung yang merupakan gunung berapi kedua tertinggi di Indonesia dengan ketinggian 3.726 mdpl serta terletak pada lintang 8º25' LS dan 116º28' BT ini merupakan gunung favorit bagi pendaki Indonesia karena keindahan pemandangannya.",
    quota: "100 pendaki/hari",
    trails: "4 Jalur",
    available: "100/100",
    trailDetails: [
      {
        name: "Jalur Senaru",
        description:
          "Terletak di Desa Senaru, Kecamatan Bayan. Jalur ini adalah jalur paling populer yang menawarkan pemandangan indah dan tanjakan bertahap.",
        coordinates: { lat: -8.312, lng: 116.427 },
      },
      {
        name: "Jalur Sembalun",
        description:
          "Terletak di Desa Sembalun Lawang, Kecamatan Sembalun. Ini merupakan jalur terpendek tetapi juga paling curam.",
        coordinates: { lat: -8.351, lng: 116.539 },
      },
      {
        name: "Jalur Torean",
        description:
          "Terletak di Desa Torean, Kecamatan Bayan. Merupakan jalur yang menantang dengan jalur melewati hutan lebat dan menyusuri sungai.",
        coordinates: { lat: -8.336, lng: 116.462 },
      },
      {
        name: "Jalur Timbanuh",
        description:
          "Terletak di Desa Timbanuh, Kecamatan Pringgasela. Jalur ini juga menantang, melewati hutan lebat dan sungai.",
        coordinates: { lat: -8.459, lng: 116.539 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/4/44/Gunung_Rinjani_dan_danau_Segara_Anak.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Gunung_Rinjani_dari_Jalur_Sembalun.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a0/Mount_Rinjani_Panorama.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Mt._Barujari_descending_Mt._Rinjani_to_Plawangan_II.JPG",
    ],
    bookingTerms: [
      "Pendakian hanya diperbolehkan melalui jalur resmi yang telah ditetapkan, seperti Senaru, Sembalun, Torean, dan Timbanuh. Pendaki wajib mengikuti seluruh prosedur dan instruksi dari petugas di pintu masuk jalur pendakian.",
      "Setiap pendaki wajib membawa identitas diri yang sah dan masih berlaku, seperti KTP untuk WNI atau paspor/KITAS untuk WNA, serta menunjukkan surat keterangan sehat dari fasilitas kesehatan resmi.",
      "Pendaki diperbolehkan naik mulai pukul 07.00 hingga 15.00 WITA, dan wajib keluar dari jalur pendakian paling lambat pukul 21.00 WITA.",
      "Pendaki dilarang melakukan pendakian seorang diri. Jika tidak memiliki teman mendaki, wajib didampingi oleh pemandu resmi. Pemandu dan porter yang ikut wajib memiliki surat izin dari pihak pengelola taman nasional.",
      "Pendaki berusia di bawah 17 tahun harus didampingi oleh orang dewasa dan menyerahkan surat izin tertulis dari orang tua atau wali.",
      "Perlengkapan wajib yang harus dibawa antara lain tenda, matras, sleeping bag, pakaian hangat, jas hujan, sepatu gunung, senter, makanan, dan air minum yang cukup.",
      "Semua pendaki harus membawa turun kembali sampahnya masing-masing dan dilarang meninggalkan sampah di area jalur atau camping ground. Pemeriksaan sampah dilakukan saat keluar jalur.",
      "Wadah makanan dan minuman harus menggunakan bahan yang dapat digunakan kembali. Dilarang membawa wadah sekali pakai seperti styrofoam, kaleng, atau botol plastik sekali pakai.",
      "Kuota pendakian dibatasi per hari untuk menjaga kelestarian alam. Pendaki yang datang tanpa mengikuti aturan kuota tidak akan diizinkan naik.",
      "Pendaki wajib menjaga etika dan kelestarian lingkungan, termasuk tidak merusak tumbuhan, tidak membunuh atau memberi makan satwa liar, tidak membuat api unggun sembarangan, dan tidak membawa bahan berbahaya seperti alkohol, narkoba, atau senjata tajam.",
      "Kebijakan zero waste diterapkan. Pendaki harus melaporkan barang-barang berpotensi menjadi sampah sejak awal dan memastikan jumlahnya sesuai saat kembali.",
      "Dalam keadaan darurat atau cuaca ekstrem, pendakian dapat ditutup sewaktu-waktu oleh petugas tanpa pemberitahuan sebelumnya demi keselamatan semua pihak.",
    ],
  },
  {
    id: "3",
    name: "Gunung Bromo",
    location: "Probolinggo",
    province: "Jawa Timur",
    coordinates: { lat: -7.942, lng: 112.953 },
    image: "https://upload.wikimedia.org/wikipedia/commons/4/47/Crater_of_Mount_Bromo%2C_Java%2C_Indonesia%2C_20220820_0540_9412.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/0/04/Bromo_and_Semeru_volcanoes%2C_Java%2C_Indonesia%2C_20220820_0717_9517.jpg",
    description:
      "Gunung Bromo adalah gunung berapi aktif di Jawa Timur dengan ketinggian 2.329 mdpl. Terkenal dengan pemandangan sunrise yang menakjubkan dan lautan pasir yang luas, Bromo menjadi salah satu destinasi wisata paling populer di Indonesia.",
    quota: "200 pendaki/hari",
    trails: "2 Jalur",
    available: "200/200",
    trailDetails: [
      {
        name: "Jalur Cemoro Lawang",
        description:
          "Jalur utama yang paling mudah diakses dengan kendaraan hingga area parkir, dilanjutkan trekking ringan ke kawah.",
        coordinates: { lat: -7.938, lng: 112.950 },
      },
      {
        name: "Jalur Wonokitri",
        description: "Jalur alternatif yang lebih menantang dengan pemandangan savana dan hutan yang indah.",
        coordinates: { lat: -7.897, lng: 112.850 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/e/eb/Bromo%2C_Java%2C_Indonesia%2C_20220820_0636_9502.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/47/Crater_of_Mount_Bromo%2C_Java%2C_Indonesia%2C_20220820_0540_9412.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/04/Bromo_and_Semeru_volcanoes%2C_Java%2C_Indonesia%2C_20220820_0717_9517.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5c/Crater_of_Mount_Bromo%2C_Java%2C_Indonesia%2C_20220820_0600_9460.jpg",
    ],
    bookingTerms: [
      "Pendakian hanya diperbolehkan melalui jalur resmi Cemoro Lawang dan Wonokitri.",
      "Wajib membawa identitas diri yang sah dan surat keterangan sehat.",
      "Jam operasional pendakian: 04.00 - 17.00 WIB.",
      "Dilarang mendekati kawah saat status gunung dalam kondisi waspada.",
      "Wajib menggunakan masker pelindung dari gas vulkanik.",
      "Dilarang bermalam di area kawah atau lautan pasir.",
      "Menjaga kebersihan dan tidak membuang sampah sembarangan.",
      "Mengikuti instruksi petugas dan guide lokal.",
    ],
  },
  {
    id: "4",
    name: "Gunung Semeru",
    location: "Lumajang",
    province: "Jawa Timur",
    coordinates: { lat: -8.108, lng: 112.922 },
    image: "https://upload.wikimedia.org/wikipedia/commons/9/95/Bromo%2C_Semeru%2C_Batok_-_view_of_Tengger_caldera%2C_East_Java%2C_Indonesia%2C_20220820_0709_9507.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Bromo_and_Semeru_volcanoes%2C_Java%2C_Indonesia%2C_20220820_0718_9524.jpg",
    description:
      "Gunung Semeru adalah gunung tertinggi di Pulau Jawa dengan ketinggian 3.676 mdpl. Dikenal sebagai Mahameru, gunung ini menawarkan tantangan pendakian yang menantang dengan pemandangan yang luar biasa indah.",
    quota: "80 pendaki/hari",
    trails: "2 Jalur",
    available: "80/80",
    trailDetails: [
      {
        name: "Jalur Ranu Pani",
        description: "Jalur utama yang dimulai dari Ranu Pani dengan pemandangan danau dan savana yang indah.",
        coordinates: { lat: -8.033, lng: 112.921 },
      },
      {
        name: "Jalur Watu Rejeng",
        description: "Jalur alternatif yang lebih menantang dengan medan berbatu dan tanjakan curam.",
        coordinates: { lat: -8.060, lng: 112.930 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/9/95/Bromo%2C_Semeru%2C_Batok_-_view_of_Tengger_caldera%2C_East_Java%2C_Indonesia%2C_20220820_0709_9507.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/Bromo_and_Semeru_volcanoes%2C_Java%2C_Indonesia%2C_20220820_0718_9524.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Mount_Bromo_at_sunrise%2C_showing_its_volcanoes_and_Mount_Semeru_%28background%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c0/Bromo_and_Semeru_volcanoes%2C_Java%2C_Indonesia%2C_20220820_0754_9543.jpg",
    ],
    bookingTerms: [
      "Pendakian hanya diperbolehkan melalui jalur resmi Ranu Pani dan Watu Rejeng.",
      "Wajib membawa surat keterangan sehat dan identitas diri yang sah.",
      "Pendakian minimal 3 hari 2 malam dengan persiapan fisik yang baik.",
      "Dilarang mendaki sendirian, minimal 3 orang atau dengan guide bersertifikat.",
      "Wajib membawa perlengkapan lengkap termasuk tenda 4 season dan sleeping bag.",
      "Dilarang mendekati kawah saat erupsi atau status waspada.",
      "Membawa turun semua sampah dan menjaga kelestarian alam.",
      "Mengikuti jalur yang telah ditentukan dan tidak merusak vegetasi.",
    ],
  },
  {
    id: "5",
    name: "Gunung Merbabu",
    location: "Magelang",
    province: "Jawa Tengah",
    coordinates: { lat: -7.454, lng: 110.440 },
    image: "https://upload.wikimedia.org/wikipedia/commons/5/59/Gunung_Merbabu_view.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Keindahan_di_antara_Gunung_Merbabu_dan_Gunung_Merapi.jpg",
    description:
      "Gunung Merbabu adalah gunung berapi yang sudah tidak aktif dengan ketinggian 3.145 mdpl. Terkenal dengan savana yang luas dan pemandangan sunrise yang memukau, cocok untuk pendaki pemula hingga berpengalaman.",
    quota: "150 pendaki/hari",
    trails: "4 Jalur",
    available: "150/150",
    trailDetails: [
      {
        name: "Jalur Selo",
        description: "Jalur paling populer dengan akses mudah dan pemandangan savana yang indah.",
        coordinates: { lat: -7.457, lng: 110.434 },
      },
      {
        name: "Jalur Wekas",
        description: "Jalur yang lebih menantang dengan hutan pinus dan pemandangan yang eksotis.",
        coordinates: { lat: -7.457, lng: 110.400 },
      },
      {
        name: "Jalur Thekelan",
        description: "Jalur alternatif dengan medan yang bervariasi dan pemandangan Gunung Merapi.",
        coordinates: { lat: -7.450, lng: 110.410 },
      },
      {
        name: "Jalur Cunthel",
        description: "Jalur yang jarang digunakan dengan tantangan lebih berat namun pemandangan yang menawan.",
        coordinates: { lat: -7.440, lng: 110.410 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Gunung_Merbabu_view.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/Keindahan_di_antara_Gunung_Merbabu_dan_Gunung_Merapi.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/85/Great_nature_green_at_Merbabu_Mount_-_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Gunung_Merbabu_via_Suwanting.jpg",
    ],
    bookingTerms: [
      "Pendakian diperbolehkan melalui jalur Selo, Wekas, Thekelan, dan Cunthel.",
      "Wajib membawa identitas diri dan surat keterangan sehat.",
      "Jam pendakian: 05.00 - 17.00 WIB.",
      "Dilarang membuat api unggun di area savana.",
      "Wajib camping di area yang telah ditentukan.",
      "Membawa perlengkapan camping yang memadai.",
      "Menjaga kebersihan dan membawa turun semua sampah.",
      "Tidak merusak tanaman dan ekosistem savana.",
    ],
  },
  {
    id: "6",
    name: "Gunung Prau",
    location: "Wonosobo",
    province: "Jawa Tengah",
    coordinates: { lat: -7.183, lng: 109.916 },
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Gunung_Prau%2C_Dieng%2C_Wonosobo%2C_05062017.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Pemandangan_dari_puncak_gunung_prau%2C_Dieng%2C_Wonosobo%2C_Jawa_Tengah%2C_04072015.jpg",
    description:
      "Gunung Prau adalah gunung dengan ketinggian 2.565 mdpl yang terkenal dengan hamparan bunga edelweis dan pemandangan sunrise yang spektakuler. Cocok untuk pendaki pemula dengan jalur yang relatif mudah.",
    quota: "200 pendaki/hari",
    trails: "3 Jalur",
    available: "200/200",
    trailDetails: [
      {
        name: "Jalur Dieng",
        description: "Jalur paling populer dan mudah dengan pemandangan Telaga Warna dan hamparan edelweis.",
        coordinates: { lat: -7.200, lng: 109.907 },
      },
      {
        name: "Jalur Patak Banteng",
        description: "Jalur alternatif dengan medan yang lebih menantang dan pemandangan yang berbeda.",
        coordinates: { lat: -7.211, lng: 109.913 },
      },
      {
        name: "Jalur Igirmranak",
        description: "Jalur yang jarang digunakan dengan akses melalui desa dan hutan pinus.",
        coordinates: { lat: -7.190, lng: 109.880 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Gunung_Prau%2C_Dieng%2C_Wonosobo%2C_05062017.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/Pemandangan_dari_puncak_gunung_prau%2C_Dieng%2C_Wonosobo%2C_Jawa_Tengah%2C_04072015.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/ff/Pagi_Hari_Di_Gunung_Prau.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Ombak_diatas_awan_dari_puncak_gunung_prau%2C_Dieng%2C_Wonosobo%2C_Jawa_Tengah%2C_04072015.jpg",
    ],
    bookingTerms: [
      "Pendakian diperbolehkan melalui jalur Dieng, Patak Banteng, dan Igirmranak.",
      "Wajib membawa identitas diri yang sah.",
      "Dilarang memetik bunga edelweis atau merusak vegetasi.",
      "Camping hanya diperbolehkan di area yang telah ditentukan.",
      "Membawa jaket tebal karena suhu dingin di malam hari.",
      "Menjaga kebersihan dan tidak membuang sampah sembarangan.",
      "Mengikuti jalur yang telah ditentukan.",
      "Menghormati budaya lokal dan masyarakat sekitar.",
    ],
  },
  {
    id: "7",
    name: "Gunung Merapi",
    location: "Sleman",
    province: "DI Yogyakarta",
    coordinates: { lat: -7.540, lng: 110.446 },
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Gunung_Merapi%2C_Yogyakarta.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Gunung_Merapi_-_Sawah_-_Perumahan.jpg",
    description:
      "Gunung Merapi adalah gunung berapi paling aktif di Indonesia dengan ketinggian 2.930 mdpl. Menawarkan tantangan pendakian yang menantang dengan pemandangan kawah aktif dan lava dome yang menakjubkan.",
    quota: "50 pendaki/hari",
    trails: "2 Jalur",
    available: "50/50",
    trailDetails: [
      {
        name: "Jalur Selo",
        description: "Jalur utama yang paling aman dengan pemandangan kawah dan monitoring ketat aktivitas vulkanik.",
        coordinates: { lat: -7.482, lng: 110.433 },
      },
      {
        name: "Jalur New Selo",
        description: "Jalur alternatif yang dibuka setelah erupsi dengan medan yang lebih menantang.",
        coordinates: { lat: -7.485, lng: 110.435 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/f/f2/Gunung_Merapi%2C_Yogyakarta.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/Gunung_Merapi_-_Sawah_-_Perumahan.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/cc/Gunung_Merapi_2025.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8e/Merapi_and_Cloud.jpg",
    ],
    bookingTerms: [
      "Pendakian hanya diperbolehkan saat status normal atau waspada level 1.",
      "Wajib didampingi guide bersertifikat dari BPPTKG.",
      "Membawa surat keterangan sehat dan asuransi perjalanan.",
      "Pendakian dibatasi hingga radius aman dari kawah aktif.",
      "Wajib menggunakan masker dan pelindung dari gas vulkanik.",
      "Dilarang bermalam di area berbahaya.",
      "Mengikuti instruksi petugas dan sistem peringatan dini.",
      "Siap dievakuasi sewaktu-waktu jika terjadi peningkatan aktivitas.",
    ],
  },
  {
    id: "8",
    name: "Gunung Lawu",
    location: "Karanganyar",
    province: "Jawa Tengah",
    coordinates: { lat: -7.625, lng: 111.192 },
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Langit_Puncak_Gunung_Lawu.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Mount_Lawu_viewed_from_Ngawi%2C_East_Java%2C_Indonesia%2C_Jun_14.jpg",
    description:
      "Gunung Lawu adalah gunung berapi yang sudah tidak aktif dengan ketinggian 3.265 mdpl. Terkenal dengan situs sejarah Candi Cetho dan Sukuh, serta pemandangan sunrise yang memukau dari puncak Hargo Dumilah.",
    quota: "120 pendaki/hari",
    trails: "3 Jalur",
    available: "120/120",
    trailDetails: [
      {
        name: "Jalur Cemoro Sewu",
        description: "Jalur paling populer dengan akses mudah dan pemandangan hutan cemara yang indah.",
        coordinates: { lat: -7.625, lng: 111.204 },
      },
      {
        name: "Jalur Cemoro Kandang",
        description: "Jalur alternatif dengan medan yang lebih menantang dan pemandangan yang berbeda.",
        coordinates: { lat: -7.624, lng: 111.199 },
      },
      {
        name: "Jalur Candi Cetho",
        description: "Jalur yang melewati situs bersejarah dengan nilai budaya dan spiritual yang tinggi.",
        coordinates: { lat: -7.612, lng: 111.163 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a5/Langit_Puncak_Gunung_Lawu.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5c/Mount_Lawu_viewed_from_Ngawi%2C_East_Java%2C_Indonesia%2C_Jun_14.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/47/Gunung_Lawu_dari_jauh.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/48/Menapak_Kontur_Lereng_Gunung_Lawu-.jpg",
    ],
    bookingTerms: [
      "Pendakian diperbolehkan melalui jalur Cemoro Sewu, Cemoro Kandang, dan Candi Cetho.",
      "Wajib membawa identitas diri dan surat keterangan sehat.",
      "Menghormati situs bersejarah dan tidak merusak peninggalan budaya.",
      "Dilarang membuat api unggun di area hutan cemara.",
      "Membawa perlengkapan hangat karena suhu dingin di malam hari.",
      "Camping hanya di area yang telah ditentukan.",
      "Menjaga kebersihan dan membawa turun semua sampah.",
      "Tidak mengganggu aktivitas spiritual masyarakat lokal.",
    ],
  },
  {
    id: "9",
    name: "Gunung Ijen",
    location: "Banyuwangi",
    province: "Jawa Timur",
    coordinates: { lat: -8.058, lng: 114.242 },
    image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Kawah_Ijen%2C_Java%2C_Indonesia%2C_20220821_0608_9712.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/0/05/Crater_of_Kawah_Ijen_volcano%2C_East_Java%2C_Indonesia%2C_20220821_0611_9726.jpg",
    description:
      "Gunung Ijen adalah gunung berapi dengan ketinggian 2.443 mdpl yang terkenal dengan fenomena blue fire dan danau kawah belerang terbesar di dunia. Menawarkan pengalaman pendakian yang unik dan menakjubkan.",
    quota: "100 pendaki/hari",
    trails: "2 Jalur",
    available: "100/100",
    trailDetails: [
      {
        name: "Jalur Paltuding",
        description: "Jalur utama yang paling mudah diakses dengan pemandangan kawah belerang yang spektakuler.",
        coordinates: { lat: -8.069, lng: 114.234 },
      },
      {
        name: "Jalur Sempol",
        description: "Jalur alternatif yang lebih panjang dengan pemandangan perkebunan kopi dan hutan.",
        coordinates: { lat: -8.026, lng: 114.199 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/9/96/Kawah_Ijen%2C_Java%2C_Indonesia%2C_20220821_0608_9712.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/05/Crater_of_Kawah_Ijen_volcano%2C_East_Java%2C_Indonesia%2C_20220821_0611_9726.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Kawah-Ijen_Indonesia_Acidious-Lake-at_the-floor-of-the-crater-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/26/Interior_of_Kawah_Ijen_volcano_crater%2C_20220821_0547_9699.jpg",
    ],
    bookingTerms: [
      "Pendakian diperbolehkan melalui jalur Paltuding dan Sempol.",
      "Wajib menggunakan masker gas untuk melindungi dari gas belerang.",
      "Pendakian blue fire dimulai pukul 01.00 - 05.00 WIB.",
      "Dilarang turun ke kawah tanpa guide berpengalaman.",
      "Membawa senter dan perlengkapan safety yang memadai.",
      "Tidak menyentuh atau mengambil belerang dari kawah.",
      "Menjaga jarak aman dari area penambangan belerang.",
      "Mengikuti instruksi petugas dan guide lokal.",
    ],
  },
  {
    id: "10",
    name: "Gunung Kerinci",
    location: "Kerinci",
    province: "Jambi",
    coordinates: { lat: -1.697, lng: 101.264 },
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Gunung_Kerinci_dari_kebun_teh.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Gunung_Kerinci_dari_tempat_wisata_Swarga_4.jpg",
    description:
      "Gunung Kerinci adalah gunung tertinggi di Sumatera dengan ketinggian 3.805 mdpl. Terletak di Taman Nasional Kerinci Seblat, menawarkan keanekaragaman hayati yang luar biasa dan tantangan pendakian yang menantang.",
    quota: "60 pendaki/hari",
    trails: "2 Jalur",
    available: "60/60",
    trailDetails: [
      {
        name: "Jalur Kersik Tuo",
        description:
          "Jalur utama yang paling populer dengan akses melalui Desa Kersik Tuo dan pemandangan hutan tropis.",
        coordinates: { lat: -1.767, lng: 101.281 },
      },
      {
        name: "Jalur Pelompek",
        description: "Jalur alternatif yang lebih menantang dengan medan yang berat dan pemandangan yang eksotis.",
        coordinates: { lat: -1.757, lng: 101.290 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/e/ee/Gunung_Kerinci_dari_kebun_teh.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e1/Gunung_Kerinci_dari_tempat_wisata_Swarga_4.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/fc/Gunung_Kerinci_dari_kebun_teh_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f8/Kerinci_smoke.jpg",
    ],
    bookingTerms: [
      "Pendakian hanya diperbolehkan dengan izin dari TNKS (Taman Nasional Kerinci Seblat).",
      "Wajib didampingi guide lokal yang bersertifikat.",
      "Pendakian minimal 4 hari 3 malam dengan persiapan fisik yang baik.",
      "Membawa perlengkapan camping lengkap dan makanan yang cukup.",
      "Tidak mengganggu satwa liar dan menjaga kelestarian hutan.",
      "Dilarang berburu atau mengambil flora fauna.",
      "Membawa turun semua sampah dan menjaga kebersihan alam.",
      "Mengikuti jalur yang telah ditentukan dan tidak tersesat.",
    ],
  },
  {
    id: "11",
    name: "Gunung Batur",
    location: "Bangli",
    province: "Bali",
    coordinates: { lat: -8.242, lng: 115.375 },
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Gunung_Batur%2C_Kintamani_MWD_15.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Bangly-Regency_Bali_Indonesia_Lake-Batur-01.jpg",
    description:
      "Gunung Batur adalah gunung berapi aktif dengan ketinggian 1.717 mdpl yang terkenal dengan pemandangan sunrise di atas Danau Batur. Pendakian yang relatif mudah dan cocok untuk pemula.",
    quota: "300 pendaki/hari",
    trails: "3 Jalur",
    available: "300/300",
    trailDetails: [
      {
        name: "Jalur Toya Bungkah",
        description: "Jalur paling populer dan mudah dengan pemandangan danau dan sunrise yang spektakuler.",
        coordinates: { lat: -8.238, lng: 115.396 },
      },
      {
        name: "Jalur Pura Jati",
        description: "Jalur alternatif yang melewati pura dengan nilai spiritual dan pemandangan yang indah.",
        coordinates: { lat: -8.253, lng: 115.390 },
      },
      {
        name: "Jalur Songan",
        description: "Jalur yang jarang digunakan dengan akses melalui desa dan pemandangan yang berbeda.",
        coordinates: { lat: -8.219, lng: 115.386 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/f/fb/Gunung_Batur%2C_Kintamani_MWD_15.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Bangly-Regency_Bali_Indonesia_Lake-Batur-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/82/Gunung_Batur_Kintamani_Bali.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e7/Kintamani_-_Gunung_Batur_-_49817610343.jpg",
    ],
    bookingTerms: [
      "Pendakian diperbolehkan melalui jalur Toya Bungkah, Pura Jati, dan Songan.",
      "Wajib didampingi guide lokal untuk keamanan.",
      "Pendakian sunrise dimulai pukul 03.30 - 06.00 WITA.",
      "Menghormati tempat suci dan budaya lokal Bali.",
      "Membawa jaket hangat untuk cuaca dingin di pagi hari.",
      "Tidak merusak lingkungan dan menjaga kebersihan.",
      "Mengikuti instruksi guide dan petugas setempat.",
      "Membayar retribusi sesuai ketentuan yang berlaku.",
    ],
  },
  {
    id: "12",
    name: "Gunung Papandayan",
    location: "Garut",
    province: "Jawa Barat",
    coordinates: { lat: -7.319, lng: 107.733 },
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Kawah_Mas%2C_Gunung_Papandayan%2C_Garut.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/1/15/Kabut_dan_Savana_Tegal_Alun%2C_Gunung_Papandayan%2C_Garut.jpg",
    description:
      "Gunung Papandayan adalah gunung berapi dengan ketinggian 2.665 mdpl yang terkenal dengan kawah aktif dan fenomena geothermal. Menawarkan pemandangan alam yang unik dengan aktivitas vulkanik yang masih aktif.",
    quota: "150 pendaki/hari",
    trails: "2 Jalur",
    available: "150/150",
    trailDetails: [
      {
        name: "Jalur Pondok Salada",
        description: "Jalur utama yang mudah diakses dengan pemandangan kawah dan aktivitas geothermal.",
        coordinates: { lat: -7.324, lng: 107.730 },
      },
      {
        name: "Jalur Cisurupan",
        description: "Jalur alternatif yang lebih menantang dengan pemandangan hutan dan perkebunan teh.",
        coordinates: { lat: -7.340, lng: 107.730 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/3/3a/Kawah_Mas%2C_Gunung_Papandayan%2C_Garut.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/15/Kabut_dan_Savana_Tegal_Alun%2C_Gunung_Papandayan%2C_Garut.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/84/Istirahat_di_antara_Rerumputan_Tegal_Alun%2C_Gunung_Papandayan%2C_Garut.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Papandayan_Volcano.jpg",
    ],
    bookingTerms: [
      "Pendakian diperbolehkan melalui jalur Pondok Salada dan Cisurupan.",
      "Wajib menggunakan masker untuk melindungi dari gas vulkanik.",
      "Dilarang mendekati kawah aktif saat status waspada.",
      "Membawa perlengkapan safety dan P3K.",
      "Tidak menyentuh atau mengambil material vulkanik.",
      "Menjaga jarak aman dari area geothermal.",
      "Mengikuti jalur yang telah ditentukan.",
      "Membawa turun semua sampah dan menjaga kebersihan.",
    ],
  },
  {
    id: "13",
    name: "Gunung Gede Pangrango",
    location: "Bogor",
    province: "Jawa Barat",
    coordinates: { lat: -6.789, lng: 106.980 },
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Gunung_Gede_Pangrango.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/3/34/Mount_Gede-Pangrango_Aerial.jpg",
    description:
      "Gunung Gede Pangrango adalah kompleks gunung kembar dengan ketinggian 2.958 mdpl (Gede) dan 3.019 mdpl (Pangrango). Terletak di Taman Nasional Gede Pangrango dengan keanekaragaman hayati yang tinggi.",
    quota: "100 pendaki/hari",
    trails: "3 Jalur",
    available: "100/100",
    trailDetails: [
      {
        name: "Jalur Gunung Putri",
        description: "Jalur paling populer dengan akses mudah dan pemandangan air terjun Cibeureum.",
        coordinates: { lat: -6.760, lng: 106.990 },
      },
      {
        name: "Jalur Salabintana",
        description: "Jalur yang lebih menantang dengan medan yang berat dan pemandangan hutan yang lebat.",
        coordinates: { lat: -6.820, lng: 106.950 },
      },
      {
        name: "Jalur Putri",
        description: "Jalur alternatif dengan akses melalui Sukabumi dan pemandangan yang berbeda.",
        coordinates: { lat: -6.750, lng: 107.020 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Gunung_Gede_Pangrango.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/34/Mount_Gede-Pangrango_Aerial.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/42/Gede-Pangrango_seen_from_Cibadak.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3d/Gunung_Pangrango_Terlihat_Dari_Puncak_Gunung_Gede_di_Taman_Nasional_Gunung_Gede_Pangrango.jpg",
    ],
    bookingTerms: [
      "Pendakian hanya diperbolehkan dengan izin dari Taman Nasional Gede Pangrango.",
      "Wajib registrasi dan membayar tiket masuk taman nasional.",
      "Pendakian maksimal 3 hari 2 malam.",
      "Dilarang berburu atau mengambil flora fauna.",
      "Camping hanya di area yang telah ditentukan.",
      "Membawa perlengkapan camping yang memadai.",
      "Menjaga kebersihan dan membawa turun semua sampah.",
      "Mengikuti jalur yang telah ditentukan dan tidak merusak vegetasi.",
    ],
  },
  {
    id: "14",
    name: "Gunung Ciremai",
    location: "Cirebon",
    province: "Jawa Barat",
    coordinates: { lat: -6.892, lng: 108.408 },
    image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Gunung_Ciremai_pada_sore_hari.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Mount_Ciremai%2C_West_Java%2C_Indonesia.jpg",
    description:
      "Gunung Ciremai adalah gunung tertinggi di Jawa Barat dengan ketinggian 3.078 mdpl. Terletak di Taman Nasional Gunung Ciremai, menawarkan keanekaragaman hayati dan pemandangan yang menakjubkan.",
    quota: "80 pendaki/hari",
    trails: "4 Jalur",
    available: "80/80",
    trailDetails: [
      {
        name: "Jalur Linggarjati",
        description: "Jalur paling populer dengan akses mudah dan pemandangan hutan yang indah.",
        coordinates: { lat: -6.840, lng: 108.420 },
      },
      {
        name: "Jalur Apuy",
        description: "Jalur yang lebih menantang dengan medan yang berat dan pemandangan yang eksotis.",
        coordinates: { lat: -6.890, lng: 108.360 },
      },
      {
        name: "Jalur Palutungan",
        description: "Jalur alternatif dengan akses melalui Kuningan dan pemandangan perkebunan.",
        coordinates: { lat: -6.925, lng: 108.440 },
      },
      {
        name: "Jalur Cigugur",
        description: "Jalur yang jarang digunakan dengan tantangan lebih berat namun pemandangan yang menawan.",
        coordinates: { lat: -6.930, lng: 108.430 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Gunung_Ciremai_pada_sore_hari.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Mount_Ciremai%2C_West_Java%2C_Indonesia.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Mount_Ciremai_from_Cirebon.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/81/Ciremai_dari_teduhnya_tabu_buya.jpg",
    ],
    bookingTerms: [
      "Pendakian hanya diperbolehkan dengan izin dari Taman Nasional Gunung Ciremai.",
      "Wajib registrasi dan membayar tiket masuk taman nasional.",
      "Pendakian maksimal 4 hari 3 malam.",
      "Dilarang berburu atau mengambil flora fauna.",
      "Membawa guide lokal untuk keamanan.",
      "Camping hanya di area yang telah ditentukan.",
      "Menjaga kebersihan dan membawa turun semua sampah.",
      "Tidak merusak vegetasi dan ekosistem hutan.",
    ],
  },
  {
    id: "15",
    name: "Gunung Raung",
    location: "Banyuwangi",
    province: "Jawa Timur",
    coordinates: { lat: -8.125, lng: 114.042 },
    image: "https://upload.wikimedia.org/wikipedia/commons/8/83/Raung_Mountain_View.jpg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Raung_-_view_from_Kawah_Ijen%2C_East_Java%2C_Indonesia%2C_20220821_0648_9786.jpg",
    description:
      "Gunung Raung adalah gunung berapi dengan ketinggian 3.344 mdpl yang terkenal dengan kawah terbesar di Jawa Timur. Menawarkan tantangan pendakian yang berat dengan pemandangan kawah yang spektakuler.",
    quota: "50 pendaki/hari",
    trails: "2 Jalur",
    available: "50/50",
    trailDetails: [
      {
        name: "Jalur Sumberwringin",
        description: "Jalur utama yang paling populer dengan akses melalui perkebunan kopi dan hutan.",
        coordinates: { lat: -8.050, lng: 114.030 },
      },
      {
        name: "Jalur Kalibaru",
        description: "Jalur alternatif yang lebih menantang dengan medan yang berat dan pemandangan yang berbeda.",
        coordinates: { lat: -8.130, lng: 113.980 },
      },
    ],
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/commons/8/83/Raung_Mountain_View.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d7/Raung_-_view_from_Kawah_Ijen%2C_East_Java%2C_Indonesia%2C_20220821_0648_9786.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6e/Raung_-_view_from_Kawah_Ijen%2C_East_Java%2C_Indonesia%2C_20220821_0643_9778.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/Jalur_pendakian_gunung_raung_%285%29.jpg",
    ],
    bookingTerms: [
      "Pendakian hanya diperbolehkan saat status normal atau waspada level 1.",
      "Wajib didampingi guide lokal yang berpengalaman.",
      "Pendakian minimal 4 hari 3 malam dengan persiapan fisik yang baik.",
      "Membawa perlengkapan camping lengkap dan makanan yang cukup.",
      "Dilarang mendekati kawah saat aktivitas vulkanik meningkat.",
      "Tidak mengganggu satwa liar dan menjaga kelestarian hutan.",
      "Membawa turun semua sampah dan menjaga kebersihan alam.",
      "Mengikuti jalur yang telah ditentukan dan tidak tersesat.",
    ],
  },
  {
    id: "16",
    name: "Gunung Buthak",
    location: "Malang",
    province: "Jawa Timur",
    coordinates: { lat: -7.867, lng: 112.517 },
    image: "",
    heroImage: "",
    description:
      "Gunung Butak adalah sebuah gunung berapi kerucut yang terletak di perbatasan Kabupaten Malang dan Kabupaten Blitar dalam wilayah Provinsi Jawa Timur, Indonesia.",
    quota: "300 pendaki/hari",
    trails: "2 Jalur",
    available: "100/300",
    trailDetails: [
      {
        name: "Jalur Panderman",
        description: "Jalur yang paling populer dengan pemandangan sabana yang indah.",
        coordinates: { lat: -7.870, lng: 112.510 },
      },
      {
        name: "Jalur Sirah Kencong",
        description: "Jalur yang di mulai perkebunan teh sirah kencong.",
        coordinates: { lat: -7.950, lng: 112.530 },
      },
    ],
    galleryImages: [
      "",
      "",
      "",
    ],
    bookingTerms: [
      "Pendakian hanya diperbolehkan saat status normal atau waspada level 1.",
      "Wajib didampingi guide lokal yang berpengalaman.",
      "Pendakian minimal 4 hari 3 malam dengan persiapan fisik yang baik.",
      "Membawa perlengkapan camping lengkap dan makanan yang cukup.",
      "Dilarang mendekati kawah saat aktivitas vulkanik meningkat.",
      "Tidak mengganggu satwa liar dan menjaga kelestarian hutan.",
      "Membawa turun semua sampah dan menjaga kebersihan alam.",
      "Mengikuti jalur yang telah ditentukan dan tidak tersesat.",
    ],
  },
]


export function getMountainById(id: string): Mountain | undefined {
  return mountainsData.find((mountain) => mountain.id === id)
}

export function getAllMountains(): Mountain[] {
  return mountainsData
}
