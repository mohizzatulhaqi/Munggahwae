'use client';

import { useState } from 'react';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, MapPin, Users, Plus, X } from 'lucide-react';
import { mountainsData } from '@/lib/mountain-data';

const AVATAR_STYLES = [
  'bg-emerald-100 text-emerald-700',
  'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700',
  'bg-purple-100 text-purple-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];

export function avatarStyle(index: number) {
  return AVATAR_STYLES[index % AVATAR_STYLES.length];
}

export function initials(name: string) {
  const trimmed = name.trim();
  return trimmed ? trimmed[0].toUpperCase() : '?';
}

export function createLocalKey() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export interface FormMember {
  key: string;
  id?: string;
  name: string;
}

export interface TripPlanFormValues {
  mountainId: string;
  startDate: string;
  endDate: string;
  members: FormMember[];
}

export interface TripPlanSubmitValues {
  mountainId: string;
  mountainName: string;
  startDate: string;
  endDate: string;
  members: { id?: string; name: string }[];
}

interface TripPlanFormProps {
  initialValues?: TripPlanFormValues;
  onSubmit: (values: TripPlanSubmitValues) => Promise<void> | void;
  submitLabel: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const TripPlanForm: React.FC<TripPlanFormProps> = ({
  initialValues,
  onSubmit,
  submitLabel,
  onCancel,
  isSubmitting,
  errorMessage,
}) => {
  const [mountainId, setMountainId] = useState(initialValues?.mountainId ?? '');
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? '');
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? '');
  const [members, setMembers] = useState<FormMember[]>(
    initialValues?.members ?? [{ key: createLocalKey(), name: '' }],
  );
  const [errors, setErrors] = useState<{
    mountainId?: string;
    startDate?: string;
    endDate?: string;
    members?: string;
  }>({});

  const addMember = () => {
    setMembers((prev) => [...prev, { key: createLocalKey(), name: '' }]);
  };

  const updateMemberName = (key: string, name: string) => {
    setMembers((prev) => prev.map((m) => (m.key === key ? { ...m, name } : m)));
  };

  const removeMember = (key: string) => {
    setMembers((prev) => (prev.length > 1 ? prev.filter((m) => m.key !== key) : prev));
  };

  const duration =
    startDate && endDate
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!mountainId) newErrors.mountainId = 'Pilih gunung tujuan';
    if (!startDate) newErrors.startDate = 'Tanggal mulai harus diisi';
    if (!endDate) newErrors.endDate = 'Tanggal selesai harus diisi';
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = 'Tanggal selesai harus setelah tanggal mulai';
    }
    if (members.length === 0 || members.some((m) => !m.name.trim())) {
      newErrors.members = 'Isi nama setiap anggota kelompok';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const mountain = mountainsData.find((m) => m.id === mountainId);
    await onSubmit({
      mountainId,
      mountainName: mountain?.name ?? '',
      startDate,
      endDate,
      members: members.map((m) => ({ id: m.id, name: m.name.trim() })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold font-plus-jakarta mb-5 text-global-1">Detail Pendakian</h2>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-green-600" />
              Gunung Tujuan
            </Label>
            <Select value={mountainId} onValueChange={setMountainId}>
              <SelectTrigger className={`h-12 rounded-xl ${errors.mountainId ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Pilih gunung" />
              </SelectTrigger>
              <SelectContent>
                {mountainsData.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} — {m.location}, {m.province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.mountainId && <p className="text-sm text-red-600">{errors.mountainId}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-green-600" />
                Tanggal Mulai
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`h-12 rounded-xl ${errors.startDate ? 'border-red-500' : ''}`}
              />
              {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-green-600" />
                Tanggal Selesai
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`h-12 rounded-xl ${errors.endDate ? 'border-red-500' : ''}`}
              />
              {errors.endDate && <p className="text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          {duration > 0 && !errors.startDate && !errors.endDate && (
            <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <Calendar className="w-4 h-4" />
              Durasi pendakian: {duration} hari
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold font-plus-jakarta text-global-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Anggota Kelompok
          </h2>
          <span className="text-sm text-gray-500">{members.length} orang</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">Masukkan nama setiap pendaki yang akan ikut</p>

        <div className="space-y-3">
          {members.map((member, index) => (
            <div key={member.key} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${avatarStyle(index)}`}
              >
                {initials(member.name) || index + 1}
              </div>
              <Input
                value={member.name}
                onChange={(e) => updateMemberName(member.key, e.target.value)}
                placeholder={`Nama anggota ${index + 1}`}
                className="h-11 rounded-xl flex-1"
              />
              <button
                type="button"
                onClick={() => removeMember(member.key)}
                disabled={members.length === 1}
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                aria-label={`Hapus anggota ${index + 1}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {errors.members && <p className="text-sm text-red-600 mt-3">{errors.members}</p>}

        <button
          type="button"
          onClick={addMember}
          className="mt-4 w-full flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-dashed border-green-300 text-green-700 font-medium hover:bg-green-50 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Anggota
        </button>
      </div>

      {errorMessage && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-12 rounded-xl">
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 text-lg rounded-xl bg-green-600 hover:bg-green-700">
          {isSubmitting ? 'Menyimpan...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TripPlanForm;
