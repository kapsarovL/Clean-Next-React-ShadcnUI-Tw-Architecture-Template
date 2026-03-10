# Clean Next.js Architecture Template

![Tests](https://github.com/kapsarovL/Clean-Next-React-ShadcnUI-Tw-Architecture-Template/actions/workflows/ci-test.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A production-ready starter for Next.js projects with authentication, database, file storage, testing, and CI/CD configured out of the box. Clone it, rename it, and ship — without spending a sprint on boilerplate.

---

## What This Does

Most Next.js starters give you a blank canvas. This template gives you a working application with auth, a database-backed REST API, role-based access, and a full quality pipeline — so you can start building features on day one instead of wiring infrastructure.

---

## Technical Highlights

- **JWT session auth** via NextAuth with a Credentials provider, role (`USER` / `ADMIN`) stored in the token and surfaced on `session.user`
- **Prisma 7 + Neon PostgreSQL** using the `@prisma/adapter-neon` driver adapter — serverless-ready with connection pooling built in
- **Next.js middleware** for route protection — unauthenticated users are redirected to `/login`, non-admins are blocked from `/admin`
- **Rate limiting** on auth and user API routes — sliding-window in-memory store, swap to Upstash Redis for distributed deployments
- **Vercel Blob** for profile picture uploads — public CDN storage, no extra infrastructure
- **SEO metadata** on every page via Next.js `metadata` exports and a `title` template in the root layout
- **React Query** for all server state — optimistic updates, cache invalidation, and loading states without prop drilling
- **Zod validation** on every API route — malformed requests are rejected before they touch the database
- **Loading and error boundaries** — `loading.tsx` and `error.tsx` per route for graceful fallbacks
- **Vitest + Testing Library** with jsdom, coverage thresholds enforced in CI
- **Conventional Commits** enforced via commitlint + Husky pre-commit hook
- **GitHub Actions** pipelines for test gating and Vercel deployment

---

## Features

- Sign up / log in with email and password
- Per-user task management — inline create, complete, delete with optimistic UI
- Role-based admin dashboard with user stats and table
- User settings — email, password change, profile picture upload, notification preferences
- Profile page with avatar, join date, and task count
- Toast notifications
- Dark/light theme toggle
- Protected routes with middleware-level redirect
- Per-page SEO titles via Next.js metadata API
- Loading skeletons and error recovery on every route

---

## Tech Stack

| Layer | Technology |

|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Auth | NextAuth 4 (JWT, Credentials) |
| Database | Neon PostgreSQL via Prisma 7 |
| File storage | Vercel Blob |
| Server state | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| Testing | Vitest 4 + Testing Library |
| CI/CD | GitHub Actions + Vercel |
| Commit lint | commitlint + Husky |

---

## Prerequisites

- Node.js 20+
- npm 10+
- A [Neon](https://neon.tech) PostgreSQL database
- A Vercel project (for Blob storage and deployment)

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/kapsarovL/Clean-Next-React-ShadcnUI-Tw-Architecture-Template.git
cd Clean-Next-React-ShadcnUI-Tw-Architecture-Template

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — see Environment Variables below

# 4. Pull Vercel env vars (optional, if using Vercel CLI)
vercel link
vercel env pull .env.local

# 5. Generate Prisma client and run migrations
npx prisma migrate deploy
npx prisma db seed

# 6. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default seed accounts:

- `admin@example.com` / `admin123` (ADMIN role)
- `user@example.com` / `user123` (USER role)

---

## Environment Variables

| Variable | Description | Required |

|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Random secret for JWT signing (`openssl rand -base64 32`) | Yes |
| `NEXTAUTH_URL` | Base URL of your app, e.g. `http://localhost:3000` | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (from Vercel Storage dashboard) | Yes |

For CI/CD via GitHub Actions, also add these as repository secrets:

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
| `npm run build` | Generate Prisma client + production build |
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
│   ├── schema.prisma           # User + Task models (PostgreSQL)
│   ├── migrations/             # Migration history
│   └── seed.ts                 # Seed admin and demo user
├── prisma.config.ts            # Prisma 7 datasource + seed config
├── src/
│   ├── middleware.ts           # Route protection (auth + admin guard)
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   │   └── signup/route.ts          # POST /api/auth/signup
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts                 # GET, POST /api/tasks
│   │   │   │   └── [id]/route.ts            # PATCH, DELETE /api/tasks/:id
│   │   │   └── user/route.ts                # GET, PATCH /api/user
│   │   ├── admin/              # Admin-only dashboard (user stats + table)
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   ├── loading.tsx     # Skeleton fallback
│   │   │   └── error.tsx       # Error boundary
│   │   ├── tasks/
│   │   │   ├── page.tsx        # Task management page
│   │   │   ├── loading.tsx     # Skeleton fallback
│   │   │   └── error.tsx       # Error boundary
│   │   ├── login/              # Sign in page
│   │   ├── signup/             # Registration page
│   │   ├── profile/            # Profile page (avatar, stats, join date)
│   │   ├── settings/           # User settings (password, avatar, notifications)
│   │   └── layout.tsx          # Root layout — server component, metadata, Providers wrapper
│   ├── components/
│   │   ├── auth/               # LoginForm, SignUpForm
│   │   ├── dashboard/          # DashboardContent
│   │   ├── layout/             # Navbar, Sidebar, ProtectedRoute
│   │   ├── providers/          # Providers.tsx (SessionProvider + QueryClientProvider)
│   │   ├── shared/             # ThemeToggle
│   │   ├── tasks/              # TaskList (with inline create), TaskEditForm
│   │   └── ui/                 # shadcn/ui primitives
│   ├── hooks/
│   │   ├── useAuth.ts          # Typed session hook
│   │   ├── useTasks.ts         # React Query hooks for tasks CRUD
│   │   └── useTheme.ts         # Theme toggle hook
│   ├── lib/
│   │   ├── auth-options.ts     # NextAuth config (Credentials provider, JWT callbacks)
│   │   ├── prisma.ts           # Singleton PrismaClient with Neon adapter
│   │   ├── rate-limit.ts       # Sliding-window rate limiter
│   │   └── utils.ts            # cn() Tailwind class merge helper
│   └── types/
│       ├── css.d.ts            # CSS module type declaration
│       ├── index.ts            # Shared TypeScript types
│       └── next-auth.d.ts      # Session type augmentation (id, role, profile fields)
├── commitlint.config.cjs       # Conventional Commits rules
├── vitest.config.ts            # Test runner + coverage config
└── eslint.config.mjs           # TypeScript-aware ESLint rules
```

---

## Architecture Decisions

**Why Neon PostgreSQL?** Serverless PostgreSQL with connection pooling — works seamlessly in Next.js Edge/serverless environments. The `@prisma/adapter-neon` adapter is used directly; no connection URL is needed in `schema.prisma` (Prisma 7 reads it from `prisma.config.ts`).

**Why Prisma 7 driver adapter?** Prisma 7 uses explicit driver adapters instead of a built-in database driver. This makes it compatible with serverless runtimes and gives you full control over the connection.

**Why middleware for route protection?** Middleware runs at the Edge before the page renders, so unauthenticated users never hit the server component. It's faster and more reliable than client-side redirects.

**Why React Query over server components for data?** This template demonstrates patterns applicable to both SPA and hybrid apps. React Query gives you cache management, loading/error states, and optimistic updates without lifting state.

**Why JWT sessions?** Stateless — no session table required. Role is embedded in the token and available on every request without a database round-trip.

**Why in-memory rate limiting?** Zero dependencies for a template. The sliding-window Map store is fine for single-process deployments. For Vercel (multiple function instances), replace `src/lib/rate-limit.ts` with `@upstash/ratelimit` + `@upstash/redis` — the call signature stays identical.

---

## Contributing

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```

feat(auth): add OAuth GitHub provider
fix(tasks): prevent duplicate task creation on double-click
docs(readme): update environment variables
```

Max subject line: 100 characters, lowercase after the prefix.
