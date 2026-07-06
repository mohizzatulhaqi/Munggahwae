'use client';

import { useEffect, useState } from 'react';
import type React from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePlus, X } from 'lucide-react';
import { fileToDataUrl, MAX_IMAGE_SIZE_BYTES } from '@/lib/file-to-data-url';

const NO_AUTHOR = '__none__';

export interface JournalEntryValues {
  entryDate: string;
  note: string;
  imageUrl?: string | null;
  authorName?: string | null;
}

interface JournalEntryModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  submitLabel?: string;
  minDate: string;
  maxDate: string;
  members: { id: string; name: string }[];
  initialValues?: JournalEntryValues;
  onSubmit: (values: JournalEntryValues) => Promise<void>;
}

const JournalEntryModal: React.FC<JournalEntryModalProps> = ({
  open,
  onClose,
  title,
  submitLabel,
  minDate,
  maxDate,
  members,
  initialValues,
  onSubmit,
}) => {
  const [entryDate, setEntryDate] = useState('');
  const [note, setNote] = useState('');
  const [authorName, setAuthorName] = useState(NO_AUTHOR);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setEntryDate('');
    setNote('');
    setAuthorName(NO_AUTHOR);
    setImagePreview(null);
    setError('');
  };

  useEffect(() => {
    if (open) {
      setEntryDate(initialValues?.entryDate ?? minDate);
      setNote(initialValues?.note ?? '');
      setAuthorName(initialValues?.authorName ?? NO_AUTHOR);
      setImagePreview(initialValues?.imageUrl ?? null);
      setError('');
    }
    // Only re-sync when the modal opens, not on every parent re-render while it's open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError('Ukuran gambar maksimal 2MB');
      return;
    }
    setError('');
    setImagePreview(await fileToDataUrl(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryDate) {
      setError('Tanggal harus diisi');
      return;
    }
    if (!note.trim()) {
      setError('Catatan harus diisi');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit({
        entryDate,
        note: note.trim(),
        imageUrl: imagePreview ?? undefined,
        authorName: authorName === NO_AUTHOR ? undefined : authorName,
      });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan catatan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Tanggal</Label>
            <Input
              type="date"
              value={entryDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Dicatat oleh (opsional)</Label>
            <Select value={authorName} onValueChange={setAuthorName}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Tidak ditentukan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_AUTHOR}>Tidak ditentukan</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.name}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Catatan</Label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="mis. Sampai di Pos 3, cuaca cerah, semua sehat"
            rows={4}
            autoFocus
            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Foto (opsional)</Label>
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Hapus gambar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-600 cursor-pointer transition-colors">
              <ImagePlus className="w-6 h-6" />
              <span className="text-sm">Unggah gambar</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1 h-11 rounded-xl">
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 h-11 rounded-xl bg-green-600 hover:bg-green-700">
            {isSubmitting ? 'Menyimpan...' : submitLabel ?? 'Tambah'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JournalEntryModal;
