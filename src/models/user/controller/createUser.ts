import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function createUser(req: NextRequest) {
  const { id, namaLengkap, email, password } = await req.json()
  const data = { id, namaLengkap, email, password }

  const created = await prisma.user.create({ data })

  if (!created) return NextResponse.json({ status: 500, isCreated: false })
  return NextResponse.json({ status: 200, isCreated: true })
}