'use client';
import type React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const ContactPage: React.FC = () => {
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
                Hubungi Kami
              </h1>
              <p className="text-lg font-normal leading-7 text-global-4 font-plus-jakarta max-w-[800px]">
                Kami siap membantu Anda dengan segala pertanyaan dan kebutuhan pendakian
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="w-full mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold leading-[39px] text-global-1 font-plus-jakarta mb-4">
                Informasi Kontak
              </h2>
              <div className="w-16 h-1 bg-global-3 mx-auto mb-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Address */}
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-global-3 rounded-full mb-6 mx-auto">
                  <MapPin className="w-8 h-8 text-global-4" />
                </div>
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Alamat
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Jl. Keputih Tegal Timur No.67 Keputih, Kec. Sukolilo, Surabaya, Keputih, Kec.
                  Sukolilo, Surabaya, Jawa Timur, Indonesia
                </p>
              </div>

              {/* Phone */}
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-global-3 rounded-full mb-6 mx-auto">
                  <Phone className="w-8 h-8 text-global-4" />
                </div>
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Telepon
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  +62 21 1234 5678
                  <br />
                  +62 812 3456 7890
                </p>
              </div>

              {/* Email */}
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-global-3 rounded-full mb-6 mx-auto">
                  <Mail className="w-8 h-8 text-global-4" />
                </div>
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Email
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  info@munggahwae.com
                  <br />
                  support@munggahwae.com
                </p>
              </div>

              {/* Business Hours */}
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-global-3 rounded-full mb-6 mx-auto">
                  <Clock className="w-8 h-8 text-global-4" />
                </div>
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Jam Operasional
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Senin - Jumat: 08:00 - 17:00 WIB
                  <br />
                  Sabtu - Minggu: 09:00 - 15:00 WIB
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="w-full mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold leading-[39px] text-global-1 font-plus-jakarta mb-4">
                Pertanyaan Umum
              </h2>
              <div className="w-16 h-1 bg-global-3 mx-auto mb-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* FAQ 1 */}
              <div className="bg-global-2 p-6 rounded-xl shadow-lg border border-global-3">
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Bagaimana cara memesan tiket pendakian?
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Anda dapat memesan tiket melalui platform kami dengan memilih gunung tujuan,
                  menentukan tanggal, dan melengkapi data pendaki. Setelah itu, lanjutkan ke proses
                  pembayaran.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="bg-global-2 p-6 rounded-xl shadow-lg border border-global-3">
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Apakah data saya aman saat menggunakan Munggahwae?
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Kami menjaga kerahasiaan dan keamanan data pengguna sesuai dengan kebijakan
                  privasi yang berlaku. Data Anda tidak akan dibagikan ke pihak ketiga tanpa izin.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="bg-global-2 p-6 rounded-xl shadow-lg border border-global-3">
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Apakah saya bisa menghubungi pihak pengelola gunung langsung?
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Anda bisa menghubungi pihak pengelola melalui kontak yang tersedia.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="bg-global-2 p-6 rounded-xl shadow-lg border border-global-3">
                <h3 className="text-xl font-bold leading-[26px] text-global-1 font-plus-jakarta mb-4">
                  Apa yang terjadi jika saya tidak melakukan pembayaran tepat waktu?
                </h3>
                <p className="text-base font-normal leading-7 text-global-2 font-plus-jakarta">
                  Pesanan yang belum dibayar dalam batas waktu yang ditentukan akan otomatis
                  dibatalkan oleh sistem, dan slot pendakian akan tersedia kembali untuk pengguna
                  lain.
                </p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold leading-[39px] text-global-1 font-plus-jakarta mb-4">
                Lokasi Kantor Kami
              </h2>
              <div className="w-16 h-1 bg-global-3 mx-auto"></div>
            </div>

            <div className="h-[400px] rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1026.747299936001!2d112.80807769427821!3d-7.291877808829263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fb82632356fd%3A0x6d4c93a5f1a35485!2sKuliner%20Keputih%20Tegal%20Timur!5e1!3m2!1sid!2sid!4v1750673197121!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="w-full">
            <div className="bg-global-4 p-12 rounded-xl text-center">
              <h2 className="text-3xl font-bold leading-[39px] text-global-4 font-plus-jakarta mb-4">
                Ikuti Media Sosial Kami
              </h2>
              <p className="text-lg font-normal leading-7 text-global-4 font-plus-jakarta mb-8 max-w-[600px] mx-auto">
                Dapatkan update terbaru tentang kondisi gunung, tips pendakian, dan promo menarik
              </p>

              <div className="flex justify-center space-x-6">
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-global-3 rounded-full hover:bg-opacity-80 transition-all"
                >
                  <Instagram className="w-6 h-6 text-global-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-global-3 rounded-full hover:bg-opacity-80 transition-all"
                >
                  <Facebook className="w-6 h-6 text-global-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-global-3 rounded-full hover:bg-opacity-80 transition-all"
                >
                  <Twitter className="w-6 h-6 text-global-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-global-3 rounded-full hover:bg-opacity-80 transition-all"
                >
                  <Youtube className="w-6 h-6 text-global-4" />
                </a>
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

export default ContactPage;
