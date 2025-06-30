import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/api/prisma"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { isLoggedIn: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      )
    }

    // Cek user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { isLoggedIn: false, message: "Email tidak ditemukan." },
        { status: 404 }
      )
    }

    // ⚠️ Perbandingan password biasa (harusnya hash di produksi)
    if (user.password !== password) {
      return NextResponse.json(
        { isLoggedIn: false, message: "Password salah." },
        { status: 401 }
      )
    }

    // Sukses login
    return NextResponse.json(
      {
        isLoggedIn: true,
        message: "Berhasil login.",
        user: {
          id: user.id,
          namaLengkap: user.namaLengkap,
          email: user.email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error saat login:", error)
    return NextResponse.json(
      { isLoggedIn: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    )
  }
}
