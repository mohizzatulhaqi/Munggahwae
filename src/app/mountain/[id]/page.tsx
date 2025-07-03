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
            quota: data.mountain.kuota,
            description: data.mountain.deskripsi,
            heroImage: data.mountain.gambar || '/placeholder.svg',
            trails: Array.isArray(data.mountain.jalur) ? data.mountain.jalur.join(', ') : '',
            available: data.mountain.kuota, // Atur sesuai kebutuhan
            galleryImages: [], // Mapping jika ada galeri
            trailDetails: [], // Mapping jika ada detail jalur
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
