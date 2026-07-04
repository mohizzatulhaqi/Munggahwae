import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/api/prisma';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const pemesananId = formData.get('pemesananId') as string;
  const email = formData.get('email') as string;
  const nama = formData.get('fullName') as string;
  const noIdentitas = formData.get('idNumber') as string;
  const nomorTelepon = formData.get('phoneNumber') as string;
  const jenisKelamin = formData.get('gender') as string;
  const tempatLahir = formData.get('birthPlace') as string;
  const tanggalLahir = formData.get('birthDate') as string;
  const isCompanion = formData.get('isCompanion') === 'true';
  const fileKtp = formData.get('idCardFile') as File | null;

  if (!pemesananId || !email || !nama || !noIdentitas || !nomorTelepon || !jenisKelamin) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  let fileKtpDataUrl: string | null = null;
  if (fileKtp) {
    const buffer = Buffer.from(await fileKtp.arrayBuffer());
    fileKtpDataUrl = `data:${fileKtp.type};base64,${buffer.toString('base64')}`;
  }

  try {
    const anggota = await prisma.anggotaPemesan.create({
      data: {
        pemesananId,
        email,
        nama,
        noIdentitas,
        nomorTelepon,
        jenisKelamin,
        tempatLahir: tempatLahir || null,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        isCompanion,
        fileKtp: fileKtpDataUrl,
      },
    });

    return NextResponse.json({ success: true, data: anggota }, { status: 200 });
  } catch (error) {
    console.error('Gagal menyimpan data pemesan:', error);
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}
