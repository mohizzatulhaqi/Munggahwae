'use client';
import type React from 'react';
import Image from 'next/image';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const AboutPage: React.FC = () => {
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
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url(/placeholder.svg?height=400&width=1200)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-5xl font-extrabold leading-[61px] text-global-4 font-plus-jakarta mb-4">
                Tentang Munggahwae
              </h1>
              <p className="text-lg font-normal leading-7 text-global-4 font-plus-jakarta max-w-[800px]">
                Platform terpercaya untuk menjelajahi keindahan gunung-gunung Indonesia
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="w-full mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold leading-[39px] text-global-1 font-plus-jakarta mb-4">
                Cerita Kami
              </h2>
              <div className="w-16 h-1 bg-global-3 mx-auto mb-8"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta mb-6">
                  Munggahwae hadir dari keresahan banyak pendaki yang mengalami kesulitan saat ingin
                  mendapatkan tiket resmi pendakian gunung. Proses SIMAKSI yang rumit, informasi
                  yang tersebar di berbagai platform, serta ketidakpastian kuota sering kali menjadi
                  hambatan dalam merencanakan pendakian.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta mb-6">
                  Kami melihat pentingnya menghadirkan solusi digital yang menyederhanakan proses
                  ini. Dengan Munggahwae, calon pendaki kini bisa mengakses informasi lengkap dan
                  terkini tentang gunung-gunung di Indonesia, serta melakukan pemesanan tiket
                  pendakian secara mudah, cepat, dan terpercaya — semuanya dalam satu platform.
                </p>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Kami percaya bahwa pengalaman mendaki yang menyenangkan berawal dari proses
                  persiapan yang efisien. Karena itu, Munggahwae berkomitmen menjadi jembatan antara
                  para pendaki dengan pengelola gunung, agar setiap pendakian dapat dimulai
                  tanpa hambatan.
                </p>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Mountain Story"
                  width={500}
                  height={400}
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="w-full mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vision */}
              <div className="bg-global-4 p-8 rounded-xl shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 bg-global-3 rounded-full mb-6 mx-auto">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="Vision Icon"
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="text-2xl font-bold leading-[31px] text-global-4   font-plus-jakarta mb-4 text-center">
                  Visi Kami
                </h3>
                <p className="text-base font-normal leading-7 text-global-4 font-plus-jakarta text-center">
                  Menjadi platform utama yang menghubungkan setiap pencinta alam dengan keindahan
                  gunung-gunung Indonesia, menciptakan pengalaman pendakian yang aman, berkesan, dan
                  berkelanjutan.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-global-4 p-8 rounded-xl shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 bg-global-3 rounded-full mb-6 mx-auto">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="Mission Icon"
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="text-2xl font-bold leading-[31px] text-global-4 font-plus-jakarta mb-4 text-center">
                  Misi Kami
                </h3>
                <p className="text-base font-normal leading-7 text-global-4 font-plus-jakarta text-center">
                  Menyediakan layanan pemesanan tiket pendakian yang mudah dan terpercaya,
                  memberikan informasi akurat tentang setiap gunung, serta mendukung pelestarian
                  alam Indonesia.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="w-full mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold leading-[39px] text-global-1 font-plus-jakarta mb-4">
                Nilai-Nilai Kami
              </h2>
              <div className="w-16 h-1 bg-global-3 mx-auto mb-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Keamanan */}
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-global-3 rounded-full mb-6 mx-auto">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Safety Icon"
                    width={40}
                    height={40}
                  />
                </div>
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Keamanan
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Keselamatan pendaki adalah prioritas utama kami. Setiap informasi dan layanan yang
                  kami berikan selalu mengutamakan aspek keamanan.
                </p>
              </div>

              {/* Kepercayaan */}
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-global-3 rounded-full mb-6 mx-auto">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Trust Icon"
                    width={40}
                    height={40}
                  />
                </div>
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Kepercayaan
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Kami membangun kepercayaan melalui transparansi, kejujuran, dan komitmen untuk
                  memberikan layanan terbaik kepada setiap pengguna.
                </p>
              </div>

              {/* Keberlanjutan */}
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-global-3 rounded-full mb-6 mx-auto">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Sustainability Icon"
                    width={40}
                    height={40}
                  />
                </div>
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Keberlanjutan
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Kami berkomitmen untuk mendukung pelestarian alam dan lingkungan melalui praktik
                  pendakian yang bertanggung jawab.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="w-full mb-16">
            <div className="bg-global-4 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold leading-[39px] text-global-4 font-plus-jakarta mb-8">
                Pencapaian Kami
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-4xl font-extrabold leading-[52px] text-global-4 font-plus-jakarta mb-2">
                    150+
                  </p>
                  <p className="text-base font-normal leading-6 text-global-4 font-plus-jakarta">
                    Gunung Terdaftar
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold leading-[52px] text-global-4 font-plus-jakarta mb-2">
                    10K+
                  </p>
                  <p className="text-base font-normal leading-6 text-global-4 font-plus-jakarta">
                    Pendaki Terlayani
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold leading-[52px] text-global-4 font-plus-jakarta mb-2">
                    34
                  </p>
                  <p className="text-base font-normal leading-6 text-global-4 font-plus-jakarta">
                    Provinsi Terjangkau
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold leading-[52px] text-global-4 font-plus-jakarta mb-2">
                    99%
                  </p>
                  <p className="text-base font-normal leading-6 text-global-4 font-plus-jakarta">
                    Tingkat Kepuasan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="w-full">
            <div className="text-center bg-global-4 p-12 rounded-xl">
              <h2 className="text-3xl font-bold leading-[39px] text-global-4 font-plus-jakarta mb-4">
                Siap Memulai Petualanganmu?
              </h2>
              <p className="text-lg font-normal leading-7 text-global-4 font-plus-jakarta mb-8 max-w-[600px] mx-auto">
                Bergabunglah dengan ribuan pendaki lainnya yang telah mempercayai Munggahwae untuk
                petualangan gunung mereka.
              </p>
              <button className="bg-[#67AD8D] text-global-4 font-bold py-4 px-8 rounded-xl transition-all font-plus-jakarta text-lg">
                Jelajahi Gunung Sekarang
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
