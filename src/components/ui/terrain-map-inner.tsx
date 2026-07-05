'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { type LatLngBoundsExpression, type LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

function dotIcon(color: string, size: number) {
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 2px ${color}55;"></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const peakIcon = dotIcon('#16a34a', 18);
const ascentIcon = dotIcon('#2563eb', 14);
const descentIcon = dotIcon('#d97706', 14);
const neutralIcon = dotIcon('#9ca3af', 10);

export interface TrailMarkerData {
  name: string;
  lat: number;
  lng: number;
  status: 'ascent' | 'descent' | 'none';
}

interface TerrainMapInnerProps {
  peakLat: number;
  peakLng: number;
  peakName: string;
  trails: TrailMarkerData[];
}

const TerrainMapInner: React.FC<TerrainMapInnerProps> = ({ peakLat, peakLng, peakName, trails }) => {
  const points: LatLngTuple[] = [[peakLat, peakLng], ...trails.map((t): LatLngTuple => [t.lat, t.lng])];
  const bounds: LatLngBoundsExpression = points;

  return (
    <MapContainer bounds={bounds} boundsOptions={{ padding: [30, 30] }} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        maxZoom={17}
      />
      <Marker position={[peakLat, peakLng]} icon={peakIcon}>
        <Popup>Puncak {peakName}</Popup>
      </Marker>
      {trails.map((trail) => (
        <Marker
          key={trail.name}
          position={[trail.lat, trail.lng]}
          icon={trail.status === 'ascent' ? ascentIcon : trail.status === 'descent' ? descentIcon : neutralIcon}
        >
          <Popup>
            {trail.name}
            {trail.status === 'ascent' && ' (Jalur Naik)'}
            {trail.status === 'descent' && ' (Jalur Turun)'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default TerrainMapInner;
