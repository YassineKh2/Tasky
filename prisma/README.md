# Task Tracker Database

This database stores all task definitions, assignments, tracking data, and day-offs.

## Environment Setup

Create a `.env.local` file in the project root:

```
DATABASE_URL="file:./prisma/dev.db"
```

## Running Migrations

```bash
npx prisma migrate dev --name init
```

This will create the SQLite database and run all migrations.

## Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Open http://localhost:5555 to browse and edit data visually.
