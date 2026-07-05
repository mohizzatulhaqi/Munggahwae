'use client';

import { useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Modal from '@/components/ui/Modal';
import TerrainMap, { type TrailMarkerData } from '@/components/ui/TerrainMap';
import WeatherForecast from '@/components/ui/WeatherForecast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Trash2,
  Pencil,
  Backpack,
  ClipboardList,
  PencilLine,
  Wallet,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Route,
  Map,
  CloudSun,
  Sparkles,
} from 'lucide-react';
import { mountainsData } from '@/lib/mountain-data';
import type { GroupItemDTO, PersonalItemDTO, TripPlanDTO } from '@/lib/trip-plan-types';
import TripPlanForm, { avatarStyle, initials, type TripPlanSubmitValues } from '@/components/pages/trip-plan-form';
import AddItemModal from '@/components/pages/add-item-modal';
import AiSuggestionsModal from '@/components/pages/ai-suggestions-modal';

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

interface TripPlanMenuProps {
  id: string;
}

const TripPlanMenu: React.FC<TripPlanMenuProps> = ({ id }) => {
  const router = useRouter();
  const [plan, setPlan] = useState<TripPlanDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');
  const [activeMemberId, setActiveMemberId] = useState('');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [editingGroupItem, setEditingGroupItem] = useState<GroupItemDTO | null>(null);
  const [editingPersonalItem, setEditingPersonalItem] = useState<PersonalItemDTO | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [isDeletePlanModalOpen, setIsDeletePlanModalOpen] = useState(false);
  const [isDeletingPlan, setIsDeletingPlan] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const fetchPlan = async () => {
    const res = await fetch(`/api/trip-plans/${id}`);
    if (!res.ok) {
      setLoadError('Rencana pendakian tidak ditemukan');
      setIsLoading(false);
      return;
    }
    const data: TripPlanDTO = await res.json();
    setPlan(data);
    setActiveMemberId((prev) => (data.members.some((m) => m.id === prev) ? prev : data.members[0]?.id ?? ''));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const mountain = mountainsData.find((m) => m.id === plan?.mountainId);
  const activeMember = plan?.members.find((m) => m.id === activeMemberId) ?? plan?.members[0];

  const trailMarkers: TrailMarkerData[] =
    mountain?.trailDetails
      .filter((trail): trail is typeof trail & { coordinates: { lat: number; lng: number } } => !!trail.coordinates)
      .map((trail) => ({
        name: trail.name,
        lat: trail.coordinates.lat,
        lng: trail.coordinates.lng,
        status: trail.name === plan?.ascentTrail ? 'ascent' : trail.name === plan?.descentTrail ? 'descent' : 'none',
      })) ?? [];

  const duration =
    plan?.startDate && plan?.endDate
      ? Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  const totalGroupPrice = plan?.groupItems.reduce((sum, item) => sum + item.price, 0) ?? 0;

  const handleSaveEdit = async (values: TripPlanSubmitValues) => {
    setIsSavingEdit(true);
    setEditError('');
    try {
      const res = await fetch(`/api/trip-plans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Gagal menyimpan perubahan');
      }
      const updated: TripPlanDTO = await res.json();
      setPlan(updated);
      setActiveMemberId((prev) => (updated.members.some((m) => m.id === prev) ? prev : updated.members[0]?.id ?? ''));
      setIsEditing(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeletePlan = async () => {
    setIsDeletingPlan(true);
    await fetch(`/api/trip-plans/${id}`, { method: 'DELETE' });
    router.push('/trip-planner');
  };

  const addGroupItem = async (values: { name: string; price?: number; imageUrl?: string }) => {
    const res = await fetch(`/api/trip-plans/${id}/group-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: values.name, price: values.price, imageUrl: values.imageUrl }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Gagal menambahkan barang');
    }
    const item = await res.json();
    setPlan((prev) => (prev ? { ...prev, groupItems: [...prev.groupItems, item] } : prev));
  };

  const updateGroupItem = async (itemId: string, values: { name: string; price?: number; imageUrl?: string }) => {
    const res = await fetch(`/api/trip-plans/${id}/group-items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: values.name, price: values.price, imageUrl: values.imageUrl }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Gagal menyimpan barang');
    }
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            groupItems: prev.groupItems.map((i) =>
              i.id === itemId ? { ...i, name: values.name, price: values.price ?? i.price, imageUrl: values.imageUrl ?? null } : i,
            ),
          }
        : prev,
    );
  };

  const submitGroupItem = (values: { name: string; price?: number; imageUrl?: string }) =>
    editingGroupItem ? updateGroupItem(editingGroupItem.id, values) : addGroupItem(values);

  const toggleMemberPaid = async (memberId: string, hasPaid: boolean) => {
    setPlan((prev) =>
      prev ? { ...prev, members: prev.members.map((m) => (m.id === memberId ? { ...m, hasPaid } : m)) } : prev,
    );
    await fetch(`/api/trip-plans/${id}/members/${memberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hasPaid }),
    });
  };

  const removeGroupItem = async (itemId: string) => {
    setPlan((prev) => (prev ? { ...prev, groupItems: prev.groupItems.filter((i) => i.id !== itemId) } : prev));
    await fetch(`/api/trip-plans/${id}/group-items/${itemId}`, { method: 'DELETE' });
  };

  const addPersonalItem = async (values: { name: string; imageUrl?: string }) => {
    if (!activeMember) return;
    const res = await fetch(`/api/trip-plans/${id}/members/${activeMember.id}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: values.name, imageUrl: values.imageUrl }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Gagal menambahkan barang');
    }
    const item = await res.json();
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            members: prev.members.map((m) =>
              m.id === activeMember.id ? { ...m, personalItems: [...m.personalItems, item] } : m,
            ),
          }
        : prev,
    );
  };

  const addPersonalItemForMember = async (memberId: string, name: string) => {
    const res = await fetch(`/api/trip-plans/${id}/members/${memberId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return;
    const item = await res.json();
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            members: prev.members.map((m) =>
              m.id === memberId ? { ...m, personalItems: [...m.personalItems, item] } : m,
            ),
          }
        : prev,
    );
  };

  const addGroupItemSimple = async (name: string) => {
    await addGroupItem({ name });
  };

  const updatePersonalItem = async (itemId: string, values: { name: string; imageUrl?: string }) => {
    if (!activeMember) return;
    const res = await fetch(`/api/trip-plans/${id}/members/${activeMember.id}/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: values.name, imageUrl: values.imageUrl }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Gagal menyimpan barang');
    }
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            members: prev.members.map((m) =>
              m.id === activeMember.id
                ? {
                    ...m,
                    personalItems: m.personalItems.map((i) =>
                      i.id === itemId ? { ...i, name: values.name, imageUrl: values.imageUrl ?? null } : i,
                    ),
                  }
                : m,
            ),
          }
        : prev,
    );
  };

  const submitPersonalItem = (values: { name: string; imageUrl?: string }) =>
    editingPersonalItem ? updatePersonalItem(editingPersonalItem.id, values) : addPersonalItem(values);

  const togglePersonalItem = async (itemId: string, checked: boolean) => {
    if (!activeMember) return;
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            members: prev.members.map((m) =>
              m.id === activeMember.id
                ? { ...m, personalItems: m.personalItems.map((i) => (i.id === itemId ? { ...i, checked } : i)) }
                : m,
            ),
          }
        : prev,
    );
    await fetch(`/api/trip-plans/${id}/members/${activeMember.id}/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked }),
    });
  };

  const removePersonalItem = async (itemId: string) => {
    if (!activeMember) return;
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            members: prev.members.map((m) =>
              m.id === activeMember.id
                ? { ...m, personalItems: m.personalItems.filter((i) => i.id !== itemId) }
                : m,
            ),
          }
        : prev,
    );
    await fetch(`/api/trip-plans/${id}/members/${activeMember.id}/items/${itemId}`, { method: 'DELETE' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-32 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat rencana pendakian...
        </div>
        <Footer />
      </div>
    );
  }

  if (loadError || !plan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-gray-500 gap-2">
          <p>{loadError || 'Rencana pendakian tidak ditemukan'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div
        className="w-full py-10 px-4"
        style={{ background: 'linear-gradient(135deg, #0FBD66 0%, #05603A 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/trip-planner"
            className="inline-flex items-center gap-1.5 text-green-50 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Semua Rencana
          </Link>
          {isEditing ? (
            <div className="bg-white/95 rounded-2xl p-1">
              <div className="p-5 sm:p-7">
                <h2 className="text-lg font-bold font-plus-jakarta text-global-1 mb-4">Ubah Rencana Pendakian</h2>
                <TripPlanForm
                  initialValues={{
                    mountainId: plan.mountainId,
                    ascentTrail: plan.ascentTrail,
                    descentTrail: plan.descentTrail,
                    startDate: plan.startDate,
                    endDate: plan.endDate,
                    members: plan.members.map((m) => ({ key: m.id, id: m.id, name: m.name })),
                  }}
                  onSubmit={handleSaveEdit}
                  submitLabel="Simpan Perubahan"
                  onCancel={() => {
                    setIsEditing(false);
                    setEditError('');
                  }}
                  isSubmitting={isSavingEdit}
                  errorMessage={editError}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-plus-jakarta mb-2">
                  {mountain?.name ?? plan.mountainName}
                </h1>
                <div className="flex flex-wrap gap-4 text-green-50 text-sm">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {mountain?.location}, {mountain?.province}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {plan.startDate} s/d {plan.endDate} ({duration} hari)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> {plan.members.length} orang
                  </span>
                  {(plan.ascentTrail || plan.descentTrail) && (
                    <span className="flex items-center gap-1.5">
                      <Route className="w-4 h-4" />
                      {plan.ascentTrail && `Naik ${plan.ascentTrail}`}
                      {plan.ascentTrail && plan.descentTrail && ' · '}
                      {plan.descentTrail && `Turun ${plan.descentTrail}`}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white rounded-xl"
                >
                  <PencilLine className="w-4 h-4" /> Ubah Rencana
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDeletePlanModalOpen(true)}
                  className="bg-white/10 border-white/40 text-white hover:bg-red-500 hover:border-red-500 rounded-xl"
                  aria-label="Hapus rencana"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isEditing && (
        <main className="max-w-4xl mx-auto px-4 -mt-6 pb-16 space-y-6">
          {/* Terrain map */}
          {mountain && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8 pb-4">
                <h2 className="text-lg font-bold font-plus-jakarta text-global-1 flex items-center gap-2">
                  <Map className="w-5 h-5 text-green-600" /> Peta Medan
                </h2>
                <p className="text-sm text-gray-500">
                  Lokasi puncak dan titik awal jalur {mountain.name} di peta topografi
                </p>
              </div>
              <TerrainMap
                peakLat={mountain.coordinates.lat}
                peakLng={mountain.coordinates.lng}
                peakName={mountain.name}
                trails={trailMarkers}
                className="h-64 sm:h-80 w-full"
              />
              {trailMarkers.length > 0 && (
                <div className="flex flex-wrap gap-4 px-6 sm:px-8 py-4 border-t border-gray-100 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" /> Puncak
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Jalur naik
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> Jalur turun
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" /> Jalur lainnya
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Weather forecast */}
          {mountain && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8 pb-4">
                <h2 className="text-lg font-bold font-plus-jakarta text-global-1 flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-green-600" /> Prakiraan Cuaca
                </h2>
                <p className="text-sm text-gray-500">Perkiraan cuaca di {mountain.name} selama tanggal pendakian</p>
              </div>
              <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                <WeatherForecast
                  lat={mountain.coordinates.lat}
                  lng={mountain.coordinates.lng}
                  startDate={plan.startDate}
                  endDate={plan.endDate}
                />
              </div>
            </div>
          )}

          {/* AI suggestions trigger */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-white text-green-600 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-global-1">Saran AI untuk Perlengkapan</h2>
                <p className="text-sm text-gray-600">
                  Dapatkan saran barang berdasarkan gunung, jalur, cuaca, dan durasi rencana ini
                </p>
              </div>
            </div>
            <Button onClick={() => setIsAiModalOpen(true)} className="h-11 rounded-xl bg-green-600 hover:bg-green-700 shrink-0">
              <Sparkles className="w-4 h-4" /> Dapatkan Saran
            </Button>
          </div>

          {/* Group equipment */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 pb-4">
              <h2 className="text-lg font-bold font-plus-jakarta text-global-1 flex items-center gap-2">
                <Backpack className="w-5 h-5 text-green-600" /> Perlengkapan Kelompok
              </h2>
              <p className="text-sm text-gray-500">Barang yang ditanggung bersama satu kelompok</p>
            </div>

            <div className="px-6 sm:px-8">
              {plan.groupItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
                  Belum ada perlengkapan kelompok. Tambahkan di bawah ini.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {plan.groupItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.imageUrl ? (
                          <button
                            type="button"
                            onClick={() => setViewingImage(item.imageUrl)}
                            className="w-9 h-9 shrink-0 rounded-lg overflow-hidden"
                          >
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          </button>
                        ) : (
                          <div className="w-9 h-9 shrink-0 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                            <Backpack className="w-4 h-4" />
                          </div>
                        )}
                        <span className="font-medium text-global-1 truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-gray-700 font-medium mr-1">{formatRupiah(item.price)}</span>
                        <button
                          onClick={() => {
                            setEditingGroupItem(item);
                            setIsGroupModalOpen(true);
                          }}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          aria-label={`Ubah ${item.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeGroupItem(item.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label={`Hapus ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditingGroupItem(null);
                  setIsGroupModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-dashed border-green-300 text-green-700 font-medium hover:bg-green-50 transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Barang
              </button>
            </div>

            <div className="bg-green-50 border-t border-green-100 p-6 sm:p-8 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-green-800">
                <Wallet className="w-5 h-5" />
                <span className="font-semibold">Total Perlengkapan Kelompok</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-green-700">{formatRupiah(totalGroupPrice)}</p>
                {plan.members.length > 0 && (
                  <p className="text-xs text-green-600">
                    ± {formatRupiah(Math.ceil(totalGroupPrice / plan.members.length))} / orang
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-global-1">Status Patungan</h3>
                <span className="text-sm text-gray-500">
                  {plan.members.filter((m) => m.hasPaid).length}/{plan.members.length} sudah bayar
                </span>
              </div>
              <div className="space-y-2">
                {plan.members.map((member, index) => {
                  const share = plan.members.length > 0 ? Math.ceil(totalGroupPrice / plan.members.length) : 0;
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${avatarStyle(index)}`}
                        >
                          {initials(member.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-global-1 truncate">{member.name}</p>
                          <p className="text-xs text-gray-500">{formatRupiah(share)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMemberPaid(member.id, !member.hasPaid)}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                          member.hasPaid
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {member.hasPaid ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        {member.hasPaid ? 'Sudah Bayar' : 'Belum Bayar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Personal items per member */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 pb-4">
              <h2 className="text-lg font-bold font-plus-jakarta text-global-1 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-green-600" /> Perlengkapan Pribadi
              </h2>
              <p className="text-sm text-gray-500">Checklist barang bawaan masing-masing pendaki</p>
            </div>

            <div className="px-6 sm:px-8 flex gap-2 overflow-x-auto pb-2">
              {plan.members.map((member, index) => {
                const packedCount = member.personalItems.filter((i) => i.checked).length;
                const isActive = activeMember?.id === member.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => setActiveMemberId(member.id)}
                    className={`flex items-center gap-2 shrink-0 pl-2 pr-3 py-2 rounded-full border transition-colors ${
                      isActive
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? 'bg-white/20 text-white' : avatarStyle(index)
                      }`}
                    >
                      {initials(member.name)}
                    </span>
                    <span className="text-sm font-medium">{member.name}</span>
                    <span
                      className={`text-xs font-semibold rounded-full px-1.5 ${
                        isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {packedCount}/{member.personalItems.length}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-6 sm:p-8 pt-4">
              {!activeMember || activeMember.personalItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl mb-4">
                  Belum ada barang pribadi untuk {activeMember?.name || 'anggota ini'}.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden mb-4">
                  {activeMember.personalItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-gray-50">
                      <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={(checked) => togglePersonalItem(item.id, checked === true)}
                        />
                        {item.imageUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setViewingImage(item.imageUrl);
                            }}
                            className="w-8 h-8 shrink-0 rounded-lg overflow-hidden"
                          >
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          </button>
                        )}
                        <span className={`truncate ${item.checked ? 'line-through text-gray-400' : 'text-global-1'}`}>
                          {item.name}
                        </span>
                      </label>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingPersonalItem(item);
                            setIsPersonalModalOpen(true);
                          }}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          aria-label={`Ubah ${item.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removePersonalItem(item.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label={`Hapus ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditingPersonalItem(null);
                  setIsPersonalModalOpen(true);
                }}
                disabled={!activeMember}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-dashed border-green-300 text-green-700 font-medium hover:bg-green-50 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Barang
              </button>
            </div>
          </div>
        </main>
      )}

      <AddItemModal
        open={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setEditingGroupItem(null);
        }}
        title={editingGroupItem ? 'Ubah Perlengkapan Kelompok' : 'Tambah Perlengkapan Kelompok'}
        namePlaceholder="mis. Tenda 4 orang"
        showPrice
        submitLabel={editingGroupItem ? 'Simpan' : 'Tambah'}
        initialValues={editingGroupItem ?? undefined}
        onSubmit={submitGroupItem}
      />

      <AddItemModal
        open={isPersonalModalOpen}
        onClose={() => {
          setIsPersonalModalOpen(false);
          setEditingPersonalItem(null);
        }}
        title={
          editingPersonalItem
            ? `Ubah Barang ${activeMember?.name ?? ''}`
            : `Tambah Barang untuk ${activeMember?.name ?? ''}`
        }
        namePlaceholder="mis. Sepatu gunung"
        submitLabel={editingPersonalItem ? 'Simpan' : 'Tambah'}
        initialValues={editingPersonalItem ?? undefined}
        onSubmit={submitPersonalItem}
      />

      <Modal open={!!viewingImage} onClose={() => setViewingImage(null)} title="Foto Barang">
        {viewingImage && <img src={viewingImage} alt="Foto barang" className="w-full rounded-xl" />}
      </Modal>

      <Modal
        open={isDeletePlanModalOpen}
        onClose={() => setIsDeletePlanModalOpen(false)}
        title="Hapus Rencana Pendakian"
      >
        <p className="text-sm text-gray-600 mb-6">
          Yakin ingin menghapus rencana pendakian <span className="font-semibold">{plan.mountainName}</span>? Semua
          data anggota, perlengkapan, dan checklist di dalamnya akan ikut terhapus dan tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeletePlanModalOpen(false)}
            className="flex-1 h-11 rounded-xl"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleDeletePlan}
            disabled={isDeletingPlan}
            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700"
          >
            {isDeletingPlan ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </Modal>

      <AiSuggestionsModal
        open={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        planId={id}
        members={plan.members.map((m) => ({ id: m.id, name: m.name }))}
        onAddGroupItem={addGroupItemSimple}
        onAddPersonalItem={addPersonalItemForMember}
      />

      <Footer />
    </div>
  );
};

export default TripPlanMenu;
