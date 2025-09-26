# Construction AI Management Platform

A comprehensive construction project management application built with Next.js, featuring AI-powered cost estimation, equipment tracking, safety reporting, and task management.

## Features

### Core Modules
- **Project Management** - Track construction projects with progress monitoring
- **Task Management** - Kanban board for team coordination and task tracking
- **Equipment Management** - Monitor machinery, maintenance schedules, and utilization
- **Safety Reporting** - Document and track safety incidents with photo uploads
- **Cost Estimation** - AI-powered project cost calculations with detailed line items
- **User Management** - Role-based access control for team members

### Key Capabilities
- Real-time project progress tracking
- Equipment maintenance scheduling
- Safety incident reporting and resolution tracking
- Detailed cost breakdowns with labor, materials, and equipment
- Task assignment and status management
- Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React, TypeScript
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Authentication**: Ready for NextAuth.js integration

## Project Structure

```
construction-ai/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── cost-estimates/     # Cost estimation endpoints
│   │   │   ├── equipment/          # Equipment management endpoints
│   │   │   ├── projects/           # Project management endpoints
│   │   │   ├── safety-reports/     # Safety reporting endpoints
│   │   │   ├── tasks/              # Task management endpoints
│   │   │   └── users/              # User management endpoints
│   │   ├── equipment/              # Equipment management page
│   │   ├── estimates/              # Cost estimation page
│   │   ├── safety/                 # Safety reporting page
│   │   ├── tasks/                  # Task management page
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Dashboard/home page
│   ├── components/
│   │   └── ui/                     # Reusable UI components
│   └── lib/
│       ├── prisma.ts               # Database client
│       └── utils.ts                # Utility functions
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
├── .env                            # Environment variables
├── package.json                    # Dependencies
└── README.md                       # This file
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd construction-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   echo 'DATABASE_URL="file:./dev.db"' > .env
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project

### Tasks
- `GET /api/projects/[id]/tasks` - Get tasks for project
- `POST /api/projects/[id]/tasks` - Create task for project
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Equipment
- `GET /api/equipment` - List all equipment
- `POST /api/equipment` - Add new equipment
- `GET /api/equipment/[id]` - Get specific equipment
- `PUT /api/equipment/[id]` - Update equipment
- `DELETE /api/equipment/[id]` - Delete equipment

### Safety Reports
- `GET /api/safety-reports` - List all safety reports
- `POST /api/safety-reports` - Create safety report
- `GET /api/safety-reports/[id]` - Get specific report
- `PUT /api/safety-reports/[id]` - Update report
- `DELETE /api/safety-reports/[id]` - Delete report

### Cost Estimates
- `GET /api/cost-estimates` - List all estimates
- `POST /api/cost-estimates` - Create new estimate
- `GET /api/cost-estimates/[id]` - Get specific estimate
- `PUT /api/cost-estimates/[id]` - Update estimate
- `DELETE /api/cost-estimates/[id]` - Delete estimate

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user

## Database Schema

The application uses a comprehensive relational schema with the following key models:

- **User** - System users with roles and permissions
- **Project** - Construction projects with budgets and timelines
- **Task** - Project tasks with assignments and status tracking
- **Equipment** - Machinery and tools with maintenance tracking
- **SafetyReport** - Safety incidents with severity and resolution tracking
- **CostEstimate** - Project cost estimates with detailed line items
- **MaintenanceRecord** - Equipment maintenance history

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy construction management app"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy automatically

3. **Production Database**
   - Add Vercel Postgres or external PostgreSQL
   - Update `DATABASE_URL` in Vercel environment variables
   - Run migrations: `npx prisma db push`

### Environment Variables for Production

```env
DATABASE_URL="postgresql://username:password@hostname:port/database"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## Development

### Adding New Features

1. **Database Changes**
   ```bash
   # Modify prisma/schema.prisma
   npx prisma db push
   npx prisma generate
   ```

2. **API Routes**
   - Add new routes in `src/app/api/`
   - Follow RESTful conventions

3. **Frontend Pages**
   - Add new pages in `src/app/`
   - Use existing UI components from `src/components/ui/`

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma studio` - Open database browser
- `npx prisma db push` - Update database schema

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@constructionai.com or join our Slack channel.

---

**Built for the construction industry to streamline project management, enhance safety, and optimize resource allocation.**