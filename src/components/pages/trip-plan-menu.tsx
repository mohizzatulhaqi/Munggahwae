'use client';

import { useEffect, useRef, useState } from 'react';
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
  Share2,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Send,
  NotebookPen,
  ListChecks,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import { mountainsData } from '@/lib/mountain-data';
import type {
  GroupItemDTO,
  PersonalItemDTO,
  TripPlanDTO,
  JournalEntryDTO,
  ReadinessFinding,
  ReadinessResult,
  TripChatMessage,
} from '@/lib/trip-plan-types';
import TripPlanForm, { avatarStyle, initials, type TripPlanSubmitValues } from '@/components/pages/trip-plan-form';
import AddItemModal from '@/components/pages/add-item-modal';
import AiSuggestionsModal from '@/components/pages/ai-suggestions-modal';
import JournalEntryModal, { type JournalEntryValues } from '@/components/pages/journal-entry-modal';

function readinessTone(score: number) {
  if (score >= 80) return { ring: 'border-green-500 text-green-600', label: 'Siap Berangkat', text: 'text-green-600' };
  if (score >= 50) return { ring: 'border-amber-500 text-amber-600', label: 'Hampir Siap', text: 'text-amber-600' };
  return { ring: 'border-red-500 text-red-600', label: 'Belum Siap', text: 'text-red-600' };
}

const severityStyles: Record<ReadinessFinding['severity'], string> = {
  tinggi: 'bg-red-100 text-red-700',
  sedang: 'bg-amber-100 text-amber-700',
  rendah: 'bg-gray-100 text-gray-600',
};

const CHAT_SUGGESTED_QUESTIONS = [
  'Perlu porter atau pemandu ngga di jalur ini?',
  'Di mana sumber air terakhir di jalur naik?',
  'Bagaimana cara daftar simaksi/registrasinya?',
  'Tips menghadapi cuaca di tanggal keberangkatan kami?',
];

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
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isSosSetupModalOpen, setIsSosSetupModalOpen] = useState(false);
  const [sosNote, setSosNote] = useState('');
  const [isSendingSos, setIsSendingSos] = useState(false);
  const [sosLocationStatus, setSosLocationStatus] = useState('');
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [editingJournalEntry, setEditingJournalEntry] = useState<JournalEntryDTO | null>(null);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  const [itineraryError, setItineraryError] = useState('');
  const [readiness, setReadiness] = useState<ReadinessResult | null>(null);
  const [isCheckingReadiness, setIsCheckingReadiness] = useState(false);
  const [readinessError, setReadinessError] = useState('');
  const [chatMessages, setChatMessages] = useState<TripChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatLoadedRef = useRef(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

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

  const buildShareText = () => {
    if (!plan) return '';
    const lines: string[] = [
      `*Rencana Pendakian ${mountain?.name ?? plan.mountainName}*`,
      `${plan.startDate} s/d ${plan.endDate} (${duration} hari)`,
    ];
    if (plan.ascentTrail || plan.descentTrail) {
      lines.push(
        `Jalur: ${plan.ascentTrail ? `Naik ${plan.ascentTrail}` : ''}${
          plan.ascentTrail && plan.descentTrail ? ' · ' : ''
        }${plan.descentTrail ? `Turun ${plan.descentTrail}` : ''}`,
      );
    }
    if (plan.itineraryDays && plan.itineraryDays.length > 0) {
      lines.push('', '*Itinerary Harian:*');
      plan.itineraryDays.forEach((dayPlan) => {
        lines.push(`Hari ${dayPlan.day} (${dayPlan.date}) — ${dayPlan.title}`);
        dayPlan.checkpoints.forEach((cp) => lines.push(`  - ${cp.name}: ${cp.note}`));
      });
    }

    lines.push('', `*Anggota (${plan.members.length}):*`);
    plan.members.forEach((m) => lines.push(`- ${m.name}${m.hasPaid ? ' (sudah bayar)' : ''}`));

    if (plan.groupItems.length > 0) {
      lines.push('', '*Perlengkapan Kelompok:*');
      plan.groupItems.forEach((item) =>
        lines.push(`- ${item.name}${item.price ? ` (${formatRupiah(item.price)})` : ''}`),
      );
      lines.push(`Total: ${formatRupiah(totalGroupPrice)}`);
    }

    lines.push('', '*Checklist Pribadi:*');
    plan.members.forEach((m) => {
      lines.push(`${m.name}:`);
      if (m.personalItems.length === 0) {
        lines.push('  (belum ada barang)');
      } else {
        m.personalItems.forEach((item) => lines.push(`  ${item.checked ? '✅' : '⬜'} ${item.name}`));
      }
    });

    if (plan.journalEntries.length > 0) {
      lines.push('', '*Jurnal Perjalanan:*');
      plan.journalEntries.forEach((entry) => {
        lines.push(`${entry.entryDate}${entry.authorName ? ` — ${entry.authorName}` : ''}: ${entry.note}`);
      });
    }

    return lines.join('\n');
  };

  const handleShareWhatsApp = () => {
    const text = buildShareText();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

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

  const openSosFlow = () => {
    if (!plan?.emergencyContactPhone) {
      setIsSosSetupModalOpen(true);
      return;
    }
    setSosNote('');
    setIsSosModalOpen(true);
  };

  const normalizePhoneForWhatsApp = (raw: string) => {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
    return digits;
  };

  const sendSosMessage = (locationLine: string, popup: Window | null) => {
    if (!plan) return;
    const trailLine =
      plan.ascentTrail || plan.descentTrail
        ? `Jalur: ${plan.ascentTrail ? `Naik ${plan.ascentTrail}` : ''}${
            plan.ascentTrail && plan.descentTrail ? ' · ' : ''
          }${plan.descentTrail ? `Turun ${plan.descentTrail}` : ''}`
        : '';
    const lines = [
      '🆘 DARURAT — butuh bantuan segera.',
      `Rencana pendakian: ${mountain?.name ?? plan.mountainName}`,
      trailLine,
      sosNote.trim() ? `Catatan: ${sosNote.trim()}` : '',
      locationLine,
      '(Dikirim otomatis dari Munggahwae)',
    ].filter(Boolean);
    const phone = normalizePhoneForWhatsApp(plan.emergencyContactPhone ?? '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
    if (popup) {
      popup.location.href = url;
    } else {
      window.open(url, '_blank');
    }
    setIsSendingSos(false);
    setIsSosModalOpen(false);
    setSosNote('');
    setSosLocationStatus('');
  };

  const handleSendSos = () => {
    setIsSendingSos(true);
    // Open the tab synchronously (within the click gesture) so mobile browsers
    // don't treat the later redirect as a blocked popup once geolocation resolves.
    const popup = window.open('', '_blank');
    if (!('geolocation' in navigator)) {
      sendSosMessage('Lokasi: tidak tersedia di perangkat ini', popup);
      return;
    }
    setSosLocationStatus('Mengambil lokasi...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        sendSosMessage(`Lokasi terakhir: https://www.google.com/maps?q=${latitude},${longitude}`, popup);
      },
      () => {
        sendSosMessage('Lokasi: tidak berhasil diambil (izin ditolak/GPS tidak aktif)', popup);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  };

  const generateItinerary = async (day?: number) => {
    if (day != null) {
      setRegeneratingDay(day);
    } else {
      setIsGeneratingItinerary(true);
    }
    setItineraryError('');
    try {
      const res = await fetch(`/api/trip-plans/${id}/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(day != null ? { day } : {}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Gagal membuat itinerary');
      }
      const data = await res.json();
      setPlan((prev) => (prev ? { ...prev, itineraryDays: data.days } : prev));
    } catch (err) {
      setItineraryError(err instanceof Error ? err.message : 'Gagal membuat itinerary');
    } finally {
      if (day != null) {
        setRegeneratingDay(null);
      } else {
        setIsGeneratingItinerary(false);
      }
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`munggahwae:trip-chat:${id}`);
      if (raw) setChatMessages(JSON.parse(raw));
    } catch {
    }
    chatLoadedRef.current = true;
  }, [id]);

  useEffect(() => {
    if (!chatLoadedRef.current) return;
    try {
      localStorage.setItem(`munggahwae:trip-chat:${id}`, JSON.stringify(chatMessages.slice(-40)));
    } catch {
    }
  }, [chatMessages, id]);

  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatMessages, isChatLoading]);

  const sendChatMessage = async (question?: string) => {
    const message = (question ?? chatInput).trim();
    if (!message || isChatLoading) return;
    const nextMessages: TripChatMessage[] = [...chatMessages, { role: 'user', text: message }];
    setChatMessages(nextMessages);
    setChatInput('');
    setIsChatLoading(true);
    setChatError('');
    try {
      const res = await fetch(`/api/trip-plans/${id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-20) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Gagal mendapatkan jawaban AI');
      }
      const data = await res.json();
      setChatMessages([...nextMessages, { role: 'model', text: data.reply }]);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : 'Gagal mendapatkan jawaban AI');
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    setChatError('');
    try {
      localStorage.removeItem(`munggahwae:trip-chat:${id}`);
    } catch {
      // abaikan
    }
  };

  const checkReadiness = async () => {
    setIsCheckingReadiness(true);
    setReadinessError('');
    try {
      const res = await fetch(`/api/trip-plans/${id}/readiness`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Gagal melakukan cek kesiapan');
      }
      const data = (await res.json()) as ReadinessResult;
      setReadiness(data);
    } catch (err) {
      setReadinessError(err instanceof Error ? err.message : 'Gagal melakukan cek kesiapan');
    } finally {
      setIsCheckingReadiness(false);
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

  const addJournalEntry = async (values: JournalEntryValues) => {
    const res = await fetch(`/api/trip-plans/${id}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Gagal menyimpan catatan');
    }
    const entry: JournalEntryDTO = await res.json();
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            journalEntries: [...prev.journalEntries, entry].sort((a, b) => a.entryDate.localeCompare(b.entryDate)),
          }
        : prev,
    );
  };

  const updateJournalEntry = async (entryId: string, values: JournalEntryValues) => {
    const res = await fetch(`/api/trip-plans/${id}/journal/${entryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Gagal menyimpan catatan');
    }
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            journalEntries: prev.journalEntries
              .map((e) =>
                e.id === entryId
                  ? {
                      ...e,
                      entryDate: values.entryDate,
                      note: values.note,
                      imageUrl: values.imageUrl ?? null,
                      authorName: values.authorName ?? null,
                    }
                  : e,
              )
              .sort((a, b) => a.entryDate.localeCompare(b.entryDate)),
          }
        : prev,
    );
  };

  const submitJournalEntry = (values: JournalEntryValues) =>
    editingJournalEntry ? updateJournalEntry(editingJournalEntry.id, values) : addJournalEntry(values);

  const removeJournalEntry = async (entryId: string) => {
    setPlan((prev) =>
      prev ? { ...prev, journalEntries: prev.journalEntries.filter((e) => e.id !== entryId) } : prev,
    );
    await fetch(`/api/trip-plans/${id}/journal/${entryId}`, { method: 'DELETE' });
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
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>

      <div className="hidden print:block max-w-4xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-black mb-1">{mountain?.name ?? plan.mountainName}</h1>
        <p className="text-sm text-gray-700">
          {mountain?.location}, {mountain?.province}
        </p>
        <p className="text-sm text-gray-700">
          {plan.startDate} s/d {plan.endDate} ({duration} hari)
        </p>
        {(plan.ascentTrail || plan.descentTrail) && (
          <p className="text-sm text-gray-700">
            {plan.ascentTrail && `Naik ${plan.ascentTrail}`}
            {plan.ascentTrail && plan.descentTrail && ' · '}
            {plan.descentTrail && `Turun ${plan.descentTrail}`}
          </p>
        )}
      </div>

      <div
        className="w-full py-10 px-4 print:hidden"
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
                    emergencyContactName: plan.emergencyContactName,
                    emergencyContactPhone: plan.emergencyContactPhone,
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
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={handleShareWhatsApp}
                  className="bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white rounded-xl"
                >
                  <Share2 className="w-4 h-4" /> Bagikan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white rounded-xl"
                >
                  <Printer className="w-4 h-4" /> Cetak
                </Button>
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
        <main className="max-w-4xl mx-auto px-4 -mt-6 print:mt-0 pb-16 space-y-6">
          {/* SOS emergency trigger */}
          <div className="bg-red-600 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-white/15 text-white flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-white">SOS Darurat</h2>
                <p className="text-sm text-red-50">
                  {plan.emergencyContactPhone
                    ? `Kirim lokasi & pesan darurat ke ${plan.emergencyContactName || 'kontak darurat'} lewat WhatsApp`
                    : 'Atur kontak darurat dulu supaya tombol ini bisa dipakai'}
                </p>
              </div>
            </div>
            <Button onClick={openSosFlow} className="h-11 rounded-xl bg-white text-red-600 hover:bg-red-50 shrink-0">
              <ShieldAlert className="w-4 h-4" /> Kirim SOS
            </Button>
          </div>

          {/* Terrain map */}
          {mountain && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden print:hidden">
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
                  planId={id}
                  lat={mountain.coordinates.lat}
                  lng={mountain.coordinates.lng}
                  startDate={plan.startDate}
                  endDate={plan.endDate}
                />
              </div>
            </div>
          )}

          {/* Itinerary harian */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold font-plus-jakarta text-global-1 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-green-600" /> Itinerary Harian
                </h2>
                <p className="text-sm text-gray-500">
                  Rencana pos/checkpoint per hari, dibuat AI dengan mempertimbangkan jalur & prakiraan cuaca
                </p>
              </div>
              <Button
                onClick={() => generateItinerary()}
                disabled={isGeneratingItinerary || regeneratingDay !== null}
                variant={plan.itineraryDays ? 'outline' : 'default'}
                className={`h-10 rounded-xl shrink-0 print:hidden ${plan.itineraryDays ? '' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isGeneratingItinerary ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Membuat...
                  </>
                ) : plan.itineraryDays ? (
                  <>
                    <RefreshCw className="w-4 h-4" /> Buat Ulang
                  </>
                ) : (
                  <>
                    <ListChecks className="w-4 h-4" /> Buat Itinerary
                  </>
                )}
              </Button>
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              {itineraryError && <p className="text-sm text-red-600 mb-4">{itineraryError}</p>}

              {!plan.itineraryDays ? (
                <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
                  Belum ada itinerary. Buat otomatis berdasarkan gunung, jalur, durasi, dan prakiraan cuaca rencana ini.
                </div>
              ) : (
                <div className="space-y-4">
                  {plan.itineraryDays.map((dayPlan) => {
                    const dateLabel = new Date(dayPlan.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    });
                    return (
                      <div key={dayPlan.day} className="rounded-xl border border-gray-100 overflow-hidden">
                        <div className="bg-green-50 px-4 py-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                              Hari {dayPlan.day} · {dateLabel}
                            </p>
                            <p className="font-semibold text-global-1">{dayPlan.title}</p>
                          </div>
                          <button
                            onClick={() => generateItinerary(dayPlan.day)}
                            disabled={isGeneratingItinerary || regeneratingDay !== null}
                            title={`Buat ulang hari ${dayPlan.day} saja`}
                            className="w-8 h-8 shrink-0 mt-0.5 rounded-lg text-green-700 hover:bg-green-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed print:hidden"
                          >
                            {regeneratingDay === dayPlan.day ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <ol className="divide-y divide-gray-100">
                          {dayPlan.checkpoints.map((checkpoint, index) => (
                            <li key={index} className="flex gap-3 px-4 py-3">
                              <span className="w-6 h-6 shrink-0 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center mt-0.5">
                                {index + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="font-medium text-global-1">{checkpoint.name}</p>
                                <p className="text-sm text-gray-500">{checkpoint.note}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    );
                  })}
                  <p className="text-xs text-gray-400 text-center pt-2">
                    Estimasi dibuat AI berdasarkan pola umum pendakian. Sesuaikan dengan info pemandu/basecamp
                    setempat.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI suggestions trigger */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-white text-green-600 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-global-1">Saran AI untuk Perlengkapan</h2>
                <p className="text-sm text-gray-600">
                  Dapatkan saran barang berdasarkan gunung, jalur, cuaca, durasi
                  {plan.itineraryDays ? ', dan itinerary' : ''} rencana ini
                </p>
                {!plan.itineraryDays && (
                  <p className="text-xs text-gray-400 mt-1">
                    Tip: buat Itinerary Harian dulu agar saran memperhitungkan malam kemah & summit attack
                  </p>
                )}
              </div>
            </div>
            <Button onClick={() => setIsAiModalOpen(true)} className="h-11 rounded-xl bg-green-600 hover:bg-green-700 shrink-0">
              <Sparkles className="w-4 h-4" /> Dapatkan Saran
            </Button>
          </div>

          {/* Cek kesiapan AI */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden print:hidden">
            <div className="p-6 sm:p-8 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold font-plus-jakarta text-global-1 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" /> Cek Kesiapan Pendakian
                </h2>
                <p className="text-sm text-gray-500">
                  AI mengaudit perlengkapan, progres packing, patungan, kontak darurat & cuaca sebelum berangkat
                </p>
              </div>
              <Button
                onClick={checkReadiness}
                disabled={isCheckingReadiness}
                variant={readiness ? 'outline' : 'default'}
                className={`h-10 rounded-xl shrink-0 ${readiness ? '' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isCheckingReadiness ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Mengecek...
                  </>
                ) : readiness ? (
                  <>
                    <RefreshCw className="w-4 h-4" /> Cek Ulang
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Cek Sekarang
                  </>
                )}
              </Button>
            </div>

            {(readinessError || readiness) && (
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4">
                {readinessError && <p className="text-sm text-red-600">{readinessError}</p>}

                {readiness && (
                  <>
                    <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                      <div
                        className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center border-4 ${readinessTone(readiness.score).ring}`}
                      >
                        <span className="text-xl font-extrabold leading-none">{readiness.score}</span>
                      </div>
                      <div className="min-w-0">
                        <p className={`font-bold ${readinessTone(readiness.score).text}`}>
                          {readinessTone(readiness.score).label}
                        </p>
                        <p className="text-sm text-gray-600">{readiness.summary}</p>
                      </div>
                    </div>

                    {readiness.findings.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Perlu ditindaklanjuti
                        </p>
                        {readiness.findings.map((finding, index) => (
                          <div key={index} className="flex items-start gap-3 rounded-xl border border-gray-100 p-3">
                            <span
                              className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${severityStyles[finding.severity]}`}
                            >
                              {finding.severity}
                            </span>
                            <div className="min-w-0">
                              <p className="font-medium text-global-1">{finding.title}</p>
                              <p className="text-sm text-gray-500">{finding.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {readiness.strengths.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Sudah baik</p>
                        <ul className="space-y-1.5">
                          {readiness.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 text-center">
                      Penilaian AI berdasarkan data rencana ini — tetap gunakan pertimbanganmu sendiri sebelum berangkat.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Tanya AI */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden print:hidden">
            <div className="p-6 sm:p-8 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold font-plus-jakarta text-global-1 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-600" /> Tanya AI
                </h2>
                <p className="text-sm text-gray-500">
                  Asisten yang sudah tahu gunung, jalur, tanggal, cuaca & itinerary rencana ini — tanya apa saja
                </p>
              </div>
              {chatMessages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Hapus percakapan"
                  className="w-9 h-9 shrink-0 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="flex flex-wrap gap-2">
                  {CHAT_SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      onClick={() => sendChatMessage(question)}
                      disabled={isChatLoading}
                      className="px-3 py-2 rounded-xl border border-green-200 bg-green-50 text-sm text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50 text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              ) : (
                <div ref={chatScrollRef} className="max-h-96 overflow-y-auto space-y-3 pr-1">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] px-4 py-2.5 text-sm whitespace-pre-wrap ${
                          message.role === 'user'
                            ? 'bg-green-600 text-white rounded-2xl rounded-br-md'
                            : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Mengetik...
                      </div>
                    </div>
                  )}
                </div>
              )}

              {chatError && <p className="text-sm text-red-600">{chatError}</p>}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendChatMessage();
                  }}
                  placeholder="Tulis pertanyaanmu di sini..."
                  className="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
                <Button
                  onClick={() => sendChatMessage()}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="h-11 w-11 rounded-xl bg-green-600 hover:bg-green-700 shrink-0 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Jawaban AI bisa keliru — konfirmasi info penting ke basecamp/pemandu setempat.
              </p>
            </div>
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
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors print:hidden"
                          aria-label={`Ubah ${item.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeGroupItem(item.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors print:hidden"
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

            <div className="p-6 sm:p-8 pt-4 print:hidden">
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

            <div className="px-6 sm:px-8 flex gap-2 overflow-x-auto pb-2 print:hidden">
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

            <div className="p-6 sm:p-8 pt-4 print:hidden">
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

            {/* Print-only: all members' checklists */}
            <div className="hidden print:block px-8 pb-8 space-y-5">
              {plan.members.map((member) => (
                <div key={member.id}>
                  <h3 className="font-semibold text-black mb-1.5">{member.name}</h3>
                  {member.personalItems.length === 0 ? (
                    <p className="text-sm text-gray-600">(belum ada barang)</p>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {member.personalItems.map((item) => (
                        <li key={item.id} className="text-gray-800">
                          [{item.checked ? 'x' : ' '}] {item.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Journal perjalanan */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 pb-4">
              <h2 className="text-lg font-bold font-plus-jakarta text-global-1 flex items-center gap-2">
                <NotebookPen className="w-5 h-5 text-green-600" /> Jurnal Perjalanan
              </h2>
              <p className="text-sm text-gray-500">Catatan dan foto singkat tiap hari selama pendakian</p>
            </div>

            <div className="px-6 sm:px-8">
              {plan.journalEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
                  Belum ada catatan. Tambahkan cerita atau foto selama perjalanan.
                </div>
              ) : (
                <div className="space-y-3">
                  {plan.journalEntries.map((entry) => {
                    const dateLabel = new Date(entry.entryDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    });
                    return (
                      <div key={entry.id} className="flex gap-3 px-4 py-3 rounded-xl border border-gray-100">
                        {entry.imageUrl ? (
                          <button
                            type="button"
                            onClick={() => setViewingImage(entry.imageUrl)}
                            className="w-14 h-14 shrink-0 rounded-lg overflow-hidden"
                          >
                            <img src={entry.imageUrl} alt={entry.note} className="w-full h-full object-cover" />
                          </button>
                        ) : (
                          <div className="w-14 h-14 shrink-0 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                            <NotebookPen className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-gray-500">
                              {dateLabel}
                              {entry.authorName && ` · ${entry.authorName}`}
                            </p>
                            <div className="flex items-center gap-1 shrink-0 print:hidden">
                              <button
                                onClick={() => {
                                  setEditingJournalEntry(entry);
                                  setIsJournalModalOpen(true);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                aria-label="Ubah catatan"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeJournalEntry(entry.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                aria-label="Hapus catatan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-global-1 mt-1 whitespace-pre-wrap">{entry.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 pt-4 print:hidden">
              <button
                type="button"
                onClick={() => {
                  setEditingJournalEntry(null);
                  setIsJournalModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-dashed border-green-300 text-green-700 font-medium hover:bg-green-50 transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Catatan
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

      <Modal open={isSosSetupModalOpen} onClose={() => setIsSosSetupModalOpen(false)} title="Kontak Darurat Belum Diatur">
        <p className="text-sm text-gray-600 mb-6">
          Untuk memakai tombol SOS, isi dulu nama dan nomor WhatsApp kontak darurat lewat menu Ubah Rencana.
        </p>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsSosSetupModalOpen(false)}
            className="flex-1 h-11 rounded-xl"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={() => {
              setIsSosSetupModalOpen(false);
              setIsEditing(true);
            }}
            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700"
          >
            Atur Sekarang
          </Button>
        </div>
      </Modal>

      <Modal
        open={isSosModalOpen}
        onClose={() => {
          if (!isSendingSos) setIsSosModalOpen(false);
        }}
        title="Kirim SOS Darurat"
      >
        <p className="text-sm text-gray-600 mb-4">
          Pesan darurat berisi lokasi terkini akan dikirim ke{' '}
          <span className="font-semibold text-global-1">
            {plan.emergencyContactName || 'kontak darurat'} ({plan.emergencyContactPhone})
          </span>{' '}
          lewat WhatsApp.
        </p>
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-gray-700">Catatan situasi (opsional)</label>
          <textarea
            value={sosNote}
            onChange={(e) => setSosNote(e.target.value)}
            placeholder="mis. Anggota cedera kaki di dekat pos 3"
            rows={3}
            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsSosModalOpen(false)}
            disabled={isSendingSos}
            className="flex-1 h-11 rounded-xl"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSendSos}
            disabled={isSendingSos}
            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700"
          >
            {isSendingSos ? sosLocationStatus || 'Mengirim...' : (
              <>
                <Send className="w-4 h-4" /> Kirim SOS
              </>
            )}
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

      <JournalEntryModal
        open={isJournalModalOpen}
        onClose={() => {
          setIsJournalModalOpen(false);
          setEditingJournalEntry(null);
        }}
        title={editingJournalEntry ? 'Ubah Catatan' : 'Tambah Catatan'}
        submitLabel={editingJournalEntry ? 'Simpan' : 'Tambah'}
        minDate={plan.startDate}
        maxDate={plan.endDate}
        members={plan.members.map((m) => ({ id: m.id, name: m.name }))}
        initialValues={editingJournalEntry ?? undefined}
        onSubmit={submitJournalEntry}
      />

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default TripPlanMenu;
