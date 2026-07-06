'use client';

import { useEffect, useState } from 'react';
import { Loader2, CalendarClock, Droplets, AlertTriangle } from 'lucide-react';
import { getWeatherCodeInfo, getWeatherSeverity } from '@/lib/weather-code';

interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationChance: number;
}

interface WeatherSnapshotEntry {
  weatherCode: number;
  precipitationChance: number;
}

interface WeatherForecastProps {
  planId: string;
  lat: number;
  lng: number;
  startDate: string;
  endDate: string;
}

const PRECIPITATION_JUMP_THRESHOLD = 25;

function snapshotKey(planId: string) {
  return `munggahwae:weather-snapshot:${planId}`;
}

function readSnapshot(planId: string): Record<string, WeatherSnapshotEntry> {
  try {
    const raw = localStorage.getItem(snapshotKey(planId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSnapshot(planId: string, days: DailyForecast[]) {
  try {
    const snapshot: Record<string, WeatherSnapshotEntry> = {};
    days.forEach((d) => {
      snapshot[d.date] = { weatherCode: d.weatherCode, precipitationChance: d.precipitationChance };
    });
    localStorage.setItem(snapshotKey(planId), JSON.stringify(snapshot));
  } catch {
    // ignore write failures (private browsing / storage disabled)
  }
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ planId, lat, lng, startDate, endDate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState<DailyForecast[] | null>(null);
  const [error, setError] = useState('');
  const [worsenedDates, setWorsenedDates] = useState<string[]>([]);

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
        if (cancelled) return;

        const previous = readSnapshot(planId);
        const worsened = matched
          .filter((d) => {
            const prev = previous[d.date];
            if (!prev) return false;
            const severityRose = getWeatherSeverity(d.weatherCode) > getWeatherSeverity(prev.weatherCode);
            const precipitationJumped =
              d.precipitationChance - prev.precipitationChance >= PRECIPITATION_JUMP_THRESHOLD;
            return severityRose || precipitationJumped;
          })
          .map((d) => d.date);

        setWorsenedDates(worsened);
        setDays(matched);
        writeSnapshot(planId, matched);
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
  }, [planId, lat, lng, startDate, endDate]);

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
    <div className="space-y-3">
      {worsenedDates.length > 0 && (
        <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Prakiraan cuaca memburuk sejak terakhir kali dicek untuk tanggal{' '}
            {worsenedDates
              .map((date) =>
                new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
              )
              .join(', ')}
            . Periksa kembali perlengkapan hujan/jas hujan.
          </span>
        </div>
      )}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {days.map((day) => {
          const { label, icon: Icon } = getWeatherCodeInfo(day.weatherCode);
          const isWorsened = worsenedDates.includes(day.date);
          const dateLabel = new Date(day.date).toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          });
          return (
            <div
              key={day.date}
              className={`shrink-0 w-32 rounded-xl border p-4 text-center ${
                isWorsened ? 'border-amber-300 bg-amber-50' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <p className="text-xs font-medium text-gray-500 mb-2">{dateLabel}</p>
              <Icon className={`w-8 h-8 mx-auto mb-2 ${isWorsened ? 'text-amber-600' : 'text-green-600'}`} />
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
    </div>
  );
};

export default WeatherForecast;
