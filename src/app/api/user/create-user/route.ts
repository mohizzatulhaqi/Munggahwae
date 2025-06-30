import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/api/prisma'

export async function POST(req: NextRequest) {
  try {
    const { id, namaLengkap, email, password } = await req.json()

    // Optional: Validasi input
    if (!id || !namaLengkap || !email) {
      return NextResponse.json(
        { isCreated: false, message: "Data tidak lengkap" },
        { status: 400 }
      )
    }

    const created = await prisma.user.create({
      data: {
        id,
        namaLengkap,
        email,
        password,
         // ⚠️ sebaiknya tidak disimpan kalau pakai Supabase Auth
      },
    })

    return NextResponse.json(
      { isCreated: true, user: created },
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
