'use client';

import type React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, MapPin, Clock, Users, Route, AlertCircle, Info } from 'lucide-react';
import Image from 'next/image';
import { mountainsData } from '@/lib/mountain-data';
import { useParams } from 'next/navigation';

interface DateSelectionFormProps {
  onSubmit: (dates: {
    entryDate: string;
    exitDate: string;
    numberOfBookers: number;
    selectedTrail: string;
    price?: number;
  }) => void;
  mountain: any;
}

const getDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  const current = new Date(start);
  while (current < end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const getMinimumQuota = (
  trailId: string,
  entryDate: string,
  exitDate: string,
  trailDailyQuotas: Record<string, any[]>
): number => {
  if (!entryDate || !exitDate || !trailId || !trailDailyQuotas[trailId]) {
    return 0;
  }
  const dates = getDateRange(entryDate, exitDate);
  const quotas = trailDailyQuotas[trailId].filter(q => dates.includes(q.date));
  if (quotas.length === 0) return 0;
  return Math.min(...quotas.map(q => q.availableQuota));
};

const getDailyQuotaDetails = (
  trailId: string,
  entryDate: string,
  exitDate: string,
  trailDailyQuotas: Record<string, any[]>
) => {
  if (!entryDate || !exitDate || !trailId || !trailDailyQuotas[trailId]) {
    return [];
  }
  const dates = getDateRange(entryDate, exitDate);
  return trailDailyQuotas[trailId].filter(q => dates.includes(q.date));
};

function getQuotaFromKuotaHarian(trailId: string, trailDailyQuotas: Record<string, any[]>) {
  const quotas = trailDailyQuotas[trailId] || [];
  if (quotas.length === 0) return 0;
  return Math.min(...quotas.map((q: any) => q.availableQuota));
}

export default function DateSelectionForm({ onSubmit, mountain }: DateSelectionFormProps) {
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');
  const [numberOfBookers, setNumberOfBookers] = useState(1);
  const [selectedTrail, setSelectedTrail] = useState('');
  const [availableQuota, setAvailableQuota] = useState<number>(0);
  const [totalQuota, setTotalQuota] = useState<number>(0);
  const [dailyQuotaDetails, setDailyQuotaDetails] = useState<
    Array<{
      date: string;
      available: number;
      quota: number;
    }>
  >([]);
  const [errors, setErrors] = useState<{
    entryDate?: string;
    exitDate?: string;
    numberOfBookers?: string;
    selectedTrail?: string;
  }>({});
  const [dateWarnings, setDateWarnings] = useState<{
    entryDate?: string;
    exitDate?: string;
  }>({});
  const [trails, setTrails] = useState<any[]>([]);
  const [trailsLoading, setTrailsLoading] = useState(true);
  const [trailsError, setTrailsError] = useState<string | null>(null);
  const [trailDailyQuotas, setTrailDailyQuotas] = useState<Record<string, any[]>>({});
  const [trailDailyQuotasLoading, setTrailDailyQuotasLoading] = useState(true);
  const [trailDailyQuotasError, setTrailDailyQuotasError] = useState<string | null>(null);

  const validateDates = () => {
    const newWarnings: {
      entryDate?: string;
      exitDate?: string;
    } = {};

    if (entryDate && exitDate) {
      const entry = new Date(entryDate);
      const exit = new Date(exitDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (entry < today) {
        newWarnings.entryDate = 'Tanggal masuk tidak boleh kurang dari hari ini';
      }

      if (exit <= entry) {
        newWarnings.exitDate = 'Tanggal keluar harus setelah tanggal masuk';
      }

      // Add 3-day maximum duration check
      const durationInDays = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));
      if (durationInDays > 3) {
        newWarnings.exitDate = 'Durasi pendakian maksimal 3 hari';
      }
    }

    setDateWarnings(newWarnings);
    return Object.keys(newWarnings).length === 0;
  };

  const areDatesValidForTrailSelection = () => {
    if (!entryDate || !exitDate) return false;

    const entry = new Date(entryDate);
    const exit = new Date(exitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const durationInDays = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));

    return entry >= today && exit > entry && durationInDays <= 3;
  };

  useEffect(() => {
    validateDates();

    if (entryDate && exitDate && selectedTrail && trails.length > 0) {
      const selectedTrailObj = trails.find((t: any) => t.name === selectedTrail);
      const trailId = selectedTrailObj?.id;
      const minQuota = getMinimumQuota(trailId, entryDate, exitDate, trailDailyQuotas);
      const quotaDetails = getDailyQuotaDetails(trailId, entryDate, exitDate, trailDailyQuotas);

      setAvailableQuota(minQuota);
      setTotalQuota(
        quotaDetails.length > 0 ? Math.min(...quotaDetails.map((q) => q.quota)) : 0
      );

      if (numberOfBookers > minQuota) {
        setNumberOfBookers(Math.max(1, minQuota));
      }
    } else {
      setAvailableQuota(0);
      setTotalQuota(0);
      setDailyQuotaDetails([]);
    }
  }, [entryDate, exitDate, selectedTrail, trails, numberOfBookers, trailDailyQuotas]);

  // Fetch trails from API
  useEffect(() => {
    const fetchTrails = async () => {
      setTrailsLoading(true);
      setTrailsError(null);
      try {
        const res = await fetch(`/api/jalur/${mountain.id}`);
        const data = await res.json();
        if (data.success) {
          setTrails(data.trails || []);
        } else {
          setTrailsError(data.error || 'Gagal memuat jalur');
        }
      } catch (err) {
        setTrailsError('Gagal memuat jalur');
      } finally {
        setTrailsLoading(false);
      }
    };
    if (mountain.id) fetchTrails();
  }, [mountain.id]);

  useEffect(() => {
    const fetchTrailDailyQuotas = async () => {
      setTrailDailyQuotasLoading(true);
      setTrailDailyQuotasError(null);
      try {
        if (!mountain.id || !entryDate || !exitDate || trails.length === 0) {
          setTrailDailyQuotas({});
          setTrailDailyQuotasLoading(false);
          return;
        }
        // Ambil range tanggal
        const start = new Date(entryDate);
        const end = new Date(exitDate);
        const dates: string[] = [];
        const current = new Date(start);
        while (current < end) {
          dates.push(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }
        // Fetch kuota harian untuk setiap trail dan tanggal
        const quotasByTrail: Record<string, any[]> = {};
        for (const trail of trails) {
          quotasByTrail[trail.id] = [];
          for (const date of dates) {
            const quotaRes = await fetch(`/api/kuota-harian/${mountain.id}?jalurId=${trail.id}&date=${date}`);
            const data = await quotaRes.json();
            if (data.success && data.quotas.length > 0) {
              quotasByTrail[trail.id].push(data.quotas[0]);
            }
          }
        }
        setTrailDailyQuotas(quotasByTrail);
      } catch (err) {
        setTrailDailyQuotasError('Gagal memuat kuota harian per jalur');
      } finally {
        setTrailDailyQuotasLoading(false);
      }
    };
    fetchTrailDailyQuotas();
  }, [mountain.id, entryDate, exitDate, trails]);

  // Validasi jumlah pemesan maksimal per jalur
  const maxBookersByTrail: Record<string, number> = {};
  trails.forEach((trail) => {
    const quotas = trailDailyQuotas[trail.id] || [];
    maxBookersByTrail[trail.id] = quotas.length > 0 ? Math.min(...quotas.map(q => q.availableQuota)) : 0;
  });
  
  console.log('DEBUG: availableQuota', availableQuota);

  const validateForm = () => {
    const newErrors: {
      entryDate?: string;
      exitDate?: string;
      numberOfBookers?: string;
      selectedTrail?: string;
    } = {};

    console.log('DEBUG: validateForm', { availableQuota, numberOfBookers, selectedTrail, entryDate, exitDate });

    if (!entryDate) {
      newErrors.entryDate = 'Tanggal masuk harus diisi';
    }

    if (!exitDate) {
      newErrors.exitDate = 'Tanggal keluar harus diisi';
    }

    if (!selectedTrail) {
      newErrors.selectedTrail = 'Jalur pendakian harus dipilih';
    }

    if (numberOfBookers < 1) {
      newErrors.numberOfBookers = 'Jumlah pemesan minimal 1';
    } else if (numberOfBookers > 10) {
      newErrors.numberOfBookers = 'Jumlah pemesan maksimal 10';
    }

    if (selectedTrail && numberOfBookers > 0 && entryDate && exitDate) {
      if (numberOfBookers > availableQuota) {
        newErrors.numberOfBookers = `Jumlah pemesan melebihi kuota tersedia (${availableQuota} orang)`;
      }

      // Check duration again in case it was bypassed
      const durationInDays = Math.ceil(
        (new Date(exitDate).getTime() - new Date(entryDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (durationInDays > 3) {
        newErrors.exitDate = 'Durasi pendakian maksimal 3 hari';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectedTrailInfo = trails.find((trail) => trail.name === selectedTrail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const datesValid = validateDates();
    const formValid = validateForm();
    console.log('DEBUG: handleSubmit called', { datesValid, formValid, entryDate, exitDate, numberOfBookers, selectedTrail });
    if (datesValid && formValid) {
      console.log('DEBUG: onSubmit dipanggil', { entryDate, exitDate, numberOfBookers, selectedTrail, price: selectedTrailInfo?.price ?? 350000 });
      onSubmit({
        entryDate,
        exitDate,
        numberOfBookers,
        selectedTrail,
        price: selectedTrailInfo?.price ?? 350000, // ✅ benar
      });
    } else {
      console.log('DEBUG: Validasi gagal', { datesValid, formValid });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="relative h-96 w-full">
        <Image
          src="/images/gunung-rinjani.png"
          alt="Gunung Rinjani"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">Gunung {mountain?.name}</h1>
          <div className="flex items-center gap-4 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>
                {mountain?.location}, {mountain?.province}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-xl font-semibold">Deskripsi</h3>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p>{mountain?.description}</p>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold">Pilih Tanggal & Jalur Pendakian</h2>
            <p className="text-gray-600">
              Tentukan tanggal, jalur, dan jumlah pendaki (maksimal 3 hari)
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="entryDate"
                  className="flex items-center gap-2 text-base font-medium"
                >
                  <Calendar className="w-5 h-5" />
                  Tanggal Masuk *
                </Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={entryDate}
                  onChange={(e) => {
                    setEntryDate(e.target.value);
                    validateDates();
                  }}
                  className={`h-12 ${errors.entryDate || dateWarnings.entryDate ? 'border-red-500' : ''}`}
                />
                {errors.entryDate && <p className="text-sm text-red-600">{errors.entryDate}</p>}
                {dateWarnings.entryDate && !errors.entryDate && (
                  <p className="text-sm text-yellow-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {dateWarnings.entryDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitDate" className="flex items-center gap-2 text-base font-medium">
                  <Calendar className="w-5 h-5" />
                  Tanggal Keluar *
                </Label>
                <Input
                  id="exitDate"
                  type="date"
                  value={exitDate}
                  onChange={(e) => {
                    setExitDate(e.target.value);
                    validateDates();
                  }}
                  className={`h-12 ${errors.exitDate || dateWarnings.exitDate ? 'border-red-500' : ''}`}
                />
                {errors.exitDate && <p className="text-sm text-red-600">{errors.exitDate}</p>}
                {dateWarnings.exitDate && !errors.exitDate && (
                  <p className="text-sm text-yellow-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {dateWarnings.exitDate}
                  </p>
                )}
              </div>

              {!areDatesValidForTrailSelection() &&
                (dateWarnings.entryDate || dateWarnings.exitDate) && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          {dateWarnings.exitDate?.includes('maksimal 3 hari')
                            ? 'Durasi pendakian maksimal 3 hari. Harap perbaiki tanggal keluar.'
                            : 'Harap perbaiki tanggal yang dipilih sebelum memilih jalur pendakian'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {areDatesValidForTrailSelection() ? (
                <div className="space-y-2">
                  <Label
                    htmlFor="selectedTrail"
                    className="flex items-center gap-2 text-base font-medium"
                  >
                    <Route className="w-5 h-5" />
                    Pilih Jalur Pendakian *
                  </Label>
                  <Select value={selectedTrail} onValueChange={setSelectedTrail}>
                    <SelectTrigger
                      className={`h-12 ${errors.selectedTrail ? 'border-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Pilih jalur pendakian" />
                    </SelectTrigger>
                    <SelectContent>
  {trailsLoading ? (
    <div key="loading" className="px-4 py-2 text-gray-500">Memuat jalur...</div>
  ) : trailsError ? (
    <div key="error" className="px-4 py-2 text-red-500">{trailsError}</div>
  ) : trails.length > 0 ? (
    trails.map((trail, idx) => (
      <SelectItem key={`${trail.id || 'trail'}-${idx}`} value={trail.name}>
        <div className="flex justify-between items-center w-full">
          <span>{trail.name}</span>
          <span className="ml-4 text-sm text-gray-600">
            {maxBookersByTrail[trail.id] > 0 ? maxBookersByTrail[trail.id] : 'Tidak tersedia'}
          </span>
        </div>
      </SelectItem>
    ))
  ) : (
    <div key="no-trails" className="px-4 py-2 text-gray-500">Tidak ada jalur tersedia</div>
  )}
</SelectContent>
                  </Select>
                  {errors.selectedTrail && (
                    <p className="text-sm text-red-600">{errors.selectedTrail}</p>
                  )}

                  {!selectedTrail && (
                    <div className="space-y-3 mt-4">
                      <h4 className="font-medium text-gray-700">
                        Kuota Jalur untuk Tanggal {formatDate(entryDate)} - {formatDate(exitDate)}:
                      </h4>
                      {trails.map((trail, idx) => {
                        const quotas = trailDailyQuotas[trail.id] || [];
                        const minQuota = quotas.length > 0 ? Math.min(...quotas.map(q => q.availableQuota)) : 0;
                        return (
                          <div key={`${trail.id || 'trail'}-${idx}`} className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-800">{trail.name}</h5>
                              <div className="text-right">
                                <div className={`text-sm font-medium ${maxBookersByTrail[trail.id] > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {maxBookersByTrail[trail.id]} tersedia
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{trail.description}</p>
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Kuota per hari:</h6>
                              <div className="space-y-1">
                                {quotas.map((quota, idx) => (
                                  <div key={`${trail.id || 'trail'}-${quota.date}-${idx}`} className="flex justify-between text-xs">
                                    <span>{new Date(quota.date).toLocaleDateString('id-ID')}</span>
                                    <span className={quota.availableQuota > 0 ? 'text-green-600' : 'text-red-600'}>
                                      {getQuotaFromKuotaHarian(trail.id, trailDailyQuotas)} tersedia
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {maxBookersByTrail[trail.id] === 0 && (
                              <div className="flex items-center gap-2 mt-2 text-red-600">
                                <span className="text-sm font-medium">Kuota penuh untuk periode ini</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedTrailInfo && dailyQuotaDetails.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-blue-900">{selectedTrailInfo.name}</h4>
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium ${availableQuota > 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {availableQuota}/{dailyQuotaDetails.reduce((sum, q) => sum + q.quota, 0)} tersedia
                          </div>
                          {selectedTrailInfo.price && (
                            <div className="text-sm text-blue-700">
                              Rp {selectedTrailInfo.price.toLocaleString('id-ID')}/orang
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-blue-800 mb-3">{selectedTrailInfo.description}</p>

                      <div className="bg-white rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-blue-600" />
                          <h6 className="text-sm font-medium text-blue-900">Kuota harian:</h6>
                        </div>
                        <div className="space-y-1">
                          {dailyQuotaDetails.map((day, idx) => (
                            <div key={`${selectedTrailInfo?.id}-${day.date}-${idx}`} className="flex justify-between text-sm">
                              <span className="text-gray-700">{formatDate(day.date)}</span>
                              <span
                                className={
                                  day.available > 0
                                    ? 'text-green-600 font-medium'
                                    : 'text-red-600 font-medium'
                                }
                              >
                                {day.available}/{day.quota}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {availableQuota === 0 && (
                        <div className="flex items-center gap-2 mt-3 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Kuota jalur ini sudah penuh untuk periode yang dipilih
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-gray-600 flex items-center justify-center gap-2">
                    <Info className="w-4 h-4" />
                    {dateWarnings.exitDate?.includes('maksimal 3 hari')
                      ? 'Durasi pendakian maksimal 3 hari. Harap perbaiki tanggal keluar.'
                      : 'Pilih tanggal masuk dan keluar yang valid untuk melihat pilihan jalur'}
                  </p>
                </div>
              )}

              {selectedTrail && availableQuota > 0 && (
                <div className="space-y-2">
                  <Label
                    htmlFor="numberOfBookers"
                    className="flex items-center gap-2 text-base font-medium"
                  >
                    <Users className="w-5 h-5" />
                    Jumlah Pemesan *
                  </Label>
                  <Input
                    id="numberOfBookers"
                    type="number"
                    min="1"
                    max={Math.min(availableQuota, maxBookersByTrail[selectedTrailInfo?.id] ?? 0, 10)}
                    value={numberOfBookers}
                    onChange={(e) => setNumberOfBookers(Number.parseInt(e.target.value) || 1)}
                    className={`h-12 ${errors.numberOfBookers ? 'border-red-500' : ''}`}
                  />
                  {errors.numberOfBookers && (
                    <p className="text-sm text-red-600">{errors.numberOfBookers}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Maksimal {Math.min(availableQuota, maxBookersByTrail[selectedTrailInfo?.id] ?? 0, 10)} orang
                    {availableQuota < 10 ? ' (berdasarkan kuota tersedia)' : ' per pendaftaran'}
                  </p>
                </div>
              )}

              {entryDate &&
                exitDate &&
                selectedTrail &&
                !errors.entryDate &&
                !errors.exitDate &&
                availableQuota > 0 && (
                  <div
                    className={`border rounded-lg p-4 ${
                      Math.ceil(
                        (new Date(exitDate).getTime() - new Date(entryDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) === 3
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 ${
                      Math.ceil(
                        (new Date(exitDate).getTime() - new Date(entryDate).getTime()) / 
                        (1000 * 60 * 60 * 24)
                      ) === 3 ? 'text-yellow-800' : 'text-green-800'
                    }"
                    >
                      <Clock className="w-5 h-5" />
                      <div>
                        <p className="font-medium">
                          Durasi Pendakian:{' '}
                          {Math.ceil(
                            (new Date(exitDate).getTime() - new Date(entryDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{' '}
                          hari
                          {Math.ceil(
                            (new Date(exitDate).getTime() - new Date(entryDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) === 3 && (
                            <span className="ml-2 text-yellow-700">(Maksimal durasi)</span>
                          )}
                        </p>
                        <p className="text-sm">
                          {numberOfBookers} orang ×{' '}
                          {Math.ceil(
                            (new Date(exitDate).getTime() - new Date(entryDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{' '}
                          hari • {selectedTrail}
                          {selectedTrailInfo?.price && (
                            <span>
                              {' '}
                              • Total: Rp{' '}
                              {(selectedTrailInfo.price * numberOfBookers).toLocaleString('id-ID')}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                disabled={
                  !selectedTrail ||
                  !entryDate ||
                  !exitDate ||
                  Object.keys(dateWarnings).length > 0 ||
                  Object.keys(errors).length > 0 ||
                  Math.ceil(
                    (new Date(exitDate).getTime() - new Date(entryDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) > 3
                }
              >
                {!entryDate || !exitDate
                  ? 'PILIH TANGGAL TERLEBIH DAHULU'
                  : Object.keys(dateWarnings).length > 0
                    ? dateWarnings.exitDate?.includes('maksimal 3 hari')
                      ? 'MAKSIMAL 3 HARI'
                      : 'PERBAIKI TANGGAL YANG DIPILIH'
                    : !selectedTrail
                      ? 'PILIH JALUR PENDAKIAN'
                      : Math.ceil(
                            (new Date(exitDate).getTime() - new Date(entryDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) > 3
                        ? 'MAKSIMAL 3 HARI'
                        : 'SELANJUTNYA'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Footer />
      </div>
    </div>
  );
}
