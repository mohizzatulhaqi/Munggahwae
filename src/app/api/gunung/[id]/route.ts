import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const gunung = await prisma.gunung.findUnique({
      where: { id },
      include: {
        jalur: {
          orderBy: { name: 'asc' }
        },
        galeriGunung: {
          orderBy: { orderIndex: 'asc' }
        },
        peraturan: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!gunung) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gunung not found' 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mountain: gunung
    });

  } catch (error) {
    console.error('Error fetching gunung:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch gunung' 
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 