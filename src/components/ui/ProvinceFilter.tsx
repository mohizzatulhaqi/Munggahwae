'use client';
import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface ProvinceFilterProps {
  selectedProvince: string;
  onProvinceChange: (province: string) => void;
}

const ProvinceFilter = ({ selectedProvince, onProvinceChange }: ProvinceFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const provinces = [
    'Semua Provinsi',
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Kepulauan Riau',
    'Jambi',
    'Sumatera Selatan',
    'Bangka Belitung',
    'Bengkulu',
    'Lampung',
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Banten',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Sulawesi Tengah',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Gorontalo',
    'Sulawesi Barat',
    'Maluku',
    'Maluku Utara',
    'Papua',
    'Papua Barat',
    'Papua Selatan',
    'Papua Tengah',
    'Papua Pegunungan',
    'Papua Barat Daya',
  ];

  const handleProvinceSelect = (province: string) => {
    onProvinceChange(province);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-8 px-4 bg-chipview-1 rounded-xl cursor-pointer transition-colors hover:bg-global-3"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium leading-[18px] text-global-1 font-plus-jakarta">
          {selectedProvince}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {provinces.map((province) => (
            <button
              key={province}
              onClick={() => handleProvinceSelect(province)}
              className={`w-full text-left px-4 py-2 text-sm font-plus-jakarta hover:bg-gray-50 transition-colors ${
                selectedProvince === province
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-global-1'
              }`}
            >
              {province}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default ProvinceFilter;
