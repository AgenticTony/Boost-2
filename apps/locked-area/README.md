# Locked Area — Boost by FC Rosengård

Members-only portal for Boost by FC Rosengård. Contains the exercise library, resources, handbook, and knowledge base. Access requires an admin-approved account.

## Tech Stack

- **React 19** + **TypeScript 6** (strict mode)
- **Vite 8** (build + dev server)
- **Tailwind CSS v4** (CSS-first `@theme`, no JS config)
- **Supabase** (authentication + database)
- **Framer Motion** (animations)
- **react-router-dom v7** (routing with lazy-loaded pages)
- **Vitest** + **@testing-library/react** (testing)

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project with the profiles table set up (see `sql/` directory)

### Installation

```bash
cd apps/locked-area
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Database Setup

Run the files in `sql/` **in order** in your Supabase SQL Editor.

`01_profiles_and_rls.sql` creates:
- `profiles` table (extends `auth.users`)
- RLS policies (users read own profile, admins read/update all)
- Auto-trigger to create a profile on signup
- `is_admin()` security definer function

`02_security_hardening.sql` then:
- Pins `search_path` on `is_admin()` and restricts who may execute it
- Adds the `denied` column used by the admin deny flow
- Recreates the policies idempotently, with an explicit `WITH CHECK`
- Narrows `UPDATE` to the `approved` and `denied` columns only

Both are safe to re-run — 01 is not idempotent on its policies, so if it
errors on a second run, skip to 02, which recreates them anyway.

### First Admin

After registering your first user, promote them in the Supabase SQL Editor:

```sql
UPDATE public.profiles SET approved = true, is_admin = true WHERE email = 'your-email@example.com';
```

This is deliberately a SQL Editor operation. After `02`, `is_admin` is not
writable through the public API by anyone — a compromised admin session
cannot mint more admins. The SQL Editor runs as the table owner and is
unaffected by those grants.

### Edge Function: `delete-user`

The admin "Neka" action permanently deletes an auth user. That requires the
**service-role key**, which bypasses row-level security completely and must
never reach the browser — which is the entire reason this runs server-side
rather than from the client.

Deploy it:

```bash
supabase functions deploy delete-user --project-ref <your-project-ref>
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are
injected into Edge Functions automatically — you do **not** need to set them,
and you must not add the service-role key to `.env`, to `.env.example`, or to
anything carrying a `VITE_` prefix.

Optionally restrict CORS to your deployed origin:

```bash
supabase secrets set ALLOWED_ORIGIN=https://your-locked-area-domain
```

**How it decides.** The function identifies the caller from their JWT, then
re-reads that caller's `is_admin` **from the database**. It never trusts
`is_admin` from the request body or a token claim — a client that can name a
target can just as easily claim to be an admin. It then refuses:

- callers who are not signed in, or not admins
- deleting yourself
- deleting another admin

Those rules live in `supabase/functions/_shared/authorize-deletion.ts`, kept
import-free so the same code is unit-tested by the Vite suite
(`src/test/authorize-deletion.test.ts`). The function is Deno and cannot run
under vitest, so the decision worth testing is deliberately separated from the
plumbing around it.

Removing the auth user also removes the profile row: `profiles.id` references
`auth.users` with `on delete cascade`.

### Development

```bash
npm run dev      # Start dev server on port 5174
```

### Build

```bash
npm run build    # Type-check + production build
```

### Test

```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage report
```

### Lint

```bash
npm run lint
```

## Architecture

```
src/
  auth/           AuthContext + useAuth hook (Supabase-backed)
  components/     Reusable UI components
  hooks/          Data hooks (useExercises)
  lib/            Supabase client, cn() utility, auth error translations
  pages/          Route components (lazy-loaded)
  test/           Test setup + helpers
```

### Authentication Flow

1. User registers -> Supabase creates account + profile (via trigger)
2. User verifies email (Supabase sends confirmation link)
3. Admin approves user (`approved: true` in profiles table)
4. User can now log in and access content

### Design System

Shares the **same Tailwind v4 design tokens** as the public-site app:
- Colors: `brand-navy`, `brand-red`, `brand-gold`, `surface`, `text`, `text-muted`
- Fonts: Montserrat (self-hosted woff2)
- Radii: `rounded-card`, `rounded-input`, `rounded-pill`, `rounded-cta`
- Container: `container-page` (max-width 1280px)

Both apps use identical `@theme` blocks so they look like one website.
