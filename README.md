# Clean Next.js Architecture Template

![Tests](https://github.com/your-username/Clean-Next-React-ShadcnUI-Tw-Architecture-Template/actions/workflows/ci-test.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A production-ready starter for Next.js projects with authentication, database, testing, and CI/CD configured out of the box. Clone it, rename it, and ship — without spending a sprint on boilerplate.

---

## What This Does

Most Next.js starters give you a blank canvas. This template gives you a working application with auth, a database-backed REST API, role-based access, and a full quality pipeline — so you can start building features on day one instead of wiring infrastructure.

---

## Technical Highlights

- **JWT session auth** via NextAuth with a Credentials provider, role (`USER` / `ADMIN`) stored in the token and surfaced on `session.user`
- **Prisma 7 + SQLite** using the `better-sqlite3` driver adapter — zero external database required for local development
- **React Query** for all server state — optimistic updates, cache invalidation, and loading states without prop drilling
- **Zod validation** on every API route — malformed requests are rejected before they touch the database
- **Vitest + Testing Library** with jsdom, coverage thresholds enforced in CI
- **Conventional Commits** enforced via commitlint + Husky pre-commit hook
- **GitHub Actions** pipelines for test gating and Vercel deployment

---

## Features

- Sign up / log in with email and password
- Per-user task management (create, complete, delete)
- Role-based admin page
- User settings (notifications, profile picture URL)
- Toast notifications
- Dark/light theme toggle
- Protected routes with session-aware redirect

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Auth | NextAuth 4 (JWT, Credentials) |
| Database | SQLite via Prisma 7 + better-sqlite3 |
| Server state | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| Testing | Vitest 4 + Testing Library |
| CI/CD | GitHub Actions + Vercel |
| Commit lint | commitlint + Husky |

---

## Prerequisites

- Node.js 20+
- npm 10+

---

---

```bash
# 1. Clone
git clone https://github.com/your-username/Clean-Next-React-ShadcnUI-Tw-Architecture-Template.git
cd Clean-Next-React-ShadcnUI-Tw-Architecture-Template

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — see Environment Variables below

# 4. Set up the database
npx prisma migrate deploy

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | SQLite file path, e.g. `file:./prisma/dev.db` | Yes |
| `NEXTAUTH_SECRET` | Random secret for JWT signing (`openssl rand -base64 32`) | Yes |
| `NEXTAUTH_URL` | Base URL of your app, e.g. `http://localhost:3000` | Yes |

For Vercel deployment, also add:

| Variable | Description |
|---|---|
| `VERCEL_TOKEN` | From vercel.com/account/tokens |
| `VERCEL_ORG_ID` | From `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` after `vercel link` |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:coverage` | Run tests with V8 coverage report |

---

## Project Structure

```
.
├── .github/
│   ├── dependabot.yml          # Automated dependency updates
│   └── workflows/
│       ├── ci-test.yml         # Type check · lint · test on every PR
│       └── ci-deploy.yml       # Deploy to Vercel after tests pass
├── .husky/
│   └── commit-msg              # Runs commitlint on every commit
├── prisma/
│   ├── schema.prisma           # User + Task models
│   ├── migrations/             # Migration history
│   └── dev.db                  # Local SQLite database
├── prisma.config.ts            # Prisma 7 datasource config
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts   # NextAuth handler + authOptions
│   │   │   │   └── signup/route.ts          # POST /api/auth/signup
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts                 # GET, POST /api/tasks
│   │   │   │   └── [id]/route.ts            # PATCH, DELETE /api/tasks/:id
│   │   │   └── user/route.ts                # GET /api/user
│   │   ├── admin/              # Admin-only page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── login/              # Sign in page
│   │   ├── signup/             # Registration page
│   │   ├── settings/           # User settings page
│   │   ├── tasks/              # Task management page
│   │   └── layout.tsx          # Root layout (SessionProvider, QueryClient, Toaster)
│   ├── components/
│   │   ├── auth/               # LoginForm, SignUpForm
│   │   ├── dashboard/          # DashboardContent, DataTable
│   │   ├── layout/             # Navbar, Sidebar, ProtectedRoute
│   │   ├── shared/             # ThemeToggle
│   │   ├── tasks/              # TaskList, TaskForm, TaskEditForm
│   │   └── ui/                 # shadcn/ui primitives
│   ├── context/
│   │   └── AuthContext.tsx     # Client-side auth context wrapping useSession
│   ├── hooks/
│   │   ├── useAuth.ts          # Typed session hook
│   │   ├── useTasks.ts         # React Query hooks for tasks CRUD
│   │   └── useTheme.ts         # Theme toggle hook
│   ├── lib/
│   │   ├── prisma.ts           # Singleton PrismaClient with better-sqlite3 adapter
│   │   └── utils.ts            # cn() Tailwind class merge helper
│   └── types/
│       ├── index.ts            # Shared TypeScript types
│       └── next-auth.d.ts      # Session type augmentation (id, role)
├── commitlint.config.cjs       # Conventional Commits rules
├── vitest.config.ts            # Test runner + coverage config
└── .eslintrc                   # TypeScript-aware ESLint rules
```

---

## Architecture Decisions

**Why SQLite?** Zero-config local development. Swap to PostgreSQL by changing `provider` in `schema.prisma` and the adapter in `prisma.ts` — all query code stays the same.

**Why Prisma 7 driver adapter?** Prisma 7 removed the built-in SQLite driver in favour of explicit driver adapters. The `better-sqlite3` adapter is synchronous and fast; connection config lives in `prisma.config.ts` rather than the schema.

**Why React Query over server components for data?** This template demonstrates patterns applicable to both SPA and hybrid apps. React Query gives you cache management, loading/error states, and optimistic updates without lifting state.

**Why JWT sessions?** Stateless — no session table required. Role is embedded in the token and available on every request without a database round-trip.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the PR workflow, branch naming, and commit format.

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add OAuth GitHub provider
fix(tasks): prevent duplicate task creation on double-click
docs(readme): add architecture decision for SQLite
```
