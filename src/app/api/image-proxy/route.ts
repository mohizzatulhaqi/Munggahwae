import { NextResponse } from 'next/server';

const ALLOWED_HOSTNAMES = ['upload.wikimedia.org'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('url');
  if (!target) {
    return NextResponse.json({ error: 'Parameter url wajib diisi' }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return NextResponse.json({ error: 'url tidak valid' }, { status: 400 });
  }

  if (!ALLOWED_HOSTNAMES.includes(targetUrl.hostname)) {
    return NextResponse.json({ error: 'Hostname tidak diizinkan' }, { status: 400 });
  }

  const upstream = await fetch(targetUrl.toString(), {
    headers: {
      'User-Agent': 'MunggahwaeApp/1.0 (https://munggahwae.app; contact: mihkiki489@gmail.com)',
    },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: 'Gagal memuat gambar' }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
