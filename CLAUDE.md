# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
bun dev          # Dev server on port 8080
bun run build    # Production build
bun run lint     # ESLint
bun test         # Vitest (run once)
bun test:watch   # Vitest (watch mode)
bun run preview  # Preview production build locally
```

Use `bun` (not `npm`) for all installs and script execution.

---

## Architecture

**Stack:** React 18 + Vite 5 + TypeScript 5 (strict) | Tailwind CSS 3 + shadcn/ui (Radix) | React Router v6 | TanStack Query v5 | Supabase (DB + Auth + Storage)

**Path alias:** `@/` maps to `./src/`

### Data flow

All public-facing content is fetched from Supabase via custom hooks in `src/hooks/useContentBlocks.ts`. Each hook wraps a TanStack Query `useQuery` call — **never use raw `useEffect` + `fetch` for data fetching**.

- `useContentBlocks(page, section?)` — generic key/value page content from the `content_blocks` table
- `useAnnouncements()`, `useEvents()`, `useGallery()`, `useFaculty()`, `useLeadership()`, `useMandatoryDocuments()` — typed hooks for their respective Supabase tables
- `useAdminContentBlocks` — admin write variant in `src/hooks/useAdminContentBlocks.ts`
- `useAdminAuth` — wraps Supabase auth in `src/hooks/useAdminAuth.ts`

Single Supabase client instance: `src/lib/supabase.ts` (reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`).

### Auth & admin

All `/admin/*` routes are wrapped in `<ProtectedRoute>` (checks `supabase.auth.getSession()`). Login is at `/admin/login`. The admin shell is `AdminLayout` with a nested `<Outlet>`.

Admin page structure:
- `src/pages/admin/` — one file per manager (Events, Gallery, Faculty, Leadership, Announcements, ContactSubmissions, MandatoryDocuments) + `Dashboard`, `Login`, `PageEditorRouter`
- `src/components/admin/` — `AdminLayout`, `EditorLayout`, `ProtectedRoute`, `PreviewPanel`, `PreviewDraftContext`

### Content blocks pattern

Page editors use `EditorLayout` + `PreviewDraftContext` to manage draft state before persisting to Supabase. Each editable field maps to a row in `content_blocks` with `(page, section, field_key, value, content_type)`.

### Routing

Defined in `src/App.tsx`. Public pages: `/`, `/about`, `/academics`, `/student-life`, `/facilities`, `/admissions`, `/gallery`, `/contact`, `/faculty`, `/mandatory-disclosure`. Hash anchors (`#history`, `#vision`, etc.) are used for sub-section deep links.

### Styling

- Custom Tailwind tokens: `gold`, `navy-dark` (in `tailwind.config.ts`)
- Fonts: Playfair Display (headings) + Source Sans 3 (body) — loaded via Google Fonts, configured in Tailwind
- Dark mode: `class` strategy (next-themes compatible), not yet toggled in UI
- Icons: `lucide-react` only
- All spacing/layout: Tailwind utilities only, no inline styles

---

## Code rules

- TypeScript strict — zero `any` types
- Every Supabase call: wrapped in `try/catch` with a Sonner toast on error
- Image uploads always go to Supabase Storage; save the public URL to DB, never local paths
- Forms: `react-hook-form` + `zod` schema validation always
- shadcn/ui components only — do not add external UI libraries
- No `console.log` in production code
- `src/components/ui/` — auto-generated shadcn primitives, do not modify directly

---

## Environment

Required in `.env.local`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## School reference

- **Name:** VardhmanShikshaMandir Senior Secondary School
- **Address:** 16, Padam Chand Marg, Daryaganj, New Delhi - 110002
- **Phone:** 01123277448 | **Email:** vardhmanschool@yahoo.co.in
- **CBSE Affiliation:** 2730128 | **School Code:** 85012 | **DoE ID:** 2127129
- **Established:** 1976 | **Session:** 2026-27
- **Principal:** Seema Kandwal (MA, B.Ed) | **Manager:** Charu Jain | **Head Mistress:** Archana Razdan (MA, B.Ed)

Use these values when filling hardcoded content — the codebase still has some placeholder strings that need replacing (see `context.md` §8 for the full issues list).
