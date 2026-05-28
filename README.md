# Boost by FCR — boostbyfcr.se

Website rebuild for Boost by FC Rosengård. Hygraph headless CMS + React frontends.

## Architecture

```
Hygraph (headless CMS)  →  GraphQL API  →  React frontends
```

## Monorepo Structure

```
apps/
  public-site/    — Public React SPA (P2: Anthony)
  locked-area/    — Locked Metodmaterial React SPA (P4: Mohand)
packages/
  shared-types/   — Shared TypeScript types (auto-generated from Hygraph)
.github/
  workflows/      — CI/CD pipelines
```

## Team

| Role | Person              | Responsibility                                       |
| ---- | ------------------- | ---------------------------------------------------- |
| P1   | Marcus              | Hygraph CMS — content models, schemas, GraphQL API   |
| P2   | Anthony Foran       | Public React frontend, all pages, SEO, accessibility |
| P3   | Robert Czuchra (TL) | Backoffice customization, Anna's UX, training        |
| P4   | Mohand              | Locked area, Metodmaterial, CI/CD, deployment        |
| TL   | Alan                | Project oversight, development review                |

## Branch Strategy

- `main` — protected, requires PR review
- `develop` — integration branch
- `feature/pX-description` — individual feature branches

## PR Rules

- Every merge to `main` requires 1 approved review
- Review your own domain last — fresh eyes catch more
- Cross-cutting changes (shared-types, CI/CD) → Team Leader reviews

## Tech Stack

### Frontend (apps/public-site, apps/locked-area)

- React 19, TypeScript 6 (strict), Vite, Tailwind CSS v4, shadcn/ui
- TanStack Query, React Router v7, React Hook Form + Zod
- react-helmet-async (per-page SEO), Framer Motion

### CMS

- Hygraph (headless CMS, GraphQL API) — owned by P1 (Marcus): content models, schemas

### Infrastructure

- GitHub Actions CI/CD, Cloudflare DNS
