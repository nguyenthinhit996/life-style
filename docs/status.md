# Project Status — life-style

> **Single source of truth** for what is done, what is in progress, and what remains.  
> Updated after each session. Last updated: **2026-03-08**

---

## Overall Progress

```
Phase 0 — Scaffold          ████████████ ✅ DONE
Phase 1 — Data Layer        ████████████ ✅ DONE
Phase 2 — Auth              ████████████ ✅ DONE
Phase 3 — Admin Dashboard   ████████████ ✅ DONE
Phase 3+ — Enhancements     ████████████ ✅ DONE
Phase 4 — Public Website    ░░░░░░░░░░░░ 🔴 NOT STARTED  ← NEXT
Phase 5 — Design Polish     ░░░░░░░░░░░░ 🔴 NOT STARTED
Phase 6 — Firebase          ░░░░░░░░░░░░ ⏳ FUTURE
Phase 7 — Deployment        ░░░░░░░░░░░░ ⏳ FUTURE
```

---

## Phase 0 — Scaffold ✅

- [x] Next.js 16+ App Router with TypeScript
- [x] Tailwind v4 + typography plugin
- [x] Fonts: Syne, DM Sans, JetBrains Mono via next/font/google
- [x] `.env.local` with NEXTAUTH_SECRET + NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
- [x] Folder structure created
- [x] Git initialized, first commit pushed

---

## Phase 1 — Types + Data Layer ✅

- [x] `src/types/index.ts` — Series, Chapter, Post, User, SeriesWithChapters
- [x] `src/lib/db/mock.ts` — all read + write functions, `globalThis` singletons, `fs.writeFileSync` persistence
- [x] `src/lib/db/index.ts` — re-exports mock
- [x] `src/lib/utils.ts` — cn(), slugify(), formatDate(), calcReadTime()
- [x] `db/series.json` — 6 series (Java, JS, Python, AI, English Writing, English for Devs)
- [x] `db/chapters.json` — 31 chapters
- [x] `db/posts.json` — ~49 posts/lesson stubs
- [x] `db/users.json` — 1 admin user (bcrypt hashed)
- [x] `db/about.json` — bio, skills, social links

---

## Phase 2 — Auth ✅

- [x] `src/lib/auth.ts` — NextAuth v5 Credentials provider, JWT + session callbacks
- [x] `src/app/api/auth/[...nextauth]/route.ts`
- [x] `src/middleware.ts` — protects `/admin/*`, redirects to `/admin/login`
- [x] `src/app/admin/login/page.tsx` — login form with error handling

---

## Phase 3 — Admin Dashboard ✅

- [x] `src/app/admin/layout.tsx` — h-screen layout (enables sticky toolbar), uses auth()
- [x] `src/components/admin/Sidebar.tsx` — nav with active link highlight (fixed)
- [x] `src/app/admin/page.tsx` — dashboard home with stats
- [x] `src/app/admin/posts/page.tsx` — posts table
- [x] `src/components/admin/PostsTable.tsx` — with status badges + Edit/Delete
- [x] `src/app/admin/posts/new/page.tsx`
- [x] `src/app/admin/posts/[id]/edit/page.tsx`
- [x] `src/components/admin/PostForm.tsx` — full form with preview pane
- [x] `src/app/admin/series/page.tsx`
- [x] `src/app/admin/series/new/page.tsx`
- [x] `src/app/admin/series/[id]/edit/page.tsx`
- [x] `src/components/admin/SeriesForm.tsx`
- [x] `src/app/admin/chapters/page.tsx`
- [x] `src/app/admin/about/page.tsx`
- [x] `src/app/api/posts/route.ts` + `[id]/route.ts`
- [x] `src/app/api/series/route.ts` + `[id]/route.ts`
- [x] `src/app/api/chapters/route.ts` + `[id]/route.ts`
- [x] `src/app/api/about/route.ts`

---

## Phase 3+ — Admin Enhancements ✅

All committed. These go beyond the original plan:

### Editor (RichEditor.tsx)
- [x] Floating sticky toolbar (not sticky to page, floats above content)
- [x] Text color picker — 12-color swatch dropdown, color bar indicator
- [x] Highlight button — improved "A" icon with yellow underline bar
- [x] Image picker modal (`ImagePickerModal.tsx`) — Unsplash search + URL tab
- [x] Image size picker — S (30%) / M (55%) / L (80%) / Full (100%)
- [x] Code block syntax highlighting — `CodeBlockLowlight` + `lowlight` (GitHub Dark theme)
- [x] Language selector dropdown appears when cursor inside a code block

### Preview Pane
- [x] Syntax highlighting in preview — `applyHighlighting()` processes raw HTML with lowlight
- [x] Inline code no longer has gray background (was conflicting with colored text)

### Series Form
- [x] Emoji icon picker modal (`EmojiPickerModal.tsx`) — 100+ icons, search, 8 categories

### Data Persistence
- [x] All mutations write back to `db/*.json` via `fs.writeFileSync`

---

## Phase 4 — Public Website 🔴 NOT STARTED

**Goal:** All public-facing pages that visitors see.  
**Prerequisite:** Phase 3 complete ✅

### Step 4.1 — Public layout + Navbar + Footer
- [ ] `src/app/(public)/layout.tsx`
- [ ] `src/components/public/Navbar.tsx`
- [ ] `src/components/public/Footer.tsx`

### Step 4.2 — Home page
- [ ] `src/app/(public)/page.tsx`
- [ ] `src/components/public/HeroSection.tsx`
- [ ] `src/components/public/CategoriesSection.tsx`
- [ ] `src/components/public/FeaturedPostsSection.tsx`
- [ ] `src/components/public/PostCard.tsx` (shared)

### Step 4.3 — Blog listing page
- [ ] `src/app/(public)/blog/page.tsx`
- [ ] `src/components/public/SeriesCard.tsx`
- [ ] Filter pills: All · IT · English · Lifestyle
- [ ] Sub-filter: Java · JS · Python · AI (when IT selected)
- [ ] Search bar (client-side)

### Step 4.4 — Series detail page
- [ ] `src/app/(public)/blog/series/[seriesId]/page.tsx`
- [ ] `src/components/public/ChapterTree.tsx` (accordion)

### Step 4.5 — Lesson reader page
- [ ] `src/app/(public)/blog/series/[seriesId]/[chapterId]/[slug]/page.tsx`
- [ ] `src/components/public/LessonNav.tsx` (prev/next + progress)
- [ ] Left sidebar with ChapterTree

### Step 4.6 — Blog post page
- [ ] `src/app/(public)/blog/[slug]/page.tsx`
- [ ] Share bar (copy link + Twitter/X)
- [ ] Related posts section

### Step 4.7 — About page
- [ ] `src/app/(public)/about/page.tsx`

### Step 4.8 — 404 page
- [ ] `src/app/not-found.tsx`

---

## Phase 5 — Design Polish 🔴 NOT STARTED

**Goal:** Make the visual design match the mockup exactly.  
**Prerequisite:** Phase 4 complete.

- [ ] Animations with Framer Motion (page transitions, stagger reveals)
- [ ] Dark/light mode toggle (next-themes)
- [ ] Mobile responsive nav (hamburger menu)
- [ ] Reading progress bar on blog/lesson pages
- [ ] Back-to-top button
- [ ] Open Graph meta tags for social sharing
- [ ] Skeleton loaders for dynamic content

---

## Phase 6 — Firebase Migration ⏳ FUTURE

- [ ] Set up Firebase project + Firestore
- [ ] Implement `src/lib/db/firebase.ts` with same API as `mock.ts`
- [ ] Toggle `src/lib/db/index.ts` to use Firebase
- [ ] Migrate `db/*.json` data to Firestore
- [ ] Firebase Storage for image uploads (replace Unsplash URLs)

---

## Phase 7 — Deployment ⏳ FUTURE

- [ ] Vercel project linked to GitHub repo
- [ ] Environment variables set in Vercel dashboard
- [ ] Custom domain configured
- [ ] Performance audit (Lighthouse ≥ 90)

---

## Recent Commits (last session)

| Hash | Message |
|------|---------|
| `c27242f` | fix: emoji picker inactive tabs now have visible border + bg |
| `ca61757` | fix: emoji picker tabs wrap so all categories visible |
| `3834e80` | ui: redesign emoji picker — search icon, cleaner tabs, dot indicator, smart footer |
| `40970a5` | feat: emoji icon picker with search + categories for series form |
| `c3e272a` | fix: apply lowlight highlighting to preview pane |
| `3698470` | feat: syntax highlighting in code blocks via CodeBlockLowlight + lowlight |

---

## Known Issues / Decisions Pending

| Issue | Status |
|-------|--------|
| `npm run dev` terminal shows exit code 1 — likely a previous crash, not current | Check if dev server is running |
| Unsplash requires `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` in `.env.local` | Must be set for image search |
| Public website (`/`) currently shows placeholder or nothing | Phase 4 will fix this |
| Firebase not connected — all data is JSON files | By design until Phase 6 |

---

## Next Recommended Action

> **Start Phase 4, Step 4.1**
>
> Create the public layout with Navbar and Footer.
> This unblocks all other public pages.
>
> Files to create:
> - `src/app/(public)/layout.tsx`
> - `src/components/public/Navbar.tsx`  
> - `src/components/public/Footer.tsx`
