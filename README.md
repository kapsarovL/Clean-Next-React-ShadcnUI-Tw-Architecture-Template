# Clean Next.js Architecture Template

> Production-ready Next.js 16 starter — auth, database, UI, and testing pre-configured.
> Ship features on day one instead of spending a week on boilerplate.

---

## The Problem

Every new Next.js project starts the same way:

- Wire up authentication
- Configure the database and ORM
- Set up UI components
- Add form validation
- Configure testing

That's 3-5 days of setup before writing a single line of business logic.

This template eliminates that entirely.

---

## What's Pre-configured

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16 (App Router + Turbopack) | Modern routing, server components |
| Language | TypeScript 5 | Type-safe from day one |
| Styling | Tailwind CSS + shadcn/ui | Production UI without custom components |
| Auth | NextAuth.js (JWT, role-based) | USER + ADMIN roles out of the box |
| Database | Prisma 7 + SQLite | Zero-config local development |
| Data Fetching | TanStack Query 5 | Server state management |
| Forms | React Hook Form + Zod | Validated, type-safe forms |
| Testing | Jest + React Testing Library | Component and integration tests |

---

## Architecture Decisions

**Why this structure matters:**

- **Role-based access** — `ProtectedRoute` supports `USER` and `ADMIN` roles without additional setup
- **JWT sessions** — token carries `id`, `role`, `profilePictureUrl`, and notification preferences
- **Shared PrismaClient** — single instance across all route handlers, no connection leaks
- **TanStack Query hooks** — data fetching logic separated from UI components
- **Zod + React Hook Form** — validation runs client and server side from the same schema

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth handler + signup endpoint
│   │   ├── tasks/         # CRUD endpoints
│   │   └── user/          # Profile update endpoint
│   ├── admin/             # Admin-only page
│   ├── dashboard/         # Protected dashboard
│   ├── login/             # Login page
│   ├── profile/           # Profile page
│   ├── settings/          # Settings + form
│   ├── signup/            # Signup page
│   └── tasks/             # Tasks page
├── components/
│   ├── auth/              # LoginForm, SignUpForm
│   ├── dashboard/         # DashboardContent, DataTable
│   ├── layout/            # Navbar, Sidebar, ProtectedRoute
│   ├── tasks/             # TaskForm, TaskList, TaskEditForm
│   └── ui/                # shadcn/ui primitives
├── hooks/
│   ├── useAuth.ts
│   ├── useTasks.ts        # TanStack Query task hooks
│   └── useTheme.ts        # Dark/light theme
├── lib/
│   ├── prisma.ts          # Shared PrismaClient
│   └── utils.ts           # cn() helper
└── types/
    ├── index.ts
    └── next-auth.d.ts     # Session type augmentation
```

---

## Quick Start

```bash
git clone https://github.com/kapsarovL/Clean-Next-React-ShadcnUI-Tw-Architecture-Template
cd Clean-Next-React-ShadcnUI-Tw-Architecture-Template
npm install
```

Create `.env` at project root:

```bash
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

```bash
npx prisma migrate dev
npm run dev
```

---

## Testing

```bash
npm run test
```

Uses Jest + React Testing Library. Component and integration tests included.

---

## Scripts

```bash
npm run dev      # Dev server with Turbopack
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
npm run test     # Jest tests
```

---

## License

MIT

---

Built by [Lazar Kapsarov](https://lazarkapsarov.com)  
→ contact@lazarkapsarov.com · [LinkedIn](https://linkedin.com/in/kapsarov-lazar)
