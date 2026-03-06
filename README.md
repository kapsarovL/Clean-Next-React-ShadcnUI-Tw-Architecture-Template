# Next.js Production Architecture Template

Production-grade Next.js 16 starter demonstrating authentication, database operations, form handling, and comprehensive testing.

**Built to answer:** "How do you architect a real-world Next.js application with auth, database, and testing?"

---

## Why This Exists

Most Next.js tutorials show isolated features. This template demonstrates how to **integrate** authentication, database, forms, and testing in a production-ready architecture.

**Real-world patterns demonstrated:**

- NextAuth.js JWT sessions with role-based access control
- Prisma ORM with migration workflow
- Server Actions + TanStack Query data fetching
- React Hook Form + Zod validation
- Jest + Testing Library component tests

---

## Technical Architecture

### Authentication Flow

- **Provider:** NextAuth.js 4 with Credentials (email + bcrypt)
- **Session:** JWT tokens carrying user ID, role, preferences
- **Authorization:** Server-side role checks (USER vs ADMIN)
- **Protected Routes:** `ProtectedRoute` component wrapper

### Database Layer

- **ORM:** Prisma 7 with SQLite (dev) → PostgreSQL (production)
- **Models:** User (with role-based permissions), Task (CRUD operations)
- **Migrations:** Version-controlled schema changes
- **Seeding:** Development data initialization scripts

### Data Fetching Strategy

- **Client:** TanStack Query for server state caching
- **Server:** Next.js Server Actions for mutations
- **Optimistic Updates:** Instant UI feedback with rollback on error

### Form Architecture

- **Validation:** Zod schemas (shared client + server)
- **UI:** React Hook Form (optimized re-renders)
- **Error Handling:** Field-level + form-level error display

### Testing Coverage

- Component tests (React Testing Library)
- Custom hooks testing
- Auth flow integration tests
- API route validation tests

---

## Tech Stack

**Framework:** Next.js 16 (App Router, Turbopack)  
**Language:** TypeScript 5  
**Database:** Prisma 7 + SQLite (dev) / PostgreSQL (prod)  
**Auth:** NextAuth.js 4 (JWT sessions)  
**Data Fetching:** TanStack Query 5  
**Forms:** React Hook Form 7 + Zod  
**Styling:** Tailwind CSS 3 + shadcn/ui  
**Testing:** Jest + Testing Library

---

## Project Structure

```

src/
├── app/
│   ├── api/
│   │   ├── auth/             # NextAuth handlers
│   │   ├── tasks/            # CRUD endpoints
│   │   └── user/             # Profile operations
│   ├── dashboard/            # Protected dashboard
│   ├── admin/                # Admin-only pages
│   └── (auth)/               # Login/signup routes
├── components/
│   ├── auth/                 # Auth forms
│   ├── layout/               # Navbar, Sidebar, ProtectedRoute
│   └── ui/                   # shadcn/ui components
├── hooks/
│   ├── useAuth.ts            # Auth state management
│   ├── useTasks.ts           # TanStack Query hooks
│   └── useTheme.ts           # Dark mode toggle
├── lib/
│   ├── prisma.ts             # PrismaClient singleton
│   └── utils.ts              # Shared utilities
└── __test__/                 # Test suites
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone and install
git clone [your-repo-url]
cd nextjs-architecture-template
npm install

# Configure environment
cp .env.example .env
# Edit DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# Initialize database
npx prisma migrate dev
npx ts-node prisma/seed.ts

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Key Features Implemented

### Authentication & Authorization

- ✅ Email + password authentication with bcrypt
- ✅ JWT session management
- ✅ Role-based access control (USER, ADMIN)
- ✅ Protected routes (client + server validation)
- ✅ Session persistence across page reloads

### Database Operations

- ✅ User management (create, read, update)
- ✅ Task CRUD with user ownership
- ✅ Migration scripts for schema versioning
- ✅ Seed data for development environment

### Form Handling

- ✅ Login/signup forms with validation
- ✅ Profile settings with image upload
- ✅ Notification preferences (email, push)
- ✅ Real-time field validation
- ✅ Server-side validation fallback

### UI/UX

- ✅ Dark/light theme toggle
- ✅ Responsive navigation (sidebar + mobile)
- ✅ Loading states for async operations
- ✅ Toast notifications for user feedback
- ✅ Accessible form controls (shadcn/ui)

### Testing

- ✅ Component unit tests
- ✅ Custom hook tests
- ✅ Integration tests for auth flow
- ✅ API route validation tests

---

## Available Scripts

| Command | Description |

|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run test` | Run test suite |
| `npm run test:watch` | Tests in watch mode |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create new migration |

---

## Production Deployment

### Vercel + Neon PostgreSQL

1. **Database Setup**

```bash
   # Create Neon project at neon.tech
   # Update .env with production DATABASE_URL
   npx prisma migrate deploy
```

1. **Vercel Deployment**

```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
```

1. **Environment Variables**

   - `DATABASE_URL` → Neon connection string
   - `NEXTAUTH_SECRET` → Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` → Your production domain

---

## Architecture Decisions

### Why JWT Sessions?

- Stateless authentication (no server-side session storage)
- Scales horizontally without session coordination
- Suitable for serverless deployments (Vercel)

### Why Prisma Over Raw SQL?

- Type-safe database queries
- Migration management built-in
- Easy database switching (SQLite → PostgreSQL)
- Excellent TypeScript integration

### Why TanStack Query?

- Automatic caching and revalidation
- Optimistic updates for instant UI
- Background refetching for fresh data
- Better DevTools than native fetch

### Why React Hook Form + Zod?

- Minimal re-renders (better performance)
- Schema reuse (client + server validation)
- Type inference from Zod schemas
- Better UX than uncontrolled forms

---

## Testing Strategy

```bash
npm run test
```

**Coverage areas:**

- Auth component rendering and interactions
- Task CRUD operations
- Protected route access control
- Form validation logic
- Theme toggle persistence

**Example test:**

```typescript
// TaskList.test.tsx
it('displays tasks correctly', () => {
  render(<TaskList tasks={mockTasks} />);
  expect(screen.getByText('Task 1')).toBeInTheDocument();
});
```

---

## Roadmap

- [ ] OAuth providers (Google, GitHub)
- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] User avatar upload to S3
- [ ] Real-time updates (WebSocket)
- [ ] API rate limiting
- [ ] Comprehensive E2E tests (Playwright)

---

## What I Learned Building This

**Authentication Complexity:**

- JWT token management requires careful expiration handling
- Role-based access needs both client and server validation
- Session persistence across deployments requires stateless design

**Database Patterns:**

- Prisma migrations prevent schema drift in teams
- Seed scripts essential for consistent dev environments
- Connection pooling matters for serverless (PrismaClient singleton)

**Form Architecture:**

- Schema-first validation (Zod) prevents client/server mismatch
- Optimistic updates improve perceived performance
- Error boundaries critical for form submission failures

---

**Status:** Production-ready | Fully tested | Open for contributions

**Built by:** [Lazar Kapsarov](https://github.com/kapsarovL)  

**Contact:** kapsarovlazar@gmail.com