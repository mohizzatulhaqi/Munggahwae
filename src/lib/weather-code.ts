import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from 'lucide-react';

export interface WeatherCodeInfo {
  label: string;
  icon: LucideIcon;
}

const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { label: 'Cerah', icon: Sun },
  1: { label: 'Cerah Berawan', icon: CloudSun },
  2: { label: 'Berawan Sebagian', icon: CloudSun },
  3: { label: 'Berawan', icon: Cloud },
  45: { label: 'Berkabut', icon: CloudFog },
  48: { label: 'Berkabut', icon: CloudFog },
  51: { label: 'Gerimis Ringan', icon: CloudDrizzle },
  53: { label: 'Gerimis', icon: CloudDrizzle },
  55: { label: 'Gerimis Lebat', icon: CloudDrizzle },
  56: { label: 'Gerimis Beku', icon: CloudDrizzle },
  57: { label: 'Gerimis Beku Lebat', icon: CloudDrizzle },
  61: { label: 'Hujan Ringan', icon: CloudRain },
  63: { label: 'Hujan', icon: CloudRain },
  65: { label: 'Hujan Lebat', icon: CloudRainWind },
  66: { label: 'Hujan Beku', icon: CloudRain },
  67: { label: 'Hujan Beku Lebat', icon: CloudRainWind },
  71: { label: 'Salju Ringan', icon: CloudSnow },
  73: { label: 'Salju', icon: CloudSnow },
  75: { label: 'Salju Lebat', icon: CloudSnow },
  77: { label: 'Butiran Salju', icon: CloudSnow },
  80: { label: 'Hujan Ringan', icon: CloudRain },
  81: { label: 'Hujan Deras', icon: CloudRainWind },
  82: { label: 'Hujan Sangat Deras', icon: CloudRainWind },
  85: { label: 'Hujan Salju Ringan', icon: CloudSnow },
  86: { label: 'Hujan Salju Lebat', icon: CloudSnow },
  95: { label: 'Badai Petir', icon: CloudLightning },
  96: { label: 'Badai Petir + Es', icon: CloudLightning },
  99: { label: 'Badai Petir + Es Lebat', icon: CloudLightning },
};

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? { label: 'Tidak diketahui', icon: Cloud };
}
