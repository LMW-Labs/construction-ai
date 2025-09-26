import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const estimates = await prisma.costEstimate.findMany({
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        lineItems: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(estimates)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cost estimates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      projectId,
      lineItems,
      profitMargin,
      overheadCost,
      validUntil,
    } = await request.json()

    // Calculate totals
    const subtotal = lineItems.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice), 0
    )
    const overhead = overheadCost || 0
    const subtotalWithOverhead = subtotal + overhead
    const profit = (subtotalWithOverhead * (profitMargin || 0)) / 100
    const totalCost = subtotalWithOverhead + profit

    // Calculate category costs
    const laborCost = lineItems
      .filter((item: any) => item.category === 'Labor')
      .reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0)
    
    const materialCost = lineItems
      .filter((item: any) => item.category === 'Materials')
      .reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0)
    
    const equipmentCost = lineItems
      .filter((item: any) => item.category === 'Equipment')
      .reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0)

    const estimate = await prisma.costEstimate.create({
      data: {
        name,
        totalCost,
        laborCost,
        materialCost,
        equipmentCost,
        overheadCost: overhead,
        profitMargin: profitMargin || 0,
        projectId,
        validUntil: validUntil ? new Date(validUntil) : null,
        status: 'DRAFT',
        lineItems: {
          create: lineItems.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            category: item.category,
          })),
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        lineItems: true,
      },
    })

    return NextResponse.json(estimate, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create cost estimate' },
      { status: 500 }
    )
  }
}
