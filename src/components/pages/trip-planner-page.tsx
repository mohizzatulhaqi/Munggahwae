'use client';

import { useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import TripPlanForm, { type TripPlanSubmitValues } from '@/components/pages/trip-plan-form';

const TripPlannerPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = async (values: TripPlanSubmitValues) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/trip-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mountainId: values.mountainId,
          mountainName: values.mountainName,
          ascentTrail: values.ascentTrail,
          descentTrail: values.descentTrail,
          startDate: values.startDate,
          endDate: values.endDate,
          memberNames: values.members.map((m) => m.name),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Gagal membuat rencana pendakian');
      }
      const plan = await res.json();
      router.push(`/trip-planner/${plan.id}`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Gagal membuat rencana pendakian');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div
        className="w-full py-14 px-4"
        style={{ background: 'linear-gradient(135deg, #0FBD66 0%, #05603A 100%)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <Link
            href="/trip-planner"
            className="inline-flex items-center gap-1.5 text-green-50 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Semua Rencana
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-plus-jakarta mb-3">
            Rencanakan Perjalanan Pendakian
          </h1>
          <p className="text-green-50 font-plus-jakarta">
            Tentukan gunung, tanggal, dan siapa saja yang ikut untuk mulai menyusun perlengkapan
          </p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 -mt-8 pb-16">
        <TripPlanForm
          onSubmit={handleCreate}
          submitLabel="Lanjut ke Perlengkapan"
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </main>
      <Footer />
    </div>
  );
};

export default TripPlannerPage;
