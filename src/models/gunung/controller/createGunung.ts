import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function createGunung(req: NextRequest) {
  const { id, nama, kuota, jalur, deskripsi, gambar, harga, peraturan } = await req.json()
  const data = { id, nama, kuota, jalur, deskripsi, gambar, harga, peraturan }

  const created = await prisma.gunung.create({ data })

  if (!created) return NextResponse.json({ status: 500, isCreated: false })
  return NextResponse.json({ status: 200, isCreated: true })
}