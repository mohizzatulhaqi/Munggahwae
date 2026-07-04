'use client';
import type React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-global-2">
      <div className="flex flex-col flex-1 bg-global-1">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex flex-col items-center w-full max-w-[1200px] mx-auto px-4 py-8">
          {/* Hero Section */}
          <div
            className="relative flex flex-col w-full h-[400px] rounded-xl overflow-hidden mb-12"
            style={{
              background: 'linear-gradient(135deg, #0FBD66 0%, #05603A 100%)',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-5xl font-extrabold leading-[61px] text-global-4 font-plus-jakarta mb-4">
                Kebijakan Privasi
              </h1>
              <p className="text-lg font-normal leading-7 text-global-4 font-plus-jakarta max-w-[800px]">
                Pelajari bagaimana MunggahWae melindungi dan menggunakan data pribadi Anda saat
                menggunakan layanan kami
              </p>
            </div>
          </div>

          {/* Privacy Policy Content */}
          <div className="w-full space-y-12">
            {/* Section 1: Informasi yang Kami Kumpulkan */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                1. Informasi yang Kami Kumpulkan
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Kami mengumpulkan berbagai jenis informasi pribadi untuk memberikan layanan yang
                  optimal kepada Anda, termasuk:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Data Identitas:</span> Nama lengkap,
                    alamat email, nomor telepon, dan tanggal lahir
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Data Transaksi:</span> Informasi
                    pemesanan, metode pembayaran, dan riwayat transaksi
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Data Teknis:</span> Alamat IP, jenis
                    perangkat, browser, dan aktivitas penggunaan platform
                  </li>
                </ul>
              </div>
            </div>
            {/* Section 2: Penggunaan Informasi */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                2. Penggunaan Informasi
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Data yang kami kumpulkan digunakan untuk berbagai tujuan yang sah, antara lain:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Memproses dan mengelola pemesanan tiket pendakian
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Memberikan layanan pelanggan dan dukungan teknis
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Mengirimkan informasi penting tentang pesanan dan layanan
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Menganalisis dan meningkatkan kualitas platform kami
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Mengirimkan promosi dan penawaran khusus (dengan persetujuan Anda)
                  </li>
                </ul>
              </div>
            </div>
            {/* Section 3: Perlindungan Data */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                3. Perlindungan Data
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Keamanan data pribadi Anda adalah prioritas utama kami. Kami menerapkan berbagai
                  langkah keamanan, meliputi:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Enkripsi data selama transmisi dan penyimpanan
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Sistem keamanan berlapis untuk melindungi server dan database
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Kontrol akses yang ketat untuk tim internal
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Pemantauan aktivitas mencurigakan secara real-time
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Backup data berkala untuk mencegah kehilangan informasi
                  </li>
                </ul>
              </div>
            </div>
            {/* Section 4: Berbagi Informasi dengan Pihak Ketiga */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                4. Berbagi Informasi dengan Pihak Ketiga
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Kami menghargai privasi Anda dan tidak menjual atau menyewakan data pribadi kepada
                  pihak ketiga. Namun, kami dapat membagikan informasi dalam situasi tertentu:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Penyedia Layanan:</span> Untuk
                    keperluan pembayaran, pengiriman email, dan layanan teknis
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Pengelola Gunung:</span> Informasi
                    yang diperlukan untuk validasi tiket dan keamanan pendakian
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Kepatuhan Hukum:</span> Ketika diminta
                    oleh otoritas yang berwenang sesuai peraturan
                  </li>
                </ul>
              </div>
            </div>
            {/* Section 5: Cookie dan Teknologi Pelacakan */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                5. Cookie dan Teknologi Pelacakan
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Platform kami menggunakan cookie dan teknologi serupa untuk meningkatkan
                  pengalaman pengguna. Jenis cookie yang kami gunakan:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Cookie Esensial:</span> Diperlukan
                    untuk fungsi dasar platform
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Cookie Fungsional:</span> Menyimpan
                    preferensi dan pengaturan Anda
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Cookie Analitik:</span> Membantu kami
                    memahami penggunaan platform
                  </li>
                </ul>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda.
                </p>
              </div>
            </div>
            {/* Section 6: Hak Pengguna */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                6. Hak Pengguna
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Sebagai pengguna, Anda memiliki berbagai hak terkait data pribadi Anda:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Hak Akses:</span> Meminta informasi
                    tentang data yang kami miliki
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Hak Pembetulan:</span> Memperbarui
                    atau mengoreksi data yang tidak akurat
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Hak Penghapusan:</span> Meminta
                    penghapusan data dalam kondisi tertentu
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Hak Portabilitas:</span> Meminta data
                    dalam format yang dapat dipindahkan
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    <span className="font-bold text-global-2">Hak Keberatan:</span> Menolak
                    pemrosesan data untuk tujuan tertentu
                  </li>
                </ul>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Untuk menggunakan hak-hak tersebut, silakan hubungi tim support kami melalui email
                  atau fitur kontak yang tersedia.
                </p>
              </div>
            </div>
            {/* Section 7: Penyimpanan Data */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                7. Penyimpanan Data
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Kami menyimpan data pribadi Anda selama diperlukan untuk memberikan layanan dan
                  memenuhi kewajiban hukum.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Data akun akan disimpan selama akun aktif, sedangkan data transaksi disimpan
                  sesuai dengan ketentuan perpajakan dan peraturan yang berlaku.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-Jakarta">
                  Setelah periode penyimpanan berakhir, data akan dihapus secara aman atau
                  dianonimkan.
                </p>
              </div>
            </div>
            {/* Section 8: Transfer Data Internasional */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                8. Transfer Data Internasional
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Dalam beberapa kasus, data Anda mungkin ditransfer ke server atau penyedia layanan
                  di luar Indonesia untuk keperluan operasional.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Kami memastikan bahwa setiap transfer data dilakukan dengan perlindungan yang
                  memadai dan sesuai dengan standar keamanan internasional.
                </p>
              </div>
            </div>
            {/* Section 9: Perubahan Kebijakan */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                9. Perubahan Kebijakan Privasi
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu untuk
                  mencerminkan perubahan dalam praktik atau peraturan yang berlaku.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Perubahan signifikan akan dikomunikasikan melalui:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Email ke alamat yang terdaftar di akun Anda
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Notifikasi di platform saat Anda mengakses layanan
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Pengumuman di website resmi kami
                  </li>
                </ul>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Penggunaan berkelanjutan platform setelah perubahan kebijakan dianggap sebagai
                  persetujuan terhadap kebijakan yang diperbarui.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
