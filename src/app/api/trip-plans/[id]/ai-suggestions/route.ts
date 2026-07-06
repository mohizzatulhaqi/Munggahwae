import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { mountainsData } from '@/lib/mountain-data';
import { getTripPlanDTO } from '../../serialize';
import { fetchWeatherSummary } from '../../weather-summary';

interface Params {
  params: { id: string };
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

  const itineraryContext =
    plan.itineraryDays && plan.itineraryDays.length > 0
      ? plan.itineraryDays
          .map(
            (d) =>
              `Hari ${d.day} (${d.date}) - ${d.title}:\n${d.checkpoints.map((c) => `  - ${c.name}: ${c.note}`).join('\n')}`,
          )
          .join('\n')
      : null;

  const prompt = `Kamu adalah asisten pendakian gunung berpengalaman di Indonesia. Berikan saran perlengkapan tambahan yang BELUM ada di daftar, berdasarkan konteks berikut. Jangan mengulang barang yang sudah ada di daftar.

Gunung: ${plan.mountainName}${mountain ? ` (${mountain.description})` : ''}
Jalur naik: ${plan.ascentTrail ?? 'belum ditentukan'}
Jalur turun: ${plan.descentTrail ?? 'belum ditentukan'}
Durasi pendakian: ${duration} hari
Jumlah anggota kelompok: ${plan.members.length}
Prakiraan cuaca selama pendakian: ${weatherSummary ?? 'tidak tersedia (di luar jangkauan 16 hari)'}
${itineraryContext ? `\nItinerary harian yang sudah direncanakan:\n${itineraryContext}\n` : ''}
Perlengkapan kelompok yang sudah ada: [${groupItemNames.join(', ') || 'belum ada'}]

Perlengkapan pribadi tiap anggota:
${membersContext}

Berikan maksimal 6 saran perlengkapan kelompok dan maksimal 4 saran perlengkapan pribadi PER ANGGOTA yang benar-benar relevan dan belum ada. Setiap saran harus punya alasan singkat (1 kalimat) yang mengaitkan ke gunung/jalur/cuaca/durasi${itineraryContext ? '/itinerary' : ''} di atas.${itineraryContext ? ' Gunakan itinerary untuk memperkirakan jumlah malam berkemah, lokasi bermalam dan ketinggiannya, kebutuhan air/logistik per etape, serta perlengkapan khusus summit attack (mis. headlamp, sarung tangan, jaket tebal untuk berangkat dini hari).' : ''} Jika sebuah kategori sudah lengkap, boleh kembalikan array kosong untuk kategori itu.`;

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
