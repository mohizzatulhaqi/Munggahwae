import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const searchQuery = searchParams.get('search');
    const provinsi = searchParams.get('provinsi');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build where clause
    const where: any = {};
    
    if (searchQuery) {
      where.OR = [
        { nama: { contains: searchQuery, mode: 'insensitive' } },
        { lokasi: { contains: searchQuery, mode: 'insensitive' } },
        { provinsi: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }
    
    if (provinsi) {
      where.provinsi = provinsi;
    }
    
    if (status) {
      where.status = status;
    }

    // Get total count
    const totalCount = await prisma.gunung.count({ where });

    // Get paginated data
    const gunungData = await prisma.gunung.findMany({
      where,
      skip: from,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        jalur: true,
        galeriGunung: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      mountains: gunungData,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching gunung data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch gunung data',
        mountains: []
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
