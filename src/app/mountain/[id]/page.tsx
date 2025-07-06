"use client"
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import MountainDetailPage from "@/components/pages/mountain-detail-page";

export default function MountainPage() {
  const params = useParams();
  const id = params?.id as string;
  const [mountain, setMountain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMountain = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/gunung/${id}`);
        const data = await res.json();
        if (data.success && data.mountain) {
          // Mapping data API ke props yang dibutuhkan komponen detail
          setMountain({
            id: data.mountain.id,
            name: data.mountain.nama,
            kuota: data.mountain.kuotaPerHari,
            deskripsi: data.mountain.deskripsi,
            urlGambar: data.mountain.urlGambar || '/placeholder.svg',
            jalur: Array.isArray(data.mountain.jalur) ? data.mountain.jalur : [],
            status: data.mountain.status, // Atur sesuai kebutuhan
            galeriGunung: data.mountain.galeriGunung || [],
            peraturan: data.mountain.peraturan || [],
            harga: data.mountain.harga,
            hargaPerOrang: data.mountain.hargaPerOrang,
            kuotaPerHari: data.mountain.kuotaPerHari,
            lokasi: data.mountain.lokasi,
            provinsi: data.mountain.provinsi,
          });
        } else {
          setError("Gunung tidak ditemukan");
        }
      } catch (err) {
        setError("Gagal memuat data gunung");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMountain();
  }, [id]);

  if (loading) return <div className="w-full text-center py-12">Memuat data gunung...</div>;
  if (error || !mountain) return notFound();

  return <MountainDetailPage mountain={mountain} />;
}
