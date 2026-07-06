export async function fetchWeatherSummary(lat: number, lng: number, startDate: string, endDate: string) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=16`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const days: string[] = data.daily.time;
    const matched = days
      .map((date: string, i: number) => ({
        date,
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
        precipitationChance: data.daily.precipitation_probability_max[i],
      }))
      .filter((d) => d.date >= startDate && d.date <= endDate);
    if (matched.length === 0) return null;
    return matched
      .map((d) => `${d.date}: ${d.tempMin}-${d.tempMax}°C, peluang hujan ${d.precipitationChance}%`)
      .join('; ');
  } catch {
    return null;
  }
}
