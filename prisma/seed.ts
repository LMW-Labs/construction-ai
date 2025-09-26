import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')
  
  // Create users
  console.log('Creating users...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.manager@construction.com',
        name: 'John Smith',
        role: 'PROJECT_MANAGER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.foreman@construction.com',
        name: 'Sarah Johnson',
        role: 'FOREMAN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.operator@construction.com',
        name: 'Mike Wilson',
        role: 'OPERATOR',
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa.inspector@construction.com',
        name: 'Lisa Davis',
        role: 'SAFETY_INSPECTOR',
      },
    }),
  ])

  // Create projects
  console.log('Creating projects...')
  const project = await prisma.project.create({
    data: {
      name: 'Downtown Office Complex',
      description: 'Modern 15-story office building with underground parking',
      status: 'IN_PROGRESS',
      budget: 2500000,
      actualCost: 1800000,
      address: '123 Main Street, Downtown',
      ownerId: users[0].id,
    },
  })

  console.log('Seed completed successfully!')
  console.log(`Created ${users.length} users and 1 project`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })