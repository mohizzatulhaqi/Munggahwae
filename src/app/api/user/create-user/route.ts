import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/app/api/prisma'

export async function POST(req: NextRequest) {
  try {
    const { namaLengkap, email, password } = await req.json()

    if (!namaLengkap || !email || !password) {
      return NextResponse.json(
        { isCreated: false, message: "Data tidak lengkap" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { isCreated: false, message: "Email sudah terdaftar" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const created = await prisma.user.create({
      data: {
        namaLengkap,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      { isCreated: true, user: { id: created.id, namaLengkap: created.namaLengkap, email: created.email } },
      { status: 200 }
    )
  } catch (error) {
    console.error("Gagal buat user:", error)
    return NextResponse.json(
      { isCreated: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
