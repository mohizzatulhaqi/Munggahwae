'use client';

import { useEffect, useState } from 'react';
import { Loader2, CalendarClock, Droplets } from 'lucide-react';
import { getWeatherCodeInfo } from '@/lib/weather-code';

interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationChance: number;
}

interface WeatherForecastProps {
  lat: number;
  lng: number;
  startDate: string;
  endDate: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ lat, lng, startDate, endDate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState<DailyForecast[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=16`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Gagal memuat data cuaca');
        const data = await res.json();

        const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
          date,
          weatherCode: data.daily.weathercode[i],
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          precipitationChance: data.daily.precipitation_probability_max[i],
        }));

        const matched = daily.filter((d) => d.date >= startDate && d.date <= endDate);
        if (!cancelled) setDays(matched);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat data cuaca');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [lat, lng, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin mr-2" /> Memuat prakiraan cuaca...
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-gray-400 text-center py-8">{error}</p>;
  }

  if (!days || days.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 justify-center py-8 text-center px-4">
        <CalendarClock className="w-4 h-4 shrink-0" />
        Prakiraan cuaca hanya tersedia untuk 16 hari ke depan. Cek lagi mendekati tanggal keberangkatan.
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {days.map((day) => {
        const { label, icon: Icon } = getWeatherCodeInfo(day.weatherCode);
        const dateLabel = new Date(day.date).toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
        return (
          <div
            key={day.date}
            className="shrink-0 w-32 rounded-xl border border-gray-100 p-4 text-center bg-gray-50"
          >
            <p className="text-xs font-medium text-gray-500 mb-2">{dateLabel}</p>
            <Icon className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p className="text-xs text-gray-600 mb-2">{label}</p>
            <p className="text-sm font-semibold text-global-1">
              {day.tempMax}° / {day.tempMin}°
            </p>
            <p className="flex items-center justify-center gap-1 text-xs text-blue-600 mt-1">
              <Droplets className="w-3 h-3" /> {day.precipitationChance}%
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherForecast;
