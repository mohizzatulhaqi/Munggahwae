import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { mountainsData } from '@/lib/mountain-data';
import { getTripPlanDTO } from '../../serialize';

interface Params {
  params: { id: string };
}

async function fetchWeatherSummary(lat: number, lng: number, startDate: string, endDate: string) {
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

export async function POST(request: Request, { params }: Params) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY belum diatur di server' }, { status: 500 });
  }

  const plan = await getTripPlanDTO(params.id);
  if (!plan) {
    return NextResponse.json({ error: 'Rencana tidak ditemukan' }, { status: 404 });
  }

  const mountain = mountainsData.find((m) => m.id === plan.mountainId);
  const weatherSummary = mountain
    ? await fetchWeatherSummary(mountain.coordinates.lat, mountain.coordinates.lng, plan.startDate, plan.endDate)
    : null;

  const duration = Math.ceil(
    (new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24),
  );

  const groupItemNames = plan.groupItems.map((i) => i.name);
  const membersContext = plan.members
    .map((m) => `- ${m.name}: sudah punya [${m.personalItems.map((i) => i.name).join(', ') || 'belum ada barang'}]`)
    .join('\n');

  const prompt = `Kamu adalah asisten pendakian gunung berpengalaman di Indonesia. Berikan saran perlengkapan tambahan yang BELUM ada di daftar, berdasarkan konteks berikut. Jangan mengulang barang yang sudah ada di daftar.

Gunung: ${plan.mountainName}${mountain ? ` (${mountain.description})` : ''}
Jalur naik: ${plan.ascentTrail ?? 'belum ditentukan'}
Jalur turun: ${plan.descentTrail ?? 'belum ditentukan'}
Durasi pendakian: ${duration} hari
Jumlah anggota kelompok: ${plan.members.length}
Prakiraan cuaca selama pendakian: ${weatherSummary ?? 'tidak tersedia (di luar jangkauan 16 hari)'}

Perlengkapan kelompok yang sudah ada: [${groupItemNames.join(', ') || 'belum ada'}]

Perlengkapan pribadi tiap anggota:
${membersContext}

Berikan maksimal 6 saran perlengkapan kelompok dan maksimal 4 saran perlengkapan pribadi PER ANGGOTA yang benar-benar relevan dan belum ada. Setiap saran harus punya alasan singkat (1 kalimat) yang mengaitkan ke gunung/jalur/cuaca/durasi di atas. Jika sebuah kategori sudah lengkap, boleh kembalikan array kosong untuk kategori itu.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            groupSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['name', 'reason'],
                propertyOrdering: ['name', 'reason'],
              },
            },
            personalSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  memberName: { type: Type.STRING },
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['memberName', 'name', 'reason'],
                propertyOrdering: ['memberName', 'name', 'reason'],
              },
            },
          },
          required: ['groupSuggestions', 'personalSuggestions'],
          propertyOrdering: ['groupSuggestions', 'personalSuggestions'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: 'Gagal mendapatkan saran dari AI' }, { status: 502 });
    }
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Gagal memanggil Gemini:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan saran dari AI' }, { status: 502 });
  }
}
