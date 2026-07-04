'use client';
import type React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const TermsConditionsPage: React.FC = () => {
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
                Syarat & Ketentuan
              </h1>
              <p className="text-lg font-normal leading-7 text-global-4 font-plus-jakarta max-w-[800px]">
                Ketentuan penggunaan platform Munggahwae yang perlu Anda pahami sebelum menggunakan
                layanan kami
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="w-full space-y-12">
            {/* Section 1: Definisi */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                1. Definisi
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  <span className="font-bold text-global-2">"Pengguna"</span> adalah setiap individu
                  yang mengakses dan menggunakan platform Munggahwae.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  <span className="font-bold text-global-2">"Layanan"</span> mencakup semua fitur
                  yang disediakan oleh platform termasuk pemesanan tiket, informasi gunung, dan
                  layanan terkait lainnya.
                </p>
              </div>
            </div>

            {/* Section 2: Penerimaan Syarat */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                2. Penerimaan Syarat
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Dengan mengakses atau menggunakan platform Munggahwae, Anda menyatakan bahwa Anda
                  telah membaca, memahami, dan menyetujui untuk terikat dengan syarat dan ketentuan
                  ini.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Jika Anda tidak menyetujui syarat dan ketentuan ini, Anda tidak diperkenankan
                  untuk menggunakan platform kami.
                </p>
              </div>
            </div>

            {/* Section 3: Registrasi dan Akun */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                3. Registrasi dan Akun Pengguna
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Untuk menggunakan layanan tertentu, Anda perlu membuat akun dengan memberikan
                  informasi yang akurat dan lengkap.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi dan semua aktivitas
                  yang terjadi di bawah akun Anda.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Anda wajib memberitahu kami segera jika terjadi penggunaan akun yang tidak sah
                  atau pelanggaran keamanan lainnya.
                </p>
              </div>
            </div>

            {/* Section 4: Penggunaan Platform */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                4. Penggunaan Platform
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Platform ini hanya boleh digunakan untuk tujuan yang sah dan sesuai dengan
                  peraturan yang berlaku.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  <span className="font-bold text-global-2">Anda dilarang untuk:</span>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Menggunakan platform untuk aktivitas ilegal atau tidak sah
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Mengganggu atau merusak sistem keamanan platform
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Menyebarkan virus, malware, atau kode berbahaya lainnya
                  </li>
                  <li className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                    Melakukan pemesanan palsu atau menggunakan informasi yang tidak benar
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 5: Pemesanan dan Pembayaran */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                5. Pemesanan dan Pembayaran
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Semua pemesanan tiket pendakian tunduk pada ketersediaan dan persetujuan dari
                  pengelola gunung terkait.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Pembayaran harus dilakukan sesuai dengan metode yang tersedia dan dalam jangka
                  waktu yang ditentukan.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Harga yang tercantum sudah termasuk biaya layanan platform dan dapat berubah
                  sewaktu-waktu tanpa pemberitahuan sebelumnya.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Tiket yang telah dibeli tidak dapat dikembalikan kecuali dalam kondisi tertentu
                  yang telah ditetapkan oleh pengelola gunung.
                </p>
              </div>
            </div>

            {/* Section 6: Tanggung Jawab dan Risiko */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                6. Tanggung Jawab dan Risiko
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Pendakian gunung mengandung risiko yang melekat. Pengguna bertanggung jawab penuh
                  atas keselamatan diri selama melakukan aktivitas pendakian.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Munggahwae tidak bertanggung jawab atas cedera, kehilangan, atau kerusakan yang
                  terjadi selama pendakian.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Pengguna disarankan untuk memiliki asuransi perjalanan yang memadai sebelum
                  melakukan pendakian.
                </p>
              </div>
            </div>

            {/* Section 7: Privasi Data */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                7. Privasi dan Perlindungan Data
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi sesuai
                  dengan kebijakan privasi kami.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Data yang dikumpulkan akan digunakan untuk memberikan layanan terbaik dan tidak
                  akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.
                </p>
              </div>
            </div>

            {/* Section 8: Hak Kekayaan Intelektual */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                8. Hak Kekayaan Intelektual
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Semua konten, desain, logo, dan materi lainnya di platform ini adalah milik
                  Munggahwae dan dilindungi oleh hukum hak cipta.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Pengguna tidak diperkenankan untuk menyalin, memodifikasi, atau mendistribusikan
                  konten tanpa izin tertulis.
                </p>
              </div>
            </div>

            {/* Section 9: Perubahan Syarat */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                9. Perubahan Syarat dan Ketentuan
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Munggahwae berhak untuk mengubah atau memperbarui syarat dan ketentuan ini
                  sewaktu-waktu tanpa pemberitahuan sebelumnya.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Perubahan akan berlaku efektif setelah dipublikasikan di platform. Penggunaan
                  berkelanjutan platform setelah perubahan dianggap sebagai penerimaan terhadap
                  syarat yang diperbarui.
                </p>
              </div>
            </div>

            {/* Section 10: Penyelesaian Sengketa */}
            <div className="bg-global-2 p-8 rounded-xl shadow-lg border border-global-3">
              <h3 className="text-2xl font-bold leading-[31px] text-global-1 font-plus-jakarta mb-6">
                10. Penyelesaian Sengketa
              </h3>
              <div className="space-y-4">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Setiap sengketa yang timbul akan diselesaikan melalui musyawarah dan mediasi
                  terlebih dahulu.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui pengadilan
                  yang berwenang di Indonesia.
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

export default TermsConditionsPage;
