import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { mountainsData } from '@/lib/mountain-data';
import type { ReadinessFinding, ReadinessResult } from '@/lib/trip-plan-types';
import { getTripPlanDTO } from '../../serialize';
import { fetchWeatherSummary } from '../../weather-summary';

interface Params {
  params: { id: string };
}

const SEVERITIES: ReadinessFinding['severity'][] = ['tinggi', 'sedang', 'rendah'];

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

  const duration = Math.max(
    1,
    Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
  );
  const daysUntilStart = Math.ceil(
    (new Date(plan.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const membersContext = plan.members
    .map((m) => {
      const items =
        m.personalItems.map((i) => `${i.checked ? '[sudah dikemas]' : '[BELUM dikemas]'} ${i.name}`).join(', ') ||
        'belum ada barang sama sekali';
      return `- ${m.name} (patungan: ${m.hasPaid ? 'sudah bayar' : 'BELUM bayar'}): ${items}`;
    })
    .join('\n');

  const groupItemsContext = plan.groupItems.map((i) => i.name).join(', ') || 'belum ada';

  const itineraryContext =
    plan.itineraryDays && plan.itineraryDays.length > 0
      ? plan.itineraryDays.map((d) => `Hari ${d.day}: ${d.title}`).join('; ')
      : 'belum dibuat';

  const emergencyContext =
    plan.emergencyContactName && plan.emergencyContactPhone
      ? `sudah diisi (${plan.emergencyContactName})`
      : 'BELUM diisi';

  const prompt = `Kamu adalah pemimpin ekspedisi pendakian gunung berpengalaman di Indonesia. Lakukan audit kesiapan menyeluruh terhadap rencana pendakian berikut, lalu beri skor kesiapan 0-100 dan temuan yang harus ditindaklanjuti.

Gunung: ${plan.mountainName}${mountain ? ` (${mountain.description})` : ''}
Jalur naik: ${plan.ascentTrail ?? 'belum ditentukan'}
Jalur turun: ${plan.descentTrail ?? 'belum ditentukan'}
Durasi: ${duration} hari (tanggal ${plan.startDate} s/d ${plan.endDate})
Berangkat dalam: ${daysUntilStart > 0 ? `${daysUntilStart} hari lagi` : daysUntilStart === 0 ? 'HARI INI' : 'tanggal mulai sudah lewat'}
Prakiraan cuaca: ${weatherSummary ?? 'tidak tersedia (di luar jangkauan prakiraan 16 hari)'}
Itinerary harian: ${itineraryContext}
Kontak darurat: ${emergencyContext}

Perlengkapan kelompok: [${groupItemsContext}]

Anggota (${plan.members.length} orang) beserta status patungan dan barang pribadinya:
${membersContext}

Nilai aspek-aspek ini: kelengkapan perlengkapan kelompok vs gunung/durasi/cuaca (tenda, masak, air, navigasi, P3K), kelengkapan & progres packing barang pribadi tiap anggota (terutama perlengkapan wajib: jas hujan, jaket, headlamp, sepatu), status patungan, kontak darurat, keberadaan itinerary, dan kesesuaian sisa waktu persiapan. Skor: 90-100 hampir sempurna, 70-89 siap dengan catatan kecil, 50-69 ada kekurangan penting, di bawah 50 belum layak berangkat. Beri maksimal 8 temuan (severity "tinggi" untuk yang menyangkut keselamatan, "sedang" untuk penting tapi tidak berbahaya, "rendah" untuk saran kecil) dengan detail 1 kalimat yang actionable dan menyebut nama anggota/barang spesifik jika relevan, plus maksimal 5 hal yang sudah baik. Ringkasan 1-2 kalimat dalam bahasa Indonesia.`;

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
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, enum: ['tinggi', 'sedang', 'rendah'] },
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING },
                },
                required: ['severity', 'title', 'detail'],
                propertyOrdering: ['severity', 'title', 'detail'],
              },
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['score', 'summary', 'findings', 'strengths'],
          propertyOrdering: ['score', 'summary', 'findings', 'strengths'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: 'Gagal mendapatkan hasil cek kesiapan dari AI' }, { status: 502 });
    }
    const parsed = JSON.parse(text) as ReadinessResult;

    const result: ReadinessResult = {
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      summary: parsed.summary,
      findings: (parsed.findings ?? []).map((f) => ({
        ...f,
        severity: SEVERITIES.includes(f.severity) ? f.severity : 'sedang',
      })),
      strengths: parsed.strengths ?? [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Gagal memanggil Gemini:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan hasil cek kesiapan dari AI' }, { status: 502 });
  }
}
