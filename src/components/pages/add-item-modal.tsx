'use client';

import { useState } from 'react';
import type React from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X } from 'lucide-react';
import { fileToDataUrl, MAX_IMAGE_SIZE_BYTES } from '@/lib/file-to-data-url';

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  namePlaceholder: string;
  showPrice?: boolean;
  onSubmit: (values: { name: string; price?: number; imageUrl?: string }) => Promise<void>;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  open,
  onClose,
  title,
  namePlaceholder,
  showPrice,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setPrice('');
    setImagePreview(null);
    setError('');
  };

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
    if (!name.trim()) {
      setError('Nama barang harus diisi');
      return;
    }
    const priceValue = showPrice ? Number.parseInt(price, 10) : undefined;
    if (showPrice && (Number.isNaN(priceValue) || (priceValue ?? 0) < 0)) {
      setError('Harga harus diisi dengan angka yang valid');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit({
        name: name.trim(),
        price: priceValue,
        imageUrl: imagePreview ?? undefined,
      });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambahkan barang');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Nama Barang</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={namePlaceholder}
            className="h-11 rounded-xl"
            autoFocus
          />
        </div>

        {showPrice && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Harga</Label>
            <Input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="mis. 150000"
              className="h-11 rounded-xl"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Foto Barang {showPrice ? '/ Bukti Nota' : ''} (opsional)
          </Label>
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
            {isSubmitting ? 'Menyimpan...' : 'Tambah'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddItemModal;
