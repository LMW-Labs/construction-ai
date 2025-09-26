import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const reports = await prisma.safetyReport.findMany({
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch safety reports' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      severity,
      location,
      photos,
      projectId,
      reporterId,
    } = await request.json()

    // For now, assume reporterId comes from auth
    // In real app, get from authenticated user
    const defaultReporterId = reporterId || 'cmg03vdjv0007619014fbsehl'

    const report = await prisma.safetyReport.create({
      data: {
        title,
        description,
        severity,
        location,
        photos: photos || [],
        projectId,
        reporterId: defaultReporterId,
        status: 'OPEN',
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create safety report' },
      { status: 500 }
    )
  }
}
