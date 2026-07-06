import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { mountainsData } from '@/lib/mountain-data';
import type { TripChatMessage } from '@/lib/trip-plan-types';
import { getTripPlanDTO } from '../../serialize';
import { fetchWeatherSummary } from '../../weather-summary';

interface Params {
  params: { id: string };
}

const MAX_HISTORY = 20;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request, { params }: Params) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY belum diatur di server' }, { status: 500 });
  }

  const plan = await getTripPlanDTO(params.id);
  if (!plan) {
    return NextResponse.json({ error: 'Rencana tidak ditemukan' }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { messages?: unknown } | null;
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
  }

  const messages: TripChatMessage[] = [];
  for (const raw of body.messages.slice(-MAX_HISTORY)) {
    const m = raw as Partial<TripChatMessage>;
    if ((m.role !== 'user' && m.role !== 'model') || typeof m.text !== 'string' || !m.text.trim()) {
      return NextResponse.json({ error: 'Format pesan tidak valid' }, { status: 400 });
    }
    messages.push({ role: m.role, text: m.text.trim().slice(0, MAX_MESSAGE_LENGTH) });
  }
  if (messages[messages.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'Pesan terakhir harus dari pengguna' }, { status: 400 });
  }

  const mountain = mountainsData.find((m) => m.id === plan.mountainId);
  const weatherSummary = mountain
    ? await fetchWeatherSummary(mountain.coordinates.lat, mountain.coordinates.lng, plan.startDate, plan.endDate)
    : null;

  const duration = Math.max(
    1,
    Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
  );

  const itineraryContext =
    plan.itineraryDays && plan.itineraryDays.length > 0
      ? plan.itineraryDays
          .map((d) => `Hari ${d.day} (${d.date}) - ${d.title}: ${d.checkpoints.map((c) => c.name).join(' -> ')}`)
          .join('\n')
      : 'belum dibuat';

  const systemInstruction = `Kamu adalah asisten pendakian gunung berpengalaman di Indonesia yang mendampingi satu kelompok pendaki. Kamu sudah tahu detail rencana mereka:

Gunung: ${plan.mountainName}${mountain ? ` (${mountain.description})` : ''}
Jalur naik: ${plan.ascentTrail ?? 'belum ditentukan'}
Jalur turun: ${plan.descentTrail ?? 'belum ditentukan'}
Tanggal: ${plan.startDate} s/d ${plan.endDate} (${duration} hari)
Jumlah anggota: ${plan.members.length} (${plan.members.map((m) => m.name).join(', ')})
Prakiraan cuaca: ${weatherSummary ?? 'tidak tersedia (di luar jangkauan prakiraan 16 hari)'}
Itinerary:
${itineraryContext}

Aturan menjawab:
- Jawab dalam bahasa Indonesia yang santai tapi sopan, ringkas (umumnya di bawah 150 kata), langsung ke inti.
- Gunakan teks polos tanpa format markdown (tanpa tanda bintang, tanpa heading). Boleh pakai daftar bernomor sederhana atau tanda hubung.
- Manfaatkan konteks rencana di atas saat relevan (sebut jalur/tanggal/cuaca mereka, bukan jawaban generik).
- Untuk hal yang menyangkut keselamatan atau kondisi jalur terkini, ingatkan untuk konfirmasi ke basecamp/pemandu setempat.
- Jika pertanyaan di luar topik pendakian atau rencana ini, arahkan kembali dengan sopan.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      config: { systemInstruction },
    });

    const reply = response.text;
    if (!reply) {
      return NextResponse.json({ error: 'Gagal mendapatkan jawaban AI' }, { status: 502 });
    }
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Gagal memanggil Gemini:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan jawaban AI' }, { status: 502 });
  }
}
