'use client';

import { useEffect, useState } from 'react';
import type React from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface GroupSuggestion {
  name: string;
  reason: string;
}

interface PersonalSuggestion {
  memberName: string;
  name: string;
  reason: string;
}

interface AiSuggestionsModalProps {
  open: boolean;
  onClose: () => void;
  planId: string;
  members: { id: string; name: string }[];
  onAddGroupItem: (name: string) => Promise<void>;
  onAddPersonalItem: (memberId: string, name: string) => Promise<void>;
}

const AiSuggestionsModal: React.FC<AiSuggestionsModalProps> = ({
  open,
  onClose,
  planId,
  members,
  onAddGroupItem,
  onAddPersonalItem,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [groupSuggestions, setGroupSuggestions] = useState<GroupSuggestion[]>([]);
  const [personalSuggestions, setPersonalSuggestions] = useState<PersonalSuggestion[]>([]);
  const [checkedGroup, setCheckedGroup] = useState<Set<number>>(new Set());
  const [checkedPersonal, setCheckedPersonal] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    setError('');
    fetch(`/api/trip-plans/${planId}/ai-suggestions`, { method: 'POST' })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? 'Gagal mendapatkan saran AI');
        }
        return res.json();
      })
      .then((data: { groupSuggestions: GroupSuggestion[]; personalSuggestions: PersonalSuggestion[] }) => {
        setGroupSuggestions(data.groupSuggestions ?? []);
        setPersonalSuggestions(data.personalSuggestions ?? []);
        setCheckedGroup(new Set((data.groupSuggestions ?? []).map((_, i) => i)));
        setCheckedPersonal(new Set((data.personalSuggestions ?? []).map((_, i) => i)));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal mendapatkan saran AI'))
      .finally(() => setIsLoading(false));
  }, [open, planId]);

  const toggleGroup = (index: number) => {
    setCheckedGroup((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const togglePersonal = (index: number) => {
    setCheckedPersonal((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const totalSelected = checkedGroup.size + checkedPersonal.size;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      for (const i of Array.from(checkedGroup)) {
        await onAddGroupItem(groupSuggestions[i].name);
      }
      for (const i of Array.from(checkedPersonal)) {
        const suggestion = personalSuggestions[i];
        const member = members.find((m) => m.name === suggestion.memberName);
        if (member) await onAddPersonalItem(member.id, suggestion.name);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Saran AI untuk Perlengkapan">
      {isLoading && (
        <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Menyusun saran berdasarkan gunung, jalur, dan cuaca...
        </div>
      )}

      {!isLoading && error && <p className="text-sm text-red-600 py-6 text-center">{error}</p>}

      {!isLoading && !error && (
        <div className="space-y-6">
          {groupSuggestions.length === 0 && personalSuggestions.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-6">
              Tidak ada saran tambahan — perlengkapan sudah cukup lengkap.
            </p>
          )}

          {groupSuggestions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-global-1 mb-2">Perlengkapan Kelompok</h3>
              <div className="space-y-2">
                {groupSuggestions.map((s, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox checked={checkedGroup.has(i)} onCheckedChange={() => toggleGroup(i)} className="mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-medium text-global-1">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.reason}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {personalSuggestions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-global-1 mb-2">Perlengkapan Pribadi</h3>
              <div className="space-y-2">
                {personalSuggestions.map((s, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={checkedPersonal.has(i)}
                      onCheckedChange={() => togglePersonal(i)}
                      className="mt-0.5"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-global-1">
                        {s.name} <span className="text-xs text-gray-400 font-normal">— {s.memberName}</span>
                      </p>
                      <p className="text-xs text-gray-500">{s.reason}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 rounded-xl">
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || totalSelected === 0}
              className="flex-1 h-11 rounded-xl bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Menambahkan...' : `Tambahkan (${totalSelected})`}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AiSuggestionsModal;
