'use client';

import { useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Trash2,
  Backpack,
  ClipboardList,
  PencilLine,
  Wallet,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { mountainsData } from '@/lib/mountain-data';
import type { TripPlanDTO } from '@/lib/trip-plan-types';
import TripPlanForm, { avatarStyle, initials, type TripPlanSubmitValues } from '@/components/pages/trip-plan-form';
import AddItemModal from '@/components/pages/add-item-modal';

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
  const [plan, setPlan] = useState<TripPlanDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');
  const [activeMemberId, setActiveMemberId] = useState('');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

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
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white rounded-xl"
              >
                <PencilLine className="w-4 h-4" /> Ubah Rencana
              </Button>
            </div>
          )}
        </div>
      </div>

      {!isEditing && (
        <main className="max-w-4xl mx-auto px-4 -mt-6 pb-16 space-y-6">
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
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 group">
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
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-gray-700 font-medium">{formatRupiah(item.price)}</span>
                        <button
                          onClick={() => removeGroupItem(item.id)}
                          className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
                onClick={() => setIsGroupModalOpen(true)}
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
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 group">
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
                      <button
                        onClick={() => removePersonalItem(item.id)}
                        className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsPersonalModalOpen(true)}
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
        onClose={() => setIsGroupModalOpen(false)}
        title="Tambah Perlengkapan Kelompok"
        namePlaceholder="mis. Tenda 4 orang"
        showPrice
        onSubmit={addGroupItem}
      />

      <AddItemModal
        open={isPersonalModalOpen}
        onClose={() => setIsPersonalModalOpen(false)}
        title={`Tambah Barang untuk ${activeMember?.name ?? ''}`}
        namePlaceholder="mis. Sepatu gunung"
        onSubmit={addPersonalItem}
      />

      <Modal open={!!viewingImage} onClose={() => setViewingImage(null)} title="Foto Barang">
        {viewingImage && <img src={viewingImage} alt="Foto barang" className="w-full rounded-xl" />}
      </Modal>

      <Footer />
    </div>
  );
};

export default TripPlanMenu;
