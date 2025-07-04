"use client";
import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import BookingTermsPage from '@/components/pages/booking-terms-page';

export default function BookingTerms() {
  const params = useParams();
  const id = params?.id as string;
  const [mountain, setMountain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch info gunung
        const resGunung = await fetch(`/api/gunung/${id}`);
        const dataGunung = await resGunung.json();
        // Fetch peraturan
        const resRules = await fetch(`/api/peraturan/${id}`);
        const dataRules = await resRules.json();
        if (dataGunung.success && dataGunung.mountain) {
          setMountain({
            id: dataGunung.mountain.id,
            name: dataGunung.mountain.nama,
            bookingTerms: Array.isArray(dataRules.rules)
              ? dataRules.rules.map((r: any) => r.isi)
              : [],
          });
        } else {
          setError('Gunung tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="w-full text-center py-12">Memuat data...</div>;
  if (error || !mountain) return notFound();

  return <BookingTermsPage mountain={mountain} />;
}
