import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
        <WifiOff className="w-6 h-6" />
      </div>
      <h1 className="text-lg font-bold text-global-1 mb-2">Sedang Offline</h1>
      <p className="text-sm text-gray-500 max-w-sm">
        Halaman ini belum tersimpan untuk dibuka tanpa koneksi. Buka halaman rencana pendakianmu sekali saat masih
        ada sinyal, lalu bisa diakses lagi tanpa internet.
      </p>
    </div>
  );
}
