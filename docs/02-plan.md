# Step-by-Step Build Plan

> Strategy: **Launch fast with basics → then improve.** Build the minimum working version first, then layer in more features.

> **Last reviewed: March 12, 2026** — Phases 0–4 complete. Phase 5 mostly done. Phase 6 partial. Phases 7–10 not started.

---

## Phase 0 — Preparation ✅ Complete

> Set up everything before writing a single line of app code.

### Steps

- [x] Create a new Next.js project with TypeScript
- [x] Clean up default boilerplate files
- [x] Set up folder structure (see `03-architecture.md`)
- [x] Install core dependencies:
  - `firebase` — Firebase SDK (installed now, used later)
  - `next-auth` — admin authentication
  - `@tiptap/react` — rich text editor for the dashboard
  - `lucide-react` — icons
  - `clsx` + `tailwind-merge` — class utilities
- [x] Initialize a Git repository and push to GitHub
- [x] Create `.env.local` with environment variables (`AUTH_SECRET`, `NEXTAUTH_URL`, `DB_PROVIDER`, Firebase placeholders)

### Output
A clean, runnable Next.js + Tailwind project on GitHub.

---

## Phase 1 — Mock Data Setup ✅ Complete

> Define your data shape using local JSON files. No internet, no account needed.

### Data Structure

Three types of content — structured as a tree for tutorials:

```
Series  (e.g. Java Fundamentals)
  └── Chapter  (e.g. Getting Started)
        └── Post/Lesson  (e.g. Hello World)

Blog Post  (standalone, no series)
```

### Steps

- [x] Create `db/series.json` — list of tutorial series
- [x] Create `db/chapters.json` — chapters within each series (`seriesId` reference)
- [x] Create `db/posts.json` — lessons (`seriesId + chapterId`) and standalone blog posts
- [x] Create `db/users.json` — one admin user for login testing
- [x] Create `src/lib/db/mock.ts` — full CRUD functions with in-memory store + JSON persistence
- [x] Create `src/lib/db/index.ts` — re-exports from mock (swap to Firebase later)
- [x] Define shared TypeScript types in `src/types/index.ts`

### Firebase Migration (Phase 7)

- [ ] Create Firebase project at console.firebase.google.com
- [ ] Enable Firestore database
- [ ] Create `src/lib/db/firebase.ts` with the same function signatures as `mock.ts`
- [ ] In `src/lib/db/index.ts`: change `export * from './mock'` → `export * from './firebase'`
- [ ] Set `DB_PROVIDER=firebase` in `.env.local` (and Vercel env vars)
- [ ] Upload mock JSON data to Firestore

### Output
All data available locally with zero setup. Ready to build UI on top immediately.

---

## Phase 2 — Admin Authentication ✅ Complete

> Lock down the dashboard so only Peter can access it.

### Steps

- [x] Set up **NextAuth.js v5** with Credentials provider (email + password)
- [x] Add login page at `/admin/login`
- [x] Protect all `/admin/*` routes using Next.js middleware (`src/middleware.ts`)
  - Redirects unauthenticated users to `/admin/login`
  - Redirects logged-in users away from login page
- [x] Implement logout functionality
- [x] Store hashed passwords using `bcryptjs`
- [x] `AUTH_SECRET` correctly set in `.env.local` (NextAuth v5 requirement)
- [x] All mutating API routes (`POST`, `PUT`, `DELETE`) check `auth()` session

### Output
A working login system — only Peter can reach the dashboard.

---

## Phase 3 — Admin Dashboard ✅ Complete

> Build the private dashboard to create and manage blog posts.

### Steps

- [x] Admin layout (`/admin`) with Sidebar + user info
- [x] **Posts List Page** (`/admin/posts`) — table, published toggle, edit/delete
- [x] **New Post Page** (`/admin/posts/new`) — full form with TipTap editor, emoji/image pickers
- [x] **Edit Post Page** (`/admin/posts/[id]/edit`) — pre-filled form
- [x] **Delete Post** — `ConfirmDialog` confirmation before deleting
- [x] **Series List Page** (`/admin/series`) — table with CRUD
- [x] **New / Edit Series Page** (`/admin/series/new` + `/admin/series/[id]/edit`)
- [x] **Chapters Page** (`/admin/chapters`) — filter by series, CRUD
- [x] **About Page Editor** (`/admin/about`) — edit bio, skills, social links
- [x] All API routes:
  - `GET/POST /api/posts`, `PUT/DELETE /api/posts/[id]`
  - `GET/POST /api/series`, `PUT/DELETE /api/series/[id]`
  - `GET/POST /api/chapters`, `PUT/DELETE /api/chapters/[id]`
  - `GET/PUT /api/about`
  - `POST /api/auth/[...nextauth]`

### Output
Fully working dashboard — Peter can write, edit, publish, and delete posts.

---

## Phase 4 — Public Website ✅ Complete

> Build the pages visitors will see.

### Steps

- [x] **Home Page** (`/`) — hero, featured posts, categories section, metadata + Open Graph
- [x] **About Page** (`/about`) — bio, skills, social links, metadata
- [x] **Blog Listing Page** (`/blog`) — post/series cards, category filter, search, metadata
- [x] **Series Detail Page** (`/blog/series/[seriesId]`) — banner, chapter tree, CTA, `generateMetadata`
- [x] **Lesson Reader Page** (`/blog/series/[seriesId]/[chapterId]/[slug]`) — sidebar tree, content, lesson nav, breadcrumb, `generateMetadata`
- [x] **Blog Post Page** (`/blog/[slug]`) — full content, share button, metadata + Open Graph
- [x] **404 Page** (`not-found.tsx`) — custom not-found with nav back to home

### Output
A fully navigable public website with real content.

---

## Phase 5 — Design Polish ✅ Mostly Complete

> Make it look bold, colorful, and professional.

### Steps

- [x] Dark color palette — navy/violet/cyan accent theme
- [x] Custom Tailwind theme configured
- [x] Typography — display font for headings, consistent text scale
- [ ] **Dark / Light mode toggle** — not implemented; site is dark-only (needs `next-themes`)
- [x] Animations — `PageTransition`, `NavRabbit` (running rabbit), `NavGrass` (flowers), `BackToTop`, hover effects
- [x] Fully responsive — mobile menu, responsive grid layouts
- [x] `ReadingProgressBar` on post pages

### Output
A visually impressive, on-brand website that works on all devices.

---

## Phase 6 — SEO & Performance ⚠️ Partial

> Make the website discoverable and fast.

### Steps

- [x] `metadata` export on all static public pages (home, about, blog)
- [x] `generateMetadata` on all dynamic pages (blog post, series, lesson)
- [x] Open Graph tags on home and blog post pages
- [ ] **Open Graph images missing** on `/about`, `/blog`, `/blog/series/[id]`, `/blog/series/[id]/[chapterId]/[slug]`
- [ ] **Sitemap** — no `sitemap.ts` or `next-sitemap` setup yet
- [ ] **`robots.txt`** — not created yet (Next.js 14 can auto-generate via `src/app/robots.ts`)
- [ ] **`next/image`** — cover images use `<img>` tags; switch to `<Image>` for automatic optimization
- [ ] Lighthouse audit — target 90+ on Performance, SEO, Accessibility

### Output
A site that ranks well on Google and looks great when shared on social media.

---

## Phase 7 — Deploy ❌ Not Started

> Get the site live on the internet.

### Steps

- [ ] Push all code to GitHub
- [ ] Create a [Vercel](https://vercel.com) account and connect the GitHub repository
- [ ] Switch data layer:
  - Implement `src/lib/db/firebase.ts` (same function signatures as `mock.ts`)
  - In `src/lib/db/index.ts`: change `export * from './mock'` → `export * from './firebase'`
- [ ] Add all environment variables in Vercel dashboard:
  - `AUTH_SECRET`
  - `NEXTAUTH_URL` (production domain)
  - `DB_PROVIDER=firebase`
  - `NEXT_PUBLIC_FIREBASE_API_KEY` + all other Firebase vars
- [ ] Upload seed data to Firestore (copy from `db/*.json`)
- [ ] Verify the site works end-to-end in production
- [ ] Connect a custom domain

### Output
The website is live at a custom domain — accessible to anyone in the world.

---

## Phase 8 — Post-Launch Improvements (Ongoing)

These are features to add once the site is live:

- [ ] Newsletter subscription (Resend / Mailchimp)
- [ ] Comment system on blog posts
- [ ] View count per post
- [ ] Post tags (in addition to categories)
- [ ] Admin dashboard analytics (total views, popular posts)
- [ ] RSS feed

---

## Summary Timeline

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Setup & tooling | ✅ Complete |
| 1 | Database (mock) | ✅ Complete |
| 2 | Auth / Login | ✅ Complete |
| 3 | Admin Dashboard | ✅ Complete |
| 4 | Public Website | ✅ Complete |
| 5 | Design Polish | ✅ Mostly done (no light mode) |
| 6 | SEO & Performance | ⚠️ Partial (missing sitemap, robots, OG images, next/image) |
| 7 | Deploy + Firebase | ❌ Not started |
| 8 | Improvements | ❌ Not started |


---

