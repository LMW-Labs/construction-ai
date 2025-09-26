import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        operator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        maintenanceRecords: {
          orderBy: {
            performedAt: 'desc',
          },
          take: 10,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      type,
      model,
      serialNumber,
      status,
      purchaseDate,
      purchasePrice,
      hourlyRate,
      dailyRate,
      location,
      notes,
      projectId,
      operatorId,
    } = await request.json()

    const equipment = await prisma.equipment.create({
      data: {
        name,
        type,
        model,
        serialNumber,
        status: status || 'AVAILABLE',
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        dailyRate: dailyRate ? parseFloat(dailyRate) : null,
        location,
        notes,
        projectId: projectId || null,
        operatorId: operatorId || null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        operator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(equipment, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create equipment' },
      { status: 500 }
    )
  }
}
