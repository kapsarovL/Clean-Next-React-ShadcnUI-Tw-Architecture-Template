# Clean Next.js Architecture Template

A production-ready Next.js 16 starter template with authentication, database, UI components, and testing pre-configured.

## Stack

| Layer | Technology |
| ------- | ----------- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Auth | NextAuth.js 4 (JWT, Credentials provider) |
| Database | Prisma 7 + SQLite (via `better-sqlite3`) |
| Data fetching | TanStack Query 5 |
| Forms | React Hook Form 7 + Zod |
| Testing | Jest + Testing Library |

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handler + authOptions
│   │   ├── auth/signup/          # Registration endpoint
│   │   ├── tasks/                # CRUD task endpoints
│   │   └── user/                 # Profile update endpoint
│   ├── admin/                    # Admin-only page
│   ├── dashboard/                # Protected dashboard
│   ├── login/                    # Login page
│   ├── profile/                  # Profile page
│   ├── settings/                 # Settings page + form
│   ├── signup/                   # Signup page
│   └── tasks/                    # Tasks page
├── components/
│   ├── auth/                     # LoginForm, SignUpForm
│   ├── common/                   # LoadingSpinner
│   ├── dashboard/                # DashboardContent, DataTable
│   ├── layout/                   # Navbar, Sidebar, ProtectedRoute
│   ├── shared/                   # ThemeToggle
│   ├── tasks/                    # TaskForm, TaskList, TaskEditForm
│   └── ui/                       # shadcn/ui primitives
├── context/
│   └── AuthContext.tsx           # Client-side auth state
├── hooks/
│   ├── use-toast.ts              # Toast state management
│   ├── useAuth.ts
│   ├── useTasks.ts               # TanStack Query task hooks
│   └── useTheme.ts               # Dark/light theme
├── lib/
│   ├── prisma.ts                 # Shared PrismaClient (adapter-based)
│   └── utils.ts                  # cn() helper
├── types/
│   ├── index.ts
│   └── next-auth.d.ts            # NextAuth session type augmentation
└── __test__/
    └── components/TaskList.test.tsx
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
prisma.config.ts                  # Prisma 7 datasource config
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file at the project root:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
npx prisma migrate dev
# optionally seed
npx ts-node prisma/seed.ts
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
npm run test     # Jest tests
```

## Authentication

- **Credentials provider** — email + bcrypt password via NextAuth.js
- **JWT sessions** — token carries `id`, `role`, `profilePictureUrl`, `notificationsEmail`, `notificationsPush`
- **Role-based access** — `ProtectedRoute` component supports `requiredRole: "USER" | "ADMIN"`
- Sign-in page: `/login` — Sign-up page: `/signup`

## Database

Prisma 7 with SQLite. Schema models:

- **User** — `id`, `email`, `password`, `role` (USER | ADMIN), `profilePictureUrl`, `notificationsEmail`, `notificationsPush`
- **Task** — `id`, `title`, `userId`

The `PrismaClient` is instantiated once in `src/lib/prisma.ts` using `@prisma/adapter-better-sqlite3` and shared across all route handlers.

## Theme

Dark/light mode toggle via `useTheme` hook — persisted in `localStorage` and applied as a `dark` class on `<html>`.

## Testing

```bash
npm run test
```

Uses Jest + `@testing-library/react`. Setup file: `src/__test__/setup.ts`.
