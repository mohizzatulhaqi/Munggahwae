'use client';
import { useEffect, useState } from 'react';
import AdminLayout from './admin-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
  Calendar,
  Upload,
  DollarSign,
  Check,
} from 'lucide-react';
import { getAllMountains } from '@/lib/mountain-data';
import Image from 'next/image';
import ProvinceFilter from '@/components/ui/ProvinceFilter';

const requiredFieldStyle = "after:content-['*'] after:ml-0.5 after:text-red-500";

interface TrailForm {
  name: string;
  description: string;
  icon: string;
  quota: number;
  available: number;
  dailyQuotas: { [date: string]: number };
}

const AdminMountainsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMountain, setSelectedMountain] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('Semua Provinsi');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);


  const [mountainForm, setMountainForm] = useState({
    name: '',
    location: '',
    province: '',
    quota: '',
    price: '',
    description: '',
    heroImage: null as File | null,
    trailDetails: [
      {
        name: '',
        description: '',
        icon: '/placeholder.svg?height=24&width=24',
        quota: 0,
        available: 0,
        dailyQuotas: {} as { [date: string]: number },
      },
    ] as TrailForm[],
    bookingTerms: [''],
  });

  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    province: '',
    quota: '',
    price: '',
    description: '',
    heroImage: null as File | null,
    galleryImages: [] as File[],
    trailDetails: [] as TrailForm[],
    bookingTerms: [''],
  });

  const [mountains, setMountains] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMountains() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/list');
        const result = await response.json();
        
        if (result.success) {
          // Transform data to match the expected format
          const transformedData = result.gunung.map((mountain: any) => ({
            id: mountain.id,
            name: mountain.nama,
            location: mountain.lokasi,
            province: mountain.provinsi || '',
            quota: mountain.kuotaPerHari,
            price: mountain.harga,
            description: mountain.deskripsi || '',
            image: mountain.gambar || '',
            trailCount: mountain.jalur,
          }));
          setMountains(transformedData);
        } else {
          setFetchError(result.message || 'Terjadi kesalahan saat mengambil data');
        }
      } catch (error: any) {
        setFetchError(error.message || 'Terjadi kesalahan saat mengambil data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMountains();
  }, []);


  const validateForm = (formData: any, isEdit = false) => {
    const newErrors: Record<string, string> = {};

    // Basic fields validation
    if (!formData.name.trim()) newErrors.name = 'Nama gunung wajib diisi';
    if (!formData.location.trim()) newErrors.location = 'Lokasi wajib diisi';
    if (!formData.province.trim()) newErrors.province = 'Provinsi wajib diisi';
    if (!formData.quota.trim()) newErrors.quota = 'Kuota wajib diisi';
    if (!formData.price.trim()) newErrors.price = 'Harga wajib diisi';
    if (!formData.description.trim()) newErrors.description = 'Deskripsi wajib diisi';
    
    // Only require heroImage for new mountains
    if (!isEdit && !formData.heroImage) {
      newErrors.heroImage = 'Foto utama wajib diupload';
    }

    // Numeric validation
    if (isNaN(Number(formData.quota))) newErrors.quota = 'Harus berupa angka';
    if (isNaN(Number(formData.price))) newErrors.price = 'Harus berupa angka';


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filteredMountains = mountains.filter(
    (mountain) =>
      (mountain.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mountain.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mountain.province?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedProvince === 'Semua Provinsi' || mountain.province === selectedProvince)
  );

  const handleEdit = (mountain: any) => {
    setSelectedMountain(mountain);
    setEditForm({
      name: mountain.name || '',
      location: mountain.location || '',
      province: mountain.province || '',
      quota: mountain.quota?.toString() || '',
      price: mountain.price?.toString() || '',
      description: mountain.description || '',
      heroImage: null,
      galleryImages: [],
      trailDetails: mountain.trailDetails || [
        {
          name: '',
          description: '',
          icon: '/placeholder.svg?height=24&width=24',
          quota: 0,
          available: 0,
          dailyQuotas: {},
        },
      ],
      bookingTerms: mountain.bookingTerms || [''],
    });
    setShowEditModal(true);
    setUploadedFile(null);
    setErrors({});
  };

  const handleDelete = async (mountainId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus gunung ini?')) {
      try {
        const response = await fetch(`/api/admin/delete?id=${mountainId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          // Refresh the mountains list
          const refreshResponse = await fetch('/api/admin/list');
          const refreshResult = await refreshResponse.json();
          
          if (refreshResult.success) {
            const transformedData = refreshResult.gunung.map((mountain: any) => ({
              id: mountain.id,
              name: mountain.nama,
              location: mountain.lokasi,
              province: mountain.provinsi || '',
              quota: mountain.kuotaPerHari,
              price: mountain.harga,
              description: mountain.deskripsi || '',
              image: mountain.gambar || '',
              trailCount: mountain.jalur,
            }));
            setMountains(transformedData);
          }
          
          // Show success message
          alert('Gunung berhasil dihapus!');
        } else {
          alert('Gagal menghapus gunung: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting mountain:', error);
        alert('Terjadi kesalahan saat menghapus gunung');
      }
    }
  };

  const addTrail = (isEdit = false) => {
    const newTrail = {
      name: '',
      description: '',
      icon: '/placeholder.svg?height=24&width=24',
      quota: 0,
      available: 0,
      dailyQuotas: {},
    };

    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        trailDetails: [...prev.trailDetails, newTrail],
      }));
    } else {
      setMountainForm((prev) => ({
        ...prev,
        trailDetails: [...prev.trailDetails, newTrail],
      }));
    }
  };

  const removeTrail = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        trailDetails: prev.trailDetails.filter((_, i) => i !== index),
      }));
    } else {
      setMountainForm((prev) => ({
        ...prev,
        trailDetails: prev.trailDetails.filter((_, i) => i !== index),
      }));
    }
    // Remove related errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`trailName-${index}`];
      delete newErrors[`trailDesc-${index}`];
      delete newErrors[`trailQuota-${index}`];
      return newErrors;
    });
  };

  const updateTrail = (index: number, field: keyof TrailForm, value: any, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        trailDetails: prev.trailDetails.map((trail, i) =>
          i === index ? { ...trail, [field]: value } : trail
        ),
      }));
    } else {
      setMountainForm((prev) => ({
        ...prev,
        trailDetails: prev.trailDetails.map((trail, i) =>
          i === index ? { ...trail, [field]: value } : trail
        ),
      }));
    }
    // Clear error if field is filled
    if ((field === 'name' || field === 'description') && value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [`trail${field === 'name' ? 'Name' : 'Desc'}-${index}`]: '',
      }));
    }
    if (field === 'quota' && !isNaN(Number(value))) {
      setErrors((prev) => ({
        ...prev,
        [`trailQuota-${index}`]: '',
      }));
    }
  };



  const handleSaveEdit = async () => {
    if (!validateForm(editForm, true)) return;

    try {
      // Convert image file to base64 or upload to storage
      let imageUrl = selectedMountain.image || '';
      if (uploadedFile) {
        // For now, we'll use a placeholder. In production, you'd upload to Supabase Storage
        imageUrl = '/images/img_depth_7_frame_0.png';
      }

      const mountainData = {
        id: selectedMountain.id,
        nama: editForm.name,
        kuota: parseInt(editForm.quota),
        harga: parseInt(editForm.price),
        deskripsi: editForm.description,
        gambar: imageUrl,
        provinsi: editForm.province,
        lokasi: editForm.location,
      };

      const response = await fetch('/api/admin/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mountainData),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the mountains list
        const refreshResponse = await fetch('/api/admin/list');
        const refreshResult = await refreshResponse.json();
        
        if (refreshResult.success) {
          const transformedData = refreshResult.gunung.map((mountain: any) => ({
            id: mountain.id,
            name: mountain.nama,
            location: mountain.lokasi,
            province: mountain.provinsi,
            quota: mountain.kuotaPerHari,
            price: mountain.harga,
            description: mountain.deskripsi,
            image: mountain.gambar,
            trailCount: mountain.jalur,
          }));
          setMountains(transformedData);
        }
        
        setShowEditModal(false);
        setSelectedMountain(null);
        setUploadedFile(null);
        setErrors({});
        
        // Show success message
        alert('Gunung berhasil diupdate!');
      } else {
        alert('Gagal mengupdate gunung: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating mountain:', error);
      alert('Terjadi kesalahan saat mengupdate gunung');
    }
  };

  const handleSaveAdd = async () => {
    if (!validateForm(mountainForm, false)) return;

    try {
      // Convert image file to base64 or upload to storage
      let imageUrl = '';
      if (mountainForm.heroImage) {
        // For now, we'll use a placeholder. In production, you'd upload to Supabase Storage
        imageUrl = '/images/img_depth_7_frame_0.png';
      }

      const mountainData = {
        nama: mountainForm.name,
        kuota: parseInt(mountainForm.quota),
        harga: parseInt(mountainForm.price),
        deskripsi: mountainForm.description,
        gambar: imageUrl,
        provinsi: mountainForm.province,
        lokasi: mountainForm.location,
      };

      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mountainData),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the mountains list
        const refreshResponse = await fetch('/api/admin/list');
        const refreshResult = await refreshResponse.json();
        
        if (refreshResult.success) {
          const transformedData = refreshResult.gunung.map((mountain: any) => ({
            id: mountain.id,
            name: mountain.nama,
            location: mountain.lokasi,
            province: mountain.provinsi,
            quota: mountain.kuotaPerHari,
            price: mountain.harga,
            description: mountain.deskripsi,
            image: mountain.gambar,
            trailCount: mountain.jalur,
          }));
          setMountains(transformedData);
        }
        
        setShowAddModal(false);
        setMountainForm({
          name: '',
          location: '',
          province: '',
          quota: '',
          price: '',
          description: '',
          heroImage: null,
          trailDetails: [
            {
              name: '',
              description: '',
              icon: '/placeholder.svg?height=24&width=24',
              quota: 0,
              available: 0,
              dailyQuotas: {},
            },
          ],
          bookingTerms: [''],
        });
        setUploadedFile(null);
        setErrors({});
        
        // Show success message
        alert('Gunung berhasil ditambahkan!');
      } else {
        alert('Gagal menambahkan gunung: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding mountain:', error);
      alert('Terjadi kesalahan saat menambahkan gunung');
    }
  };

  const renderMountainForm = (form: any, setForm: any, isEdit = false) => (
    <>
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-global-1 font-plus-jakarta">Informasi Dasar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={isEdit ? 'edit-name' : 'name'} className={requiredFieldStyle}>
              Nama Gunung
            </Label>
            <Input
              id={isEdit ? 'edit-name' : 'name'}
              placeholder="Contoh: Gunung Rinjani"
              value={form.name}
              onChange={(e) => {
                setForm((prev: any) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor={isEdit ? 'edit-location' : 'location'} className={requiredFieldStyle}>
              Lokasi
            </Label>
            <Input
              id={isEdit ? 'edit-location' : 'location'}
              placeholder="Contoh: Lombok"
              value={form.location}
              onChange={(e) => {
                setForm((prev: any) => ({ ...prev, location: e.target.value }));
                if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
              }}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
          <div>
            <Label htmlFor={isEdit ? 'edit-province' : 'province'} className={requiredFieldStyle}>
              Provinsi
            </Label>
            <Input
              id={isEdit ? 'edit-province' : 'province'}
              placeholder="Contoh: Nusa Tenggara Barat"
              value={form.province}
              onChange={(e) => {
                setForm((prev: any) => ({ ...prev, province: e.target.value }));
                if (errors.province) setErrors((prev) => ({ ...prev, province: '' }));
              }}
              className={errors.province ? 'border-red-500' : ''}
            />
            {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
          </div>
          <div>
            <Label htmlFor={isEdit ? 'edit-quota' : 'quota'} className={requiredFieldStyle}>
              Kuota Total Harian
            </Label>
            <Input
              id={isEdit ? 'edit-quota' : 'quota'}
              type="number"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="Contoh: 100 pendaki/hari"
              value={form.quota}
              onChange={(e) => {
                setForm((prev: any) => ({ ...prev, quota: e.target.value }));
                if (errors.quota) setErrors((prev) => ({ ...prev, quota: '' }));
              }}
              className={errors.quota ? 'border-red-500' : ''}
            />
            {errors.quota && <p className="text-red-500 text-sm mt-1">{errors.quota}</p>}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor={isEdit ? 'edit-price' : 'price'} className={requiredFieldStyle}>
              Harga Pendakian per Orang (Rp)
            </Label>
            <Input
              id={isEdit ? 'edit-price' : 'price'}
              type="number"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="150000"
              value={form.price}
              onChange={(e) => {
                setForm((prev: any) => ({ ...prev, price: e.target.value }));
                if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
              }}
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
        </div>
        <div>
          <Label
            htmlFor={isEdit ? 'edit-description' : 'description'}
            className={requiredFieldStyle}
          >
            Deskripsi
          </Label>
          <textarea
            id={isEdit ? 'edit-description' : 'description'}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Deskripsi lengkap tentang gunung..."
            value={form.description}
            onChange={(e) => {
              setForm((prev: any) => ({ ...prev, description: e.target.value }));
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Hero Image */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-global-1 font-plus-jakarta">
          Foto Utama Gunung <span className="text-red-500">*</span>
        </h3>
        {uploadedFile ? (
          <div className="flex items-center justify-center space-x-3 text-green-600">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-medium">File berhasil diupload</p>
              <p className="text-sm text-gray-600">{uploadedFile.name}</p>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-6 ${
              errors.heroImage ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm((prev: any) => ({ ...prev, heroImage: file }));
                  setUploadedFile(file);
                  if (errors.heroImage) setErrors((prev) => ({ ...prev, heroImage: '' }));
                }
              }}
              className="hidden"
              id={isEdit ? 'edit-hero-image' : 'hero-image'}
            />
            <label htmlFor={isEdit ? 'edit-hero-image' : 'hero-image'} className="cursor-pointer">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Klik untuk upload foto utama gunung</p>
                <p className="text-xs text-gray-500">Format: JPG, PNG (Max. 5MB)</p>
              </div>
            </label>
          </div>
        )}
        {errors.heroImage && <p className="text-red-500 text-sm mt-1">{errors.heroImage}</p>}
      </div>



      {/* Trail Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-global-1 font-plus-jakarta">
            Jalur Pendakian & Kuota
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={() => addTrail(isEdit)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Jalur
          </Button>
        </div>

        {form.trailDetails.map((trail: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-global-1">Jalur {index + 1}</h4>
              {form.trailDetails.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTrail(index, isEdit)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className={requiredFieldStyle}>Nama Jalur</Label>
                <Input
                  placeholder="Contoh: Jalur Senaru"
                  value={trail.name}
                  onChange={(e) => {
                    updateTrail(index, 'name', e.target.value, isEdit);
                    if (errors[`trailName-${index}`]) {
                      setErrors((prev) => ({ ...prev, [`trailName-${index}`]: '' }));
                    }
                  }}
                  className={errors[`trailName-${index}`] ? 'border-red-500' : ''}
                />
                {errors[`trailName-${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`trailName-${index}`]}</p>
                )}
              </div>
              <div>
                <Label>Total Kuota Jalur per hari</Label>
                <Input
                  type="number"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="35"
                  value={trail.quota || ''}
                  onChange={(e) => {
                    updateTrail(index, 'quota', parseInt(e.target.value) || 0, isEdit);
                    if (errors[`trailQuota-${index}`]) {
                      setErrors((prev) => ({ ...prev, [`trailQuota-${index}`]: '' }));
                    }
                  }}
                  className={errors[`trailQuota-${index}`] ? 'border-red-500' : ''}
                />
                {errors[`trailQuota-${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`trailQuota-${index}`]}</p>
                )}
              </div>
            </div>

            <div>
              <Label className={requiredFieldStyle}>Deskripsi Jalur</Label>
              <textarea
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 ${
                  errors[`trailDesc-${index}`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Deskripsi lengkap jalur pendakian..."
                value={trail.description}
                onChange={(e) => {
                  updateTrail(index, 'description', e.target.value, isEdit);
                  if (errors[`trailDesc-${index}`]) {
                    setErrors((prev) => ({ ...prev, [`trailDesc-${index}`]: '' }));
                  }
                }}
              />
              {errors[`trailDesc-${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`trailDesc-${index}`]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-global-1 font-plus-jakarta">
            Syarat dan Ketentuan Pendakian <span className="text-red-500">*</span>
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setForm((prev: any) => ({
                ...prev,
                bookingTerms: [...prev.bookingTerms, ''],
              }))
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Syarat
          </Button>
        </div>
        {form.bookingTerms.map((term: string, index: number) => (
          <div key={index} className="flex gap-3">
            <span className="text-sm text-gray-500 mt-2 min-w-[20px]">{index + 1}.</span>
            <div className="flex-1">
              <textarea
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 ${
                  errors[`term-${index}`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan syarat dan ketentuan..."
                value={term}
                onChange={(e) => {
                  const newTerms = [...form.bookingTerms];
                  newTerms[index] = e.target.value;
                  setForm((prev: any) => ({ ...prev, bookingTerms: newTerms }));
                  if (errors[`term-${index}`]) {
                    setErrors((prev) => ({ ...prev, [`term-${index}`]: '' }));
                  }
                }}
              />
              {errors[`term-${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`term-${index}`]}</p>
              )}
            </div>
            {form.bookingTerms.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setForm((prev: any) => ({
                    ...prev,
                    bookingTerms: prev.bookingTerms.filter((_: any, i: number) => i !== index),
                  }));
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[`term-${index}`];
                    return newErrors;
                  });
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-global-1 font-plus-jakarta">Kelola Gunung</h1>
            <p className="text-global-2 font-plus-jakarta">
              Kelola data gunung dan informasi pendakian
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Gunung
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari gunung, lokasi, atau provinsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <ProvinceFilter
                selectedProvince={selectedProvince}
                onProvinceChange={setSelectedProvince}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mountains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMountains.map((mountain) => (
            <Card key={mountain.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="w-full h-48 rounded-t-lg overflow-hidden">
                  <Image
                    src={mountain.image || '/placeholder.svg'}
                    alt={mountain.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                    style={{ objectFit: 'cover' }}
                    priority={false}
                  />
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => handleEdit(mountain)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(mountain.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-global-1 font-plus-jakarta mb-2">
                  {mountain.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {mountain.location}, {mountain.province}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Kuota: {mountain.quota} pendaki/hari</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Jalur: {mountain.trailCount || 0} jalur</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>Rp {mountain.price?.toLocaleString() || '0'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">{mountain.available}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Mountain Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <h2 className="text-xl font-semibold text-global-1 font-plus-jakarta">
                  Tambah Gunung Baru
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderMountainForm(mountainForm, setMountainForm, false)}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setUploadedFile(null);
                      setErrors({});
                    }}
                  >
                    Batal
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveAdd}>
                    Simpan Gunung
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Mountain Modal */}
        {showEditModal && selectedMountain && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <h2 className="text-xl font-semibold text-global-1 font-plus-jakarta">
                  Edit Gunung: {selectedMountain.name}
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderMountainForm(editForm, setEditForm, true)}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (Object.keys(errors).length > 0) {
                        if (!confirm('Ada field yang belum valid. Yakin ingin membatalkan?'))
                          return;
                      }
                      setShowEditModal(false);
                      setUploadedFile(null);
                      setErrors({});
                    }}
                  >
                    Batal
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveEdit}>
                    Update Gunung
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMountainsPage;