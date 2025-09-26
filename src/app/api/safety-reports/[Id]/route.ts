// src/app/api/safety-reports/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const {
      title,
      description,
      severity,
      status,
      location,
      photos,
      resolution,
      resolvedAt,
    } = await request.json()

    const report = await prisma.safetyReport.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        severity,
        status,
        location,
        photos,
        resolution,
        resolvedAt: resolvedAt ? new Date(resolvedAt) : null,
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

    return NextResponse.json(report)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update safety report' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.safetyReport.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Safety report deleted successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to delete safety report' },
      { status: 500 }
    )
  }
} reports = await prisma.safetyReport.findMany({
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

// src/app/api/safety-reports/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.safetyReport.findUnique({
      where: {
        id: params.id,
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

    if (!report) {
      return NextResponse.json(
        { error: 'Safety report not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch safety report' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const