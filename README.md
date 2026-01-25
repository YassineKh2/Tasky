# Tasky

A beautiful, journal-style task tracking and management application built with Next.js.

![Tasky Screenshot](docs/screenshot.png)

## Features

- **Week & Month Views** - Navigate your tasks with intuitive weekly and monthly calendar views
- **Recurring Tasks** - Set up tasks that repeat on specific days of the week
- **Statistics Dashboard** - Track your productivity with completion rates, streaks, and trends
- **Quick Complete** - Mark individual tasks or entire days as complete with one click
- **Days Off** - Mark rest days to exclude them from your statistics
- **Task Library** - Manage your task templates in a draggable sidebar
- **Beautiful Design** - Hand-crafted journal-style aesthetic with smooth animations

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Database**: SQLite with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tasky.git
   cd tasky
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Create a `.env.local` file:
   ```env
   DATABASE_URL="file:./prisma/prisma/dev.db"
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tasky/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── tasks/         # Task CRUD endpoints
│   │   ├── assignments/   # Assignment CRUD endpoints
│   │   └── days-off/      # Days off endpoints
│   ├── layout.tsx         # Root layout with fonts
│   └── page.tsx           # Main page
├── src/
│   ├── components/        # React components
│   │   ├── WeekView.tsx   # Weekly calendar view
│   │   ├── MonthCalendar.tsx  # Monthly calendar
│   │   ├── StatsPanel.tsx     # Statistics dashboard
│   │   ├── TaskLibrary.tsx    # Task management sidebar
│   │   └── ...
│   └── hooks/             # Custom React hooks
│       ├── useTasksAPI.ts      # Task API hooks
│       ├── useAssignmentsAPI.ts # Assignment API hooks
│       └── useDaysOffAPI.ts    # Days off API hooks
├── prisma/
│   └── schema.prisma      # Database schema
└── lib/
    └── prisma.ts          # Prisma client singleton
```

## Database Schema

- **TaskDefinition** - Task templates with name, duration, and recurrence settings
- **TaskAssignment** - Individual task instances assigned to specific dates
- **DayOff** - Dates marked as rest days
- **TaskTracking** - Detailed completion and time tracking history

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

---
