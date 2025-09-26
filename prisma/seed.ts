import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Users
  console.log('👥 Creating users...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.manager@construction.com',
        name: 'John Smith',
        role: 'PROJECT_MANAGER',
        phone: '+1 (555) 123-4567',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.contractor@construction.com',
        name: 'Sarah Johnson',
        role: 'CONTRACTOR',
        phone: '+1 (555) 234-5678',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.worker@construction.com',
        name: 'Mike Williams',
        role: 'WORKER',
        phone: '+1 (555) 345-6789',
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa.inspector@construction.com',
        name: 'Lisa Davis',
        role: 'SAFETY_INSPECTOR',
        phone: '+1 (555) 456-7890',
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@construction.com',
        name: 'Admin User',
        role: 'ADMIN',
        phone: '+1 (555) 567-8901',
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create Projects
  console.log('🏗️ Creating projects...')
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Downtown Office Complex',
        description: '15-story office building with underground parking and retail space',
        status: 'IN_PROGRESS',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-31'),
        budget: 15000000,
        actualCost: 8500000,
        address: '123 Main Street, Downtown City, CA 90210',
        ownerId: users[0].id, // John Smith
      },
    }),
    prisma.project.create({
      data: {
        name: 'Residential Complex Phase 1',
        description: '50-unit apartment complex with amenities',
        status: 'PLANNING',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        budget: 8500000,
        actualCost: 1200000,
        address: '456 Oak Avenue, Suburbia, CA 90211',
        ownerId: users[1].id, // Sarah Johnson
      },
    }),
    prisma.project.create({
      data: {
        name: 'Highway Bridge Renovation',
        description: 'Complete renovation of 200m highway bridge including seismic upgrades',
        status: 'IN_PROGRESS',
        startDate: new Date('2023-11-01'),
        endDate: new Date('2024-06-30'),
        budget: 5500000,
        actualCost: 4800000,
        address: 'Highway 101, Mile Marker 45, CA',
        ownerId: users[0].id, // John Smith
      },
    }),
    prisma.project.create({
      data: {
        name: 'School Expansion',
        description: 'New classroom wing and gymnasium addition',
        status: 'COMPLETED',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-12-15'),
        budget: 2800000,
        actualCost: 2750000,
        address: '789 Education Drive, Schooltown, CA 90212',
        ownerId: users[1].id, // Sarah Johnson
      },
    }),
    prisma.project.create({
      data: {
        name: 'Industrial Warehouse',
        description: '100,000 sq ft distribution center with automated systems',
        status: 'ON_HOLD',
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-09-30'),
        budget: 12000000,
        actualCost: 3200000,
        address: '321 Industrial Blvd, Logistics Park, CA 90213',
        ownerId: users[0].id, // John Smith
      },
    }),
  ])

  console.log(`✅ Created ${projects.length} projects`)

  // Add project members
  console.log('👷 Adding project members...')
  const projectMembers = await Promise.all([
    // Downtown Office Complex members
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        userId: users[1].id, // Sarah as contractor
        role: 'Lead Contractor',
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        userId: users[2].id, // Mike as worker
        role: 'Site Foreman',
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        userId: users[3].id, // Lisa as inspector
        role: 'Safety Inspector',
      },
    }),
    // Residential Complex members
    prisma.projectMember.create({
      data: {
        projectId: projects[1].id,
        userId: users[2].id, // Mike as worker
        role: 'Construction Supervisor',
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[1].id,
        userId: users[3].id, // Lisa as inspector
        role: 'Quality Control',
      },
    }),
  ])

  console.log(`✅ Created ${projectMembers.length} project memberships`)

  // Create Tasks
  console.log('📋 Creating tasks...')
  const tasks = await Promise.all([
    // Downtown Office Complex tasks
    prisma.task.create({
      data: {
        title: 'Foundation Excavation',
        description: 'Excavate and prepare foundation for floors B1-B3',
        status: 'COMPLETED',
        priority: 'HIGH',
        startDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        estimatedHours: 320,
        actualHours: 298,
        projectId: projects[0].id,
        completedAt: new Date('2024-02-12'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Steel Frame Installation',
        description: 'Install steel framework for floors 1-5',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        startDate: new Date('2024-02-20'),
        dueDate: new Date('2024-04-15'),
        estimatedHours: 480,
        actualHours: 320,
        projectId: projects[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Electrical Rough-In',
        description: 'Install electrical conduits and wiring for floors 1-3',
        status: 'TODO',
        priority: 'MEDIUM',
        startDate: new Date('2024-05-01'),
        dueDate: new Date('2024-06-15'),
        estimatedHours: 240,
        projectId: projects[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'HVAC System Installation',
        description: 'Install heating, ventilation, and air conditioning systems',
        status: 'TODO',
        priority: 'MEDIUM',
        startDate: new Date('2024-06-01'),
        dueDate: new Date('2024-07-30'),
        estimatedHours: 360,
        projectId: projects[0].id,
      },
    }),
    // Highway Bridge tasks
    prisma.task.create({
      data: {
        title: 'Traffic Diversion Setup',
        description: 'Set up temporary traffic routes and safety barriers',
        status: 'COMPLETED',
        priority: 'URGENT',
        startDate: new Date('2023-11-01'),
        dueDate: new Date('2023-11-15'),
        estimatedHours: 80,
        actualHours: 76,
        projectId: projects[2].id,
        completedAt: new Date('2023-11-14'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Bridge Deck Removal',
        description: 'Remove old concrete deck and prepare for new installation',
        status: 'COMPLETED',
        priority: 'HIGH',
        startDate: new Date('2023-11-20'),
        dueDate: new Date('2024-01-15'),
        estimatedHours: 200,
        actualHours: 210,
        projectId: projects[2].id,
        completedAt: new Date('2024-01-18'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Seismic Upgrade Installation',
        description: 'Install new seismic dampeners and reinforcements',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        startDate: new Date('2024-02-01'),
        dueDate: new Date('2024-04-30'),
        estimatedHours: 280,
        actualHours: 180,
        projectId: projects[2].id,
      },
    }),
  ])

  console.log(`✅ Created ${tasks.length} tasks`)

  // Create Task Assignments
  console.log('🎯 Creating task assignments...')
  const taskAssignments = await Promise.all([
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[0].id, // Foundation Excavation
        userId: users[2].id, // Mike Williams
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[1].id, // Steel Frame Installation
        userId: users[2].id, // Mike Williams
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[1].id, // Steel Frame Installation
        userId: users[1].id, // Sarah Johnson
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[6].id, // Seismic Upgrade Installation
        userId: users[1].id, // Sarah Johnson
      },
    }),
  ])

  console.log(`✅ Created ${taskAssignments.length} task assignments`)

  // Create Equipment
  console.log('🚜 Creating equipment...')
  const equipment = await Promise.all([
    prisma.equipment.create({
      data: {
        name: 'CAT 320D Excavator',
        type: 'EXCAVATOR',
        model: 'CAT 320D',
        serialNumber: 'CAT320D001',
        status: 'IN_USE',
        purchaseDate: new Date('2022-03-15'),
        purchasePrice: 285000,
        hourlyRate: 150,
        dailyRate: 1200,
        lastMaintenance: new Date('2024-01-15'),
        nextMaintenance: new Date('2024-04-15'),
        location: 'Downtown Office Complex',
        projectId: projects[0].id,
        operatorId: users[2].id,
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Liebherr Tower Crane',
        type: 'CRANE',
        model: 'LTM 1070-4.2',
        serialNumber: 'LTM1070001',
        status: 'IN_USE',
        purchaseDate: new Date('2021-08-20'),
        purchasePrice: 450000,
        hourlyRate: 200,
        dailyRate: 1600,
        lastMaintenance: new Date('2024-02-01'),
        nextMaintenance: new Date('2024-05-01'),
        location: 'Downtown Office Complex',
        projectId: projects[0].id,
        operatorId: users[1].id,
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'John Deere 544K Loader',
        type: 'LOADER',
        model: '544K',
        serialNumber: 'JD544K001',
        status: 'AVAILABLE',
        purchaseDate: new Date('2023-01-10'),
        purchasePrice: 195000,
        hourlyRate: 120,
        dailyRate: 960,
        lastMaintenance: new Date('2024-01-20'),
        nextMaintenance: new Date('2024-04-20'),
        location: 'Equipment Yard',
      },
    }),
  ])

  console.log(`✅ Created ${equipment.length} equipment items`)

  // Create Safety Reports
  console.log('⚠️ Creating safety reports...')
  const safetyReports = await Promise.all([
    prisma.safetyReport.create({
      data: {
        title: 'Missing Safety Barriers',
        description: 'Some sections of the construction site lack proper safety barriers around excavation areas.',
        severity: 'HIGH',
        status: 'RESOLVED',
        location: 'Downtown Office Complex - Zone B',
        photos: [
          'https://example.com/safety-photo-1.jpg',
          'https://example.com/safety-photo-2.jpg'
        ],
        resolution: 'Installed additional safety barriers and warning signs in all excavation zones.',
        resolvedAt: new Date('2024-02-10'),
        projectId: projects[0].id,
        reporterId: users[3].id, // Lisa Davis
      },
    }),
    prisma.safetyReport.create({
      data: {
        title: 'Worker Without Hard Hat',
        description: 'Observed worker in steel installation area not wearing required hard hat.',
        severity: 'MEDIUM',
        status: 'IN_PROGRESS',
        location: 'Downtown Office Complex - Floor 3',
        photos: ['https://example.com/safety-photo-3.jpg'],
        projectId: projects[0].id,
        reporterId: users[3].id, // Lisa Davis
      },
    }),
  ])

  console.log(`✅ Created ${safetyReports.length} safety reports`)

  console.log('🎉 Seed completed successfully!')
  console.log(`
📊 Summary:
- Users: ${users.length}
- Projects: ${projects.length}
- Tasks: ${tasks.length}
- Equipment: ${equipment.length}
- Safety Reports: ${safetyReports.length}
- Project Members: ${projectMembers.length}
- Task Assignments: ${taskAssignments.length}
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