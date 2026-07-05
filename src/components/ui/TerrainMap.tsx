'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { TrailMarkerData } from './terrain-map-inner';

const TerrainMapInner = dynamic(() => import('./terrain-map-inner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Memuat peta medan...
    </div>
  ),
});

interface TerrainMapProps {
  peakLat: number;
  peakLng: number;
  peakName: string;
  trails: TrailMarkerData[];
  className?: string;
}

const TerrainMap: React.FC<TerrainMapProps> = ({ peakLat, peakLng, peakName, trails, className }) => {
  return (
    <div className={className}>
      <TerrainMapInner peakLat={peakLat} peakLng={peakLng} peakName={peakName} trails={trails} />
    </div>
  );
};

export default TerrainMap;
export type { TrailMarkerData };
