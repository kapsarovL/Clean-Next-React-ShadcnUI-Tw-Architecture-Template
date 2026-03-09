# Contributing

## Commit Format

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/). The format is enforced automatically by commitlint on every commit via the Husky hook.

```bash
type(scope): description

```

### Allowed Commit Types

| Type | When to Use | Example |

|---|---|---|
| `feat` | A new feature visible to users | `feat(auth): add JWT refresh token rotation` |
| `fix` | A bug fix | `fix(api): handle null from rate limit endpoint` |
| `docs` | Documentation changes only | `docs(readme): add setup instructions` |
| `refactor` | Code restructure, no behaviour change | `refactor(hooks): extract API logic into hook` |
| `perf` | Performance improvement | `perf(images): switch to WebP via next/image` |
| `test` | Adding or fixing tests | `test(utils): add tests for formatCommitDate` |
| `chore` | Build config, dependency bumps | `chore(deps): bump next from 14.1.0 to 14.2.3` |
| `ci` | CI/CD workflow changes | `ci(github-actions): add test workflow on PR` |
| `revert` | Reverts a prior commit | `revert: revert feat(auth) — breaks mobile` |

### Rules Enforced by commitlint

- Subject line must be lowercase
- Subject line must not end with a period
- Maximum header length: 100 characters
- Scope must be lowercase if provided

---

## ESLint

ESLint is configured for TypeScript + Next.js. Run before pushing:

```bash
npm run lint        # check
npm run lint:fix    # auto-fix where possible (via next lint --fix)
```

### Key Rules

| Rule | Effect |

|---|---|
| `no-explicit-any` | Error — forces explicit types. Use `unknown` + type guard instead. |
| `no-unused-vars` | Warning — prefix with `_` to intentionally ignore (e.g. `_event`). |
| `explicit-module-boundary-types` | Warning — exported functions must declare return types. |
| `no-console` | Warning (allows `console.warn`/`error`) — use a logger in production. |
| `prefer-const` | Error — use `const` wherever the variable is not reassigned. |
| `eqeqeq` | Error — always use `===` instead of `==`. |
| `no-img-element` | Error — use `next/image` for automatic image optimisation. |

---

## Prettier

Prettier handles all formatting. It runs automatically on commit. To run manually:

```bash
npm run format        # write
npm run format:check  # check only (used in CI)
```

### Settings (from `.prettierrc`)

| Setting | Value | Reason |

|---|---|---|
| `singleQuote` | `true` | Single quotes throughout |
| `trailingComma` | `"all"` | Reduces git diff noise in multi-line expressions |
| `printWidth` | `100` | Line wrap at 100 characters |
| `semi` | `true` | Always include semicolons |
| `tabWidth` | `2` | 2-space indentation |
| `endOfLine` | `"lf"` | Unix line endings — consistent across macOS, Linux, and WSL |
| `importOrder` | see `.prettierrc` | Auto-sorts imports: React → Next → third-party → internal |

---

## GitHub Actions

Three workflow files cover the full CI/CD pipeline, located in `.github/workflows/`.

### `ci-test.yml` — Runs on Every Pull Request

Runs on every push to `main` and on every pull request. The three steps run in sequence: TypeScript type check, ESLint, and Vitest with coverage. Merging is blocked if any step fails.

| Setting | Value |

|---|---|
| Trigger | push to `main`, any `pull_request` targeting `main` |
| Concurrency | `cancel-in-progress: true` — cancels stale runs on new pushes |
| Node.js version | v20 LTS |
| Install command | `npm ci` — faster and stricter than `npm install`; respects the lockfile |
| Coverage output | Uploaded as a workflow artifact, retained for 7 days |

### `ci-deploy.yml` — Deploy to Vercel on Push to Main

Two jobs run in sequence. The `test` job runs first. The `deploy` job only runs if `test` passes, ensuring broken code never reaches production.

```sh
# Required repository secrets (Settings → Secrets and variables → Actions):
VERCEL_TOKEN       — from vercel.com/account/tokens
VERCEL_ORG_ID      — from .vercel/project.json after: vercel link
VERCEL_PROJECT_ID  — from .vercel/project.json after: vercel link
```

### `dependabot.yml` — Automated Dependency Updates

Dependabot opens pull requests for dependency updates on a weekly schedule. Patch updates are grouped into a single PR per week to reduce noise. Major version bumps are never auto-approved and must be reviewed manually.

| Setting | Value |
| --- | --- |
| Schedule | Weekly, Monday 09:00 UTC |
| Max open PRs | 5 — prevents queue flooding |
| Patch updates | Grouped into one PR per week |
| Major version updates | Ignored — must be upgraded manually |
| Commit prefix | `chore(deps)` for npm, `ci(deps)` for GitHub Actions |

---

## PR Workflow

### Branching Conventions

| Branch Pattern | Purpose |
| --- | --- |
| `feat/short-description` | New feature |
| `fix/short-description` | Bug fix |
| `docs/short-description` | Documentation only |
| `refactor/short-description` | Code restructure with no behaviour change |
| `chore/short-description` | Build config, dependency updates, tooling |

### Steps

1. Branch from `main`: `git checkout -b feat/your-feature`
2. Make changes — keep commits atomic and conventionally named
3. Ensure tests pass: `npm run test`
4. Ensure lint passes: `npm run lint`
5. Open a PR against `main` — CI will run type check, lint, and tests automatically
6. Squash-merge once approved

> **Merge strategy:** Squash-and-merge only. This keeps `git log` on `main` a readable history of features and fixes — not a stream of "WIP" and "fix typo" commits.

### Pull Request Checklist

- [ ] TypeScript passes with zero errors (`npm run build` or `npx tsc --noEmit`)
- [ ] ESLint passes with zero warnings (`npm run lint`)
- [ ] All existing tests pass (`npm run test`)
- [ ] New tests added for any new utility functions or hooks
- [ ] README updated if any user-facing behaviour changed
- [ ] No `console.log` statements left in the code

## Running Tests

```bash
npm run test              # watch mode
npm run test:coverage     # single run with coverage report
```

### Coverage Thresholds

`vitest.config.ts` sets initial thresholds at 20%. This is intentionally low — the goal is to establish the pipeline, not retroactively test everything. Raise the thresholds as new tests are added.

| Milestone | Target |
| --- | --- |
| Month 1 | 20% — establish the pipeline and test new utilities |
| Month 2 | 35% — add tests for all hooks and critical components |
| Month 3 | 50% — cover edge cases and error states |
| Ongoing | 60–70% — meaningful coverage without diminishing returns |

### Three Test Patterns

#### Pattern 1: Utility Function

Import the function, call it with known inputs, assert the output. No mocking required.

```ts
describe('formatCommitDate', () => {
  it('formats an ISO date string', () => {
    expect(formatCommitDate('2024-03-15T10:30:00Z')).toBe('Mar 15, 2024');
  });
  it('returns fallback for null input', () => {
    expect(formatCommitDate(null)).toBe('Unknown date');
  });
});
```

#### Pattern 2: React Component

Use `render()` from Testing Library, query elements by their accessible role or text, and assert their presence or attributes.

```tsx
it('renders the repo name', () => {
  render(<RepoCard repo={mockRepo} />);
  expect(screen.getByText('my-project')).toBeInTheDocument();
});
```

#### Pattern 3: Custom Hook with Mocked Fetch

Mock `global.fetch` before the test, render the hook with `renderHook()`, and use `waitFor()` to handle async state updates.

```ts
global.fetch = vi.fn();

it('returns user data on success', async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: async () => mockUser,
  });
  const { result } = renderHook(() => useGitHubUser('octocat'));
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.user).toEqual(mockUser);
});
```
