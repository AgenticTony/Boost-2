# Locked Area — Hardening Plan

Bring `apps/locked-area` to the same standard as `apps/public-site`: correctness, security,
design-system parity, accessibility, and test coverage.

**Source:** full code review, 2026-08-06. Every item below traces to a specific finding.

**Decisions taken before planning:**

| Question | Decision |
|---|---|
| Filename convention | Full rename to kebab-case, matching public-site |
| `denyUser` implementation | Supabase Edge Function with service-role key |
| Undefined `@theme` tokens | Fix in **both** apps |

**Ground rules for every phase**

- One phase = one conventional commit. Do not batch phases.
- Tests are written **with** the implementation, not after. A phase is not done until
  `npm run lint && npx tsc -b && npm test && npm run build` is clean.
- No Claude attribution trailers in commit messages.
- Phases 3, 4 and 9 touch authentication and RLS. Each gets an explicit review checkpoint
  before its commit.

---

## Phase 1 — Filename & style normalization

**Why first:** purely mechanical, and every later phase then edits final paths. Doing this
last would mean re-touching every file the other phases just wrote.

### Tasks

1. Rename all component/page files to kebab-case:

   | From | To |
   |---|---|
   | `components/ErrorBoundary.tsx` | `components/error-boundary.tsx` |
   | `components/ErrorMessage.tsx` | `components/error-message.tsx` |
   | `components/FutureFeatures.tsx` | `components/future-features.tsx` |
   | `components/GuideSection.tsx` | `components/guide-section.tsx` |
   | `components/Header.tsx` | `components/layout/header.tsx` |
   | `components/InfoBanner.tsx` | `components/info-banner.tsx` |
   | `components/LoadingSpinner.tsx` | `components/loading-spinner.tsx` |
   | `components/PageLayout.tsx` | `components/layout/page-layout.tsx` |
   | `components/ProtectedRoute.tsx` | `components/protected-route.tsx` |
   | `components/ScrollToTop.tsx` | `components/scroll-to-top.tsx` |
   | `components/SectionDivider.tsx` | `components/section-divider.tsx` |
   | `pages/AdminApprovals.tsx` | `pages/admin-approvals.tsx` |
   | `pages/ExerciseDetail.tsx` | `pages/exercise-detail.tsx` |
   | `pages/ForgotPassword.tsx` | `pages/forgot-password.tsx` |
   | `pages/HandbookReader.tsx` | `pages/handbook-reader.tsx` |
   | `pages/KnowledgeSection.tsx` | `pages/knowledge-section.tsx` |
   | `pages/Library.tsx` | `pages/library.tsx` |
   | `pages/NotFound.tsx` | `pages/not-found.tsx` |
   | `pages/ResetPassword.tsx` | `pages/reset-password.tsx` |
   | `pages/Resources.tsx` | `pages/resources.tsx` |
   | `pages/VerifyEmail.tsx` | `pages/verify-email.tsx` |
   | `auth/AuthContext.tsx` | `auth/auth-context.tsx` |
   | `auth/useAuth.ts` | `auth/use-auth.ts` |
   | `hooks/useExercises.ts` | `hooks/use-exercises.ts` |

   Introduce `components/layout/` to mirror public-site, which groups `header.tsx` and
   `footer.tsx` there.

2. **macOS case-insensitivity hazard.** `git mv Header.tsx header.tsx` silently no-ops on
   APFS. Use the two-step for every case-only rename:

   ```bash
   git mv src/components/Header.tsx src/components/header.tmp && \
   git mv src/components/header.tmp src/components/layout/header.tsx
   ```

   Verify afterwards with `git ls-files src | grep -E '[A-Z]'` — must return nothing.

3. Convert all 24 relative `../` imports to the `@/` alias.
4. Normalize to double-quoted imports across all 32 source files (currently 10 single / 22 double).
5. Delete `auth/use-auth.ts` as a separate re-export file **only if** Phase 5 moves `useAuth`
   into its own module; otherwise keep it and remove the `react-refresh/only-export-components`
   suppression from the context file by exporting the hook exclusively from here.

### Acceptance

- `git ls-files apps/locked-area/src | grep -E '/[A-Z]'` returns nothing.
- No `from "../` or `from '../` anywhere in `src/`.
- Zero single-quoted import statements.
- Lint, typecheck, tests, build all green.

**Commit:** `refactor: normalize locked-area filenames and import style to public-site convention`

---

## Phase 2 — Test harness

**Why:** `AuthContext` and `ProtectedRoute` cannot currently be tested at all — they import the
`supabase` singleton, which throws at module load without env vars. Every later phase needs this.

### Tasks

1. Add `src/test/supabase-mock.ts`: a controllable fake exposing `auth.onAuthStateChange`,
   `signInWithPassword`, `signUp`, `signOut`, `resetPasswordForEmail`, `updateUser`, and a
   `from()` query-builder stub. Must allow a test to **hold the profile fetch pending** — that
   is the exact condition Phase 3's race test needs.
2. Wire it via `vi.mock("@/lib/supabase")` in a shared helper.
3. Extend `src/test/test-utils.tsx`:
   - Fix the current provider order so it matches production (see Phase 3 — `AuthProvider`
     moves inside the router).
   - Add `renderWithProviders(ui, { route, session, profile })`.
4. Add `.env.test` (gitignored) or stub `import.meta.env` in `setup.ts` so `lib/supabase.ts`
   does not throw during test collection.

### Acceptance

- A test can mount `<ProtectedRoute>` with an arbitrary auth state and assert the outcome.
- No test requires network or a live Supabase project.

**Commit:** `test: add supabase mock and provider-aware render helpers`

---

## Phase 3 — Auth & routing blockers ⚠️ *touches auth*

Fixes the two confirmed runtime defects.

### Tasks

1. **`App.tsx` — stale pathname.** Replace `window.location.pathname` with `useLocation()`.
   Reproduced: with `window.location`, the authenticated header stays mounted after navigating
   to `/login`, exposing "Logga ut" and the user's email on auth screens.
   - Also normalize trailing slashes so `/login/` matches `AUTH_ROUTES`.
   - Better: derive chrome from route structure rather than a path list — introduce an
     `<AuthLayout>` and `<AppLayout>` pair as parent routes with `<Outlet/>`. This removes
     the string-matching entirely and is how public-site's routing is shaped.

2. **`AuthContext` — login redirect race.** `fetchProfile` never sets `isLoading = true` on
   entry, so after `signInWithPassword` resolves, `ProtectedRoute` sees
   `isLoading: false, user: null` and redirects to `/login` while the profile request is still
   in flight. Fix:
   - Set `isLoading(true)` at the start of `fetchProfile`.
   - Wrap `setUser` / `setIsLoading` so the `isMounted` guard covers the async path too — it
     currently only guards the synchronous callback body.
   - Add a redirect-if-authenticated guard on `Login` so an already-authenticated user landing
     on `/login` is sent to `/`.

3. **Provider order.** `main.tsx` mounts `AuthProvider` *outside* `BrowserRouter`, which is why
   `logout` uses `window.location.href = "/login"` — a full page reload that discards the SPA.
   Move `AuthProvider` inside the router and use `useNavigate()`.

4. **`fetchProfile` error path.** A failed profile fetch currently logs and sets `user = null`,
   which is indistinguishable from "logged out" and silently bounces the user to login with no
   explanation. Surface a distinct error state.

### Tests (written with the fix)

- Header is absent on `/login` and present on `/` after client-side navigation.
- Login → navigate with the profile fetch held pending does **not** redirect to `/login`.
- Unauthenticated access to a protected route redirects.
- Authenticated-but-unapproved renders the pending-approval screen.
- Logout clears state and routes to `/login` without a page reload.
- Profile-fetch failure surfaces an error, not a silent logout.

**Review checkpoint:** walk the auth state machine before committing.

**Commit:** `fix: correct auth state races and route-aware chrome in locked-area`

---

## Phase 4 — Security & indexability ⚠️ *touches RLS*

### App

1. Add `public/robots.txt`:
   ```
   User-agent: *
   Disallow: /
   ```
2. Add `<meta name="robots" content="noindex, nofollow" />` to `index.html`. The
   `_redirects` rule `/* /index.html 200` makes every unknown path return HTTP 200, so
   without this the whole members area is a crawlable soft-200 surface. public-site documents
   this exact hazard in `use-seo.tsx`.
3. Remove `VITE_HYGRAPH_URL` and `VITE_HYGRAPH_TOKEN_LOCKED` from `.env`. Unused today, but
   any `VITE_`-prefixed value is inlined into the client bundle the moment it is referenced.
   If a Hygraph token is needed later it must not carry the `VITE_` prefix.
4. Keep `env.d.ts` as the single source of truth for env vars and assert it matches `.env.example`.

### SQL — `sql/02_security_hardening.sql` (new, additive; do not edit 01 in place)

1. `is_admin()` is `SECURITY DEFINER` with a mutable `search_path` — Supabase's linter flags
   this as `function_search_path_mutable`. Its sibling `handle_new_user` already sets it, so
   this is an oversight:
   ```sql
   create or replace function public.is_admin()
   returns boolean language sql security definer stable
   set search_path = public
   as $$ ... $$;
   ```
2. Add an explicit `WITH CHECK` to `"Admins can update profiles"`. It currently defaults to the
   `USING` clause, which lets any admin set `is_admin = true` on any row. Decide deliberately:
   either restrict the writable columns to `approved`/`denied`, or keep escalation and document it.
3. Make the script idempotent — `drop policy if exists` before each `create policy`, so it can
   be re-run like the `create table if not exists` above it.
4. Add the `denied boolean not null default false` column now (Phase 9 consumes it) so there is
   one migration touching the table, not two.

### Acceptance

- Supabase advisor reports no `function_search_path_mutable` for `is_admin`.
- Re-running the full SQL directory is a no-op.
- `curl` of any locked-area path returns a `noindex` document.

**Review checkpoint:** RLS policy changes reviewed before commit.

**Commit:** `fix: harden locked-area RLS, pin search_path, and block indexing`

---

## Phase 5 — Design tokens & `ui/` primitives

**This is the phase that actually closes the "design system" gap.** Tokens were already copied
(`index.css` is byte-identical to public-site's); the component layer never was.

### Tasks

1. **Fix the undefined tokens in both apps.** public-site's own primitives reference
   `bg-card`, `text-card-foreground`, `bg-muted`, `text-muted-foreground` and
   `ring-foreground/10`, none of which exist in `@theme`. Under Tailwind v4 those classes
   generate nothing — so public-site's `Card` currently has no background and Button's
   `outline` / `ghost` / `secondary` variants have no hover state. Add to the `@theme` block in
   **both** `index.css` files, mapped onto existing brand values so nothing shifts unexpectedly:
   ```css
   --color-card: #FFFFFF;
   --color-card-foreground: #333333;   /* = --color-text */
   --color-muted: #F1EFEA;
   --color-muted-foreground: #555B66;  /* = --color-text-muted */
   --color-foreground: #333333;
   ```
   Verify public-site visually after this — it is a real rendering change there.

2. **Port `src/components/ui/`** from public-site, adapted:
   - `button.tsx` — CVA variants. Add the pill CTA (`rounded-cta`) locked-area uses everywhere.
   - `input.tsx` — extend with an `icon` slot; locked-area's inputs all have a leading lucide icon.
   - `label.tsx`, `card.tsx`, `separator.tsx` — as-is.
   - `spinner.tsx` — **new**, shared. Replaces five divergent implementations
     (`App.tsx` PageLoader, `protected-route.tsx`, `loading-spinner.tsx`, `library.tsx`,
     `login.tsx`) with one component taking a `size` variant.
   - `alert.tsx` — **new**. The `role="alert"` error/success banner is duplicated across
     login, forgot-password and reset-password.
   - `field.tsx` — **new**. Label + icon input + error text + describedby wiring, so form
     markup stops being hand-assembled per page.

3. Adopt `cn()` — currently defined in `lib/utils.ts` and unit-tested, but imported by zero components.

4. Align focus rings. locked-area uses `focus-visible:outline-*`, public-site's primitives use
   `focus-visible:ring-*`. Pick one — the `@theme`-level `*:focus-visible` rule in `index.css`
   already sets an outline, so ring-based primitives currently double up.

### Acceptance

- Every hardcoded input/button class string in `src/pages/` is gone.
- `grep -r "border border-border rounded-input" src/pages/` returns nothing.
- Both apps render identically to before, except public-site's Card/Button which now render *correctly*.

**Commit:** `feat: add shared ui primitives and repair undefined design tokens`

---

## Phase 6 — Migrate forms onto the design system

Consumes the six dependencies that are currently installed and unimported:
`react-hook-form`, `@hookform/resolvers`, `zod`, `class-variance-authority`,
`@radix-ui/react-slot`, `framer-motion`.

### Tasks

1. **Extract the password policy** to `lib/password-policy.ts` — a single zod schema plus the
   requirement list and strength scoring. It is currently duplicated verbatim in `login.tsx:33-48`
   and `reset-password.tsx:20-29`; the two will drift.
   - Reconcile the mismatch: the UI enforces 8 chars + uppercase + digit + symbol, while
     `auth-errors.ts` translates Supabase's rejection as "minst 6 tecken". Align the Supabase
     project's password policy with the UI, or soften the copy.
2. **Split `login.tsx` (502 lines).** It carries two forms, the password policy, the strength
   meter, a marketing panel and tab state. Break into:
   - `pages/login.tsx` — layout + tab state only
   - `components/auth/login-form.tsx`
   - `components/auth/register-form.tsx`
   - `components/auth/password-strength.tsx`
   - `components/auth/auth-hero.tsx` (the left marketing panel)
3. Convert all four auth forms (`login`, `register`, `forgot-password`, `reset-password`) to
   `useForm` + `zodResolver`, matching `public-site/src/pages/kontakt.tsx`.
4. **`reset-password.tsx` — route through `AuthContext`.** It calls `supabase.auth.updateUser`
   directly and renders `updateError.message` raw, showing English Supabase strings in an
   otherwise fully-Swedish UI. Add `updatePassword` to the context, run it through
   `translateAuthError`, and clear the `setTimeout` on unmount.
5. Guard `/reset-password` — verify a recovery session exists before rendering the form, so a
   direct visit gets a clear message rather than an opaque failure.

### Tests

- Each form: validation errors, submit success, submit failure, disabled-while-pending.
- `password-policy`: table-driven cases for every rule and score boundary.
- `reset-password`: no recovery session → guidance, not a form.

**Commit:** `refactor: migrate locked-area auth forms to react-hook-form and shared primitives`

---

## Phase 7 — App shell parity

`index.html` is 11 lines against public-site's 60, and is missing every shell feature.

### Tasks

1. `index.html`: favicon (`public/logo.svg` exists and is unreferenced), `theme-color`,
   Montserrat preloads for the two critical weights, meta description, and the pre-hydration
   loading shell so the app does not flash blank.
2. **Add the skip-to-content anchor.** `.skip-to-content` styling is already in `index.css:145`
   and `<main id="main-content">` already exists in `App.tsx` — only the anchor is missing, so
   the CSS is currently dead and the app has no skip link.
3. Add `components/layout/footer.tsx`. locked-area has none; public-site does.
4. Add `hooks/use-seo.tsx` — a trimmed variant (no JSON-LD, no og tags, `noindex` always on).
   Right now every page shares the title "Boost by FCR - Locked Area"; `HelmetProvider` is
   mounted in `main.tsx` and no page uses it.
5. **Split `PageLayout`** — 8 optional props doing three unrelated jobs (back-nav header, hero
   block, page wrapper). `library.tsx` already opted out and hand-rolled its own hero. Split
   into `<PageHeader>`, `<PageHero>` and a thin container, then migrate `library.tsx` onto them
   so the hero is consistent.

**Commit:** `feat: bring locked-area app shell to public-site parity`

---

## Phase 8 — Accessibility & UX

1. **Library cards are keyboard-unreachable.** `library.tsx:262` is a `div` with `onClick`, no
   `role`/`tabIndex`/`onKeyDown`, wrapping a real `<button>` — nested interactive content.
   Restructure: make the card a non-interactive container and the "Visa övning" button the sole
   control, or make the whole card a `<Link>` and drop the inner button.
2. **Login tabs have partial ARIA.** `login.tsx:191` declares `role="tablist"`/`role="tab"` with
   `aria-selected` but no `aria-controls`, no `role="tabpanel"`, and no arrow-key handling —
   which misleads screen readers more than plain buttons would. Either complete it (ideally via
   `@radix-ui/react-tabs`) or drop the roles.
3. **Sticky collision.** `header` is `sticky top-0 z-50`; library's filter bar is
   `sticky top-0 z-30` (`library.tsx:201`). Both pin to the viewport top and the filter bar
   slides under the header. Use `top-16`, or better a `--header-height` token.
4. Replace `alert()` / `window.confirm()` in `admin-approvals.tsx:53,61,70` with the design
   system's alert component and a proper confirm dialog.
5. `resources.tsx` renders an `ExternalLink` icon on `tel:` and `mailto:` links regardless of the
   `external` flag — "Ring 112" should not carry an external-link glyph.
6. `not-found.tsx` uses `rounded-lg` instead of the `rounded-cta` token.
7. `error-boundary.tsx:25-27` — `getDerivedStateFromError` returns `retryKey: 0`, clobbering the
   counter its own comment says should increment across retries.
8. `resources.tsx` exports both named and default; standardize on default like the other pages.

**Commit:** `fix: resolve locked-area accessibility and interaction defects`

---

## Phase 9 — Admin deny flow (Edge Function) ⚠️ *touches auth*

The "Neka" button currently confirms, then shows an alert telling the admin to go do it
manually in the Supabase dashboard. It performs no action.

### Tasks

1. Create `supabase/functions/delete-user/index.ts`:
   - Verify the caller's JWT server-side.
   - Re-check admin status **against the database**, never from a client-supplied claim.
   - Call `auth.admin.deleteUser(id)` with the service-role key.
   - Refuse self-deletion and refuse deleting another admin.
   - Return structured errors; log the actor and target.
2. Store the service-role key in Supabase secrets (`supabase secrets set`). It must never appear
   in the repo, in `.env`, or behind a `VITE_` prefix.
3. Add `deleteUser` to a new `lib/admin-api.ts` so `admin-approvals.tsx` depends on an
   abstraction rather than the `supabase` singleton directly — this is the DIP gap public-site
   solves with `api/adapter.ts`.
4. Two-step confirmation in the UI, with the soft `denied` flag (added in Phase 4) set first so
   a failed deletion still removes the user from the pending queue.
5. Fix the effect in `admin-approvals.tsx:75-80` — `if (!isAdmin) return` with `[]` deps and two
   lint suppressions. If `isAdmin` ever flips after mount, `loading` stays `true` forever. The
   suppression is what is currently load-bearing, not the logic.
6. Document deployment in the README.

### Tests

- Non-admin caller is rejected.
- Self-deletion is rejected.
- Admin-deleting-admin is rejected.
- Successful deletion removes the row from the pending list.

**Review checkpoint:** service-role key handling and the server-side admin check reviewed before commit.

**Commit:** `feat: implement admin deny flow via supabase edge function`

---

## Phase 10 — Assets, dependencies, docs, and coverage gates

1. **Optimize the login hero.** `deltagare_boostbyfcr_pa_trappa-scaled.jpg` is 497 KB. public-site
   ships the same photograph at ~42 KB (840×1260, documented in its `index.html`). Reuse that
   asset and add a `.webp` with a JPEG fallback.
2. **Remove the duplicate logo.** `public/logo_boostbyfcr_dark.png` and
   `public/images/logo_boostbyfcr_dark.png` are byte-identical (same MD5). Keep one; `header.tsx`
   and `login.tsx` currently reference different copies.
3. **Prune dependencies.** After Phase 6, re-check what is genuinely used and remove the rest.
   `framer-motion` in particular: adopt it for page transitions to match public-site, or drop it.
4. **Fix the README.** It lists "Framer Motion (animations)" in the tech stack — currently false.
   Document the Edge Function deploy and the env var set.
5. **Fix the coverage lie.** The current report reads "88%" over **25 statements**, because v8
   only instruments imported files and `coverage.all` is not enabled — `AuthContext`,
   `ProtectedRoute`, `App` routing and all seven pages are absent from the denominator. Enable:
   ```ts
   coverage: {
     all: true,
     include: ["src/**/*.{ts,tsx}"],
     exclude: ["src/test/**", "src/**/*.test.{ts,tsx}", "src/env.d.ts", "src/main.tsx"],
     thresholds: { statements: 70, branches: 65, functions: 70, lines: 70 },
   }
   ```
   Set the threshold to whatever Phases 3–8 actually achieve, then ratchet.
6. Add `npm run verify` (`lint && tsc -b && test && build`) at the repo root for both apps.

**Commit:** `chore: optimize locked-area assets, prune deps, and enforce real coverage`

---

## Out of scope (flagging, not fixing)

These are product gaps, not code defects — they need your call, not a refactor:

- `use-exercises.ts` returns a hardcoded `[]`, so `/` — the app's front door — renders
  "0 övningar / Inga övningar hittades" to real users.
- `handbook-reader.tsx` and `knowledge-section.tsx` ship placeholder chapter content.
- `exercise-detail.tsx` is a stub showing the raw route ID.

The plan above makes these pages correct, accessible and on-brand. It does not make them useful.
Wiring the real content source is a separate epic.

---

## Sequencing summary

| Phase | Scope | Risk | Depends on |
|---|---|---|---|
| 1 | Filenames & import style | Low (mechanical) | — |
| 2 | Test harness | Low | 1 |
| 3 | Auth & routing blockers ⚠️ | **High** | 2 |
| 4 | Security & RLS ⚠️ | **High** | — |
| 5 | Tokens & `ui/` primitives | Medium (touches public-site) | 1 |
| 6 | Form migration | Medium | 5 |
| 7 | App shell parity | Low | 5 |
| 8 | Accessibility & UX | Low | 5 |
| 9 | Admin deny ⚠️ | **High** | 4 |
| 10 | Assets, deps, coverage | Low | all |

Phases 3 and 4 are independent and can run in either order. Phase 5 gates 6–8.
