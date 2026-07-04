'use client';

import { useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Wallet, Plus, Loader2, Mountain } from 'lucide-react';
import { mountainsData } from '@/lib/mountain-data';
import type { TripPlanSummaryDTO } from '@/lib/trip-plan-types';
import { avatarStyle, initials } from '@/components/pages/trip-plan-form';

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

const TripPlanListPage: React.FC = () => {
  const [plans, setPlans] = useState<TripPlanSummaryDTO[] | null>(null);

  useEffect(() => {
    fetch('/api/trip-plans')
      .then((res) => res.json())
      .then((data: TripPlanSummaryDTO[]) => setPlans(data))
      .catch(() => setPlans([]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div
        className="w-full py-14 px-4"
        style={{ background: 'linear-gradient(135deg, #0FBD66 0%, #05603A 100%)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-plus-jakarta mb-2">
              Rencana Pendakian
            </h1>
            <p className="text-green-50 font-plus-jakarta">
              Semua rencana perjalanan pendakian yang sudah dibuat di Munggahwae
            </p>
          </div>
          <Link href="/trip-planner/new">
            <Button className="h-12 px-6 rounded-xl bg-white text-green-700 hover:bg-green-50">
              <Plus className="w-4 h-4" /> Buat Rencana Baru
            </Button>
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 -mt-6 pb-16">
        {plans === null ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat rencana pendakian...
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
              <Mountain className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-global-1 font-plus-jakarta mb-2">
              Belum ada rencana pendakian
            </h2>
            <p className="text-gray-500 mb-6">
              Mulai rencanakan pendakian pertamamu bersama kelompok
            </p>
            <Link href="/trip-planner/new">
              <Button className="h-11 px-6 rounded-xl bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4" /> Buat Rencana Baru
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const mountain = mountainsData.find((m) => m.id === plan.mountainId);
              const duration = Math.ceil(
                (new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24),
              );
              const progress = plan.totalItemCount > 0 ? Math.round((plan.packedCount / plan.totalItemCount) * 100) : 0;

              return (
                <Link
                  key={plan.id}
                  href={`/trip-planner/${plan.id}`}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <h3 className="text-lg font-bold text-global-1 font-plus-jakarta mb-1 truncate">
                    {plan.mountainName}
                  </h3>
                  {mountain && (
                    <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                      <MapPin className="w-3.5 h-3.5" /> {mountain.location}, {mountain.province}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {plan.startDate} s/d {plan.endDate} ({duration} hari)
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5" /> {formatRupiah(plan.totalGroupPrice)} perlengkapan kelompok
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center -space-x-2">
                      {plan.memberNames.slice(0, 5).map((name, index) => (
                        <span
                          key={index}
                          title={name}
                          className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${avatarStyle(index)}`}
                        >
                          {initials(name)}
                        </span>
                      ))}
                      {plan.memberNames.length > 5 && (
                        <span className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                          +{plan.memberNames.length - 5}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="w-3.5 h-3.5" /> {plan.memberNames.length} orang
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Perlengkapan pribadi dikemas</span>
                      <span>
                        {plan.packedCount}/{plan.totalItemCount}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TripPlanListPage;
