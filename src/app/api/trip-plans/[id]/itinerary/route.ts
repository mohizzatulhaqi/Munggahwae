import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { Prisma } from '@prisma/client';
import prisma from '@/app/api/prisma';
import { mountainsData } from '@/lib/mountain-data';
import type { ItineraryDay } from '@/lib/trip-plan-types';
import { getTripPlanDTO } from '../../serialize';
import { fetchWeatherSummary } from '../../weather-summary';

interface Params {
  params: { id: string };
}

const checkpointSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      note: { type: Type.STRING },
    },
    required: ['name', 'note'],
    propertyOrdering: ['name', 'note'],
  },
};

export async function POST(request: Request, { params }: Params) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY belum diatur di server' }, { status: 500 });
  }

  const plan = await getTripPlanDTO(params.id);
  if (!plan) {
    return NextResponse.json({ error: 'Rencana tidak ditemukan' }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as { day?: number };
  const targetDay = typeof body.day === 'number' ? body.day : null;

  const mountain = mountainsData.find((m) => m.id === plan.mountainId);
  const duration = Math.max(
    1,
    Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
  );

  const weatherSummary = mountain
    ? await fetchWeatherSummary(mountain.coordinates.lat, mountain.coordinates.lng, plan.startDate, plan.endDate)
    : null;

  const planContext = `Gunung: ${mountain?.name ?? plan.mountainName}${mountain ? ` (${mountain.description})` : ''}
Jalur naik: ${plan.ascentTrail ?? 'belum ditentukan'}
Jalur turun: ${plan.descentTrail ?? plan.ascentTrail ?? 'belum ditentukan'}
Durasi pendakian: ${duration} hari (tanggal ${plan.startDate} s/d ${plan.endDate})
Jumlah anggota kelompok: ${plan.members.length}
Prakiraan cuaca selama pendakian: ${weatherSummary ?? 'tidak tersedia (tanggal di luar jangkauan prakiraan 16 hari)'}`;

  const weatherInstruction = weatherSummary
    ? ' Pertimbangkan prakiraan cuaca di atas dalam catatan checkpoint: jika ada hari dengan peluang hujan tinggi, sarankan berangkat lebih pagi atau tiba di tempat berkemah/berlindung sebelum jam rawan hujan (di gunung Indonesia biasanya siang-sore).'
    : '';

  const ai = new GoogleGenAI({ apiKey });

  if (targetDay !== null) {
    const existingDays = plan.itineraryDays;
    if (!existingDays || existingDays.length === 0) {
      return NextResponse.json({ error: 'Belum ada itinerary untuk dibuat ulang per hari' }, { status: 400 });
    }
    const dayEntry = existingDays.find((d) => d.day === targetDay);
    if (!dayEntry) {
      return NextResponse.json({ error: `Hari ${targetDay} tidak ada di itinerary` }, { status: 400 });
    }

    const itineraryContext = existingDays
      .map((d) => `Hari ${d.day} (${d.date}) - ${d.title}: ${d.checkpoints.map((c) => c.name).join(' -> ')}`)
      .join('\n');

    const prompt = `Kamu adalah pemandu pendakian gunung berpengalaman di Indonesia. Sebuah itinerary pendakian sudah ada, tetapi HARI ${targetDay} perlu dibuat ulang. Buat ulang HANYA hari ${targetDay} (tanggal ${dayEntry.date}) dengan tetap konsisten terhadap hari-hari lain: titik awal hari ini harus menyambung dari checkpoint terakhir hari sebelumnya, dan checkpoint terakhirnya harus menyambung ke awal hari berikutnya (jika ada).

${planContext}

Itinerary saat ini:
${itineraryContext}

Beri judul singkat (mis. "Basecamp - Pos 3") dan daftar checkpoint berurutan (nama pos/lokasi + catatan singkat berisi estimasi jarak/waktu tempuh dan hal penting, 1 kalimat per checkpoint).${weatherInstruction}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              checkpoints: checkpointSchema,
            },
            required: ['title', 'checkpoints'],
            propertyOrdering: ['title', 'checkpoints'],
          },
        },
      });

      const text = response.text;
      if (!text) {
        return NextResponse.json({ error: 'Gagal mendapatkan itinerary dari AI' }, { status: 502 });
      }
      const parsed = JSON.parse(text) as { title: string; checkpoints: { name: string; note: string }[] };

      const days: ItineraryDay[] = existingDays.map((d) =>
        d.day === targetDay ? { ...d, title: parsed.title, checkpoints: parsed.checkpoints } : d,
      );

      await prisma.tripPlan.update({
        where: { id: params.id },
        data: { itineraryDays: days as unknown as Prisma.InputJsonValue },
      });

      return NextResponse.json({ days });
    } catch (error) {
      console.error('Gagal memanggil Gemini:', error);
      return NextResponse.json({ error: 'Gagal mendapatkan itinerary dari AI' }, { status: 502 });
    }
  }

  const prompt = `Kamu adalah pemandu pendakian gunung berpengalaman di Indonesia. Buatkan itinerary harian (hari per hari) yang realistis untuk pendakian berikut, berdasarkan pos/checkpoint yang umum dikenal di jalur ini jika kamu tahu jalur spesifiknya. Jika tidak tahu pos spesifik jalur ini, buat estimasi umum yang wajar berdasarkan pola pendakian gunung di Indonesia (basecamp -> pos-pos -> puncak -> turun).

${planContext}

Bagi itinerary menjadi tepat ${duration} hari. Untuk tiap hari, beri judul singkat (mis. "Basecamp - Pos 3") dan daftar checkpoint berurutan (nama pos/lokasi + catatan singkat berisi estimasi jarak/waktu tempuh dan hal penting, 1 kalimat per checkpoint).${weatherInstruction} Ingatkan bahwa ini estimasi umum dan sebaiknya dikonfirmasi ke pemandu/basecamp setempat sebagai checkpoint terakhir hari terakhir atau catatan penutup jika relevan.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  checkpoints: checkpointSchema,
                },
                required: ['day', 'title', 'checkpoints'],
                propertyOrdering: ['day', 'title', 'checkpoints'],
              },
            },
          },
          required: ['days'],
          propertyOrdering: ['days'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: 'Gagal mendapatkan itinerary dari AI' }, { status: 502 });
    }
    const parsed = JSON.parse(text) as { days: { day: number; title: string; checkpoints: { name: string; note: string }[] }[] };

    const startDate = new Date(plan.startDate);
    const days = parsed.days.map((d) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (d.day - 1));
      return {
        day: d.day,
        date: date.toISOString().slice(0, 10),
        title: d.title,
        checkpoints: d.checkpoints,
      };
    });

    await prisma.tripPlan.update({
      where: { id: params.id },
      data: { itineraryDays: days },
    });

    return NextResponse.json({ days });
  } catch (error) {
    console.error('Gagal memanggil Gemini:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan itinerary dari AI' }, { status: 502 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  await prisma.tripPlan.update({
    where: { id: params.id },
    data: { itineraryDays: Prisma.DbNull },
  });
  return NextResponse.json({ success: true });
}
