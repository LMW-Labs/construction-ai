import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  console.log('🧹 Clearing existing data...')
  // Delete in dependency order to satisfy foreign keys
  await prisma.costEstimateLineItem.deleteMany()
  await prisma.taskAssignment.deleteMany()
  await prisma.maintenanceRecord.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.task.deleteMany()
  await prisma.costEstimate.deleteMany()
  await prisma.safetyReport.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.project.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('👥 Creating users...')
  // Idempotent user creation: upsert each user by email so repeated seeds won't fail
  const userData = [
    {
      email: 'john.manager@construction.com',
      name: 'John Smith',
      role: 'PROJECT_MANAGER',
    },
    {
      email: 'sarah.foreman@construction.com',
      name: 'Sarah Johnson',
      role: 'FOREMAN',
    },
    {
      email: 'mike.operator@construction.com',
      name: 'Mike Wilson',
      role: 'OPERATOR',
    },
    {
      email: 'lisa.inspector@construction.com',
      name: 'Lisa Davis',
      role: 'SAFETY_INSPECTOR',
    },
  ]

  await Promise.all(
    userData.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: u,
      })
    )
  )
  const users = await prisma.user.findMany()
  const projectManager = users.find(u => u.role === 'PROJECT_MANAGER')
  const foreman = users.find(u => u.role === 'FOREMAN')
  const operator = users.find(u => u.role === 'OPERATOR')
  const safetyInspector = users.find(u => u.role === 'SAFETY_INSPECTOR')

  if (!projectManager || !foreman || !operator || !safetyInspector) {
    throw new Error('Required user roles not found after seeding.')
  }

  // Create projects
  console.log('🏗️ Creating projects...')
  const project = await prisma.project.create({
    data: {
      name: 'Downtown Office Complex',
      description: 'Modern 15-story office building with underground parking',
      status: 'IN_PROGRESS',
      budget: 2500000,
      actualCost: 1800000,
      address: '123 Main Street, Downtown',
      ownerId: projectManager.id,
      members: {
        create: [
          { userId: foreman.id },
          { userId: operator.id },
          { userId: safetyInspector.id },
        ],
      },
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Residential Complex "The Heights"',
      description: 'Luxury apartment complex with 200 units and amenities.',
      status: 'PLANNING',
      budget: 15000000,
      actualCost: 50000,
      address: '456 Oak Avenue, Uptown',
      ownerId: projectManager.id,
    },
  })

  // Create tasks for the first project (use create + nested assignments since Task uses TaskAssignment relation)
  console.log('📋 Creating tasks...')
  await Promise.all([
    prisma.task.create({
      data: {
        title: 'Foundation Pouring',
        description: 'Pour concrete for the main building foundation.',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 10)),
        projectId: project.id,
        assignments: {
          create: [{ userId: foreman.id }],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: 'Steel Frame Erection',
        description: 'Erect the steel structure for floors 1-5.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 20)),
        projectId: project.id,
        assignments: {
          create: [{ userId: foreman.id }],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: 'Install HVAC Systems',
        description: 'Install HVAC units on the first 3 floors.',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 45)),
        projectId: project.id,
        assignments: {
          create: [{ userId: operator.id }],
        },
      },
    }),
  ])

  // Create equipment
  console.log('🚜 Creating equipment...')
  await prisma.equipment.createMany({
    data: [
      {
        name: 'Excavator CAT 336',
        type: 'HEAVY',
        status: 'OPERATIONAL',
        purchaseDate: new Date('2022-03-15'),
        purchasePrice: 250000,
        notes: 'Current value: 220000',
      },
      {
        name: 'Concrete Mixer Truck',
        type: 'VEHICLE',
        status: 'MAINTENANCE',
        purchaseDate: new Date('2021-08-01'),
        purchasePrice: 120000,
        notes: 'Current value: 95000',
      },
    ],
  })

  // Create a safety report
  console.log('🛡️ Creating safety report...')
  await prisma.safetyReport.create({
    data: {
      title: 'Minor slip on wet surface',
      description: 'An operator slipped on a wet surface near the concrete mixing area. No injuries sustained.',
      severity: 'LOW',
      status: 'RESOLVED',
      location: 'Zone B, Concrete Mixing Area',
      resolution: 'Area was dried, and non-slip mats were installed. Added to daily checklist.',
      reporterId: operator.id,
      projectId: project.id,
    },
  })

  // Create a cost estimate
  console.log('💰 Creating cost estimate...')
  await prisma.costEstimate.create({
    data: {
      name: 'Initial Foundation Estimate',
      status: 'APPROVED',
      totalCost: 450000,
      laborCost: 120000,
      materialCost: 300000,
      equipmentCost: 30000,
      projectId: project.id,
      lineItems: {
        create: [
          {
            description: 'Concrete (300 cubic yards)',
            quantity: 300,
            unit: 'cubic yard',
            unitPrice: 175,
            totalPrice: 52500,
            category: 'Materials',
          },
          {
            description: 'Foundation Labor',
            quantity: 500,
            unit: 'hours',
            unitPrice: 50,
            totalPrice: 25000,
            category: 'Labor',
          },
        ],
      },
    },
  })

  console.log('✅ Seed completed successfully!')
  const counts = await prisma.$transaction([
    prisma.user.count(),
    prisma.project.count(),
    prisma.task.count(),
    prisma.equipment.count(),
    prisma.safetyReport.count(),
    prisma.costEstimate.count(),
  ])
  console.log(`Seeded:
  - ${counts[0]} users
  - ${counts[1]} projects
  - ${counts[2]} tasks
  - ${counts[3]} equipment
  - ${counts[4]} safety reports
  - ${counts[5]} cost estimates
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })