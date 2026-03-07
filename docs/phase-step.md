# Phase Step Reference

> **Purpose:** Granular, ordered action list for each phase.  
> This file is the single source of truth during coding — check it before every action to avoid hallucination, duplicating work, or skipping steps.
>
> **Current state:** Phase 0 ✅ + Phase 1 ✅ complete. Next.js 16.1.6 app running with types, mock data layer, and utils.  
> **Next action: Phase 2** — Auth (NextAuth v5 Credentials).

---

## Current Workspace State

```
/Users/peter/Desktop/Project/life-style/
├── docs/
│   ├── 01-overview.md
│   ├── 02-plan.md
│   ├── 03-architecture.md
│   ├── 04-pages-design.md
│   ├── 05-coding-guide.md
│   ├── phase-step.md          ← this file
│   └── ui-mockup.html
├── db/
│   ├── series.json            ✅ 6 series (Java, JS, Python, AI, English Writing, English for Devs)
│   ├── chapters.json          ✅ 31 chapters
│   ├── posts.json             ✅ ~49 posts/lesson stubs
│   └── users.json             ✅ 1 admin user (password NOT yet bcrypt hashed)
└── README.md
```

> ⚠️ The `db/users.json` password is a plain-text placeholder. Hash it before testing auth.

---

## Phase 0 — Project Scaffold

**Status: ✅ DONE**  
**Goal:** Create a working Next.js app skeleton with all dependencies installed.

### Step 0.1 — Run create-next-app

```bash
cd /Users/peter/Desktop/Project/life-style
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

> Answer the prompts:
> - Would you like to use Turbopack for `next dev`? → **Yes**
> - All other prompts → accept defaults

### Step 0.2 — Install all dependencies

```bash
npm install firebase next-auth@beta @tiptap/react @tiptap/pm @tiptap/starter-kit \
  lucide-react clsx tailwind-merge framer-motion next-themes bcryptjs
npm install -D @types/bcryptjs
```

### Step 0.3 — Clean boilerplate

Delete / replace these default files:
- `src/app/page.tsx` → replace with a temp `<h1>Coming soon</h1>`
- `src/app/globals.css` → keep only Tailwind directives (`@tailwind base/components/utilities`)
- Delete `public/vercel.svg`, `public/next.svg`

### Step 0.4 — Create folder structure

Create these empty folders (create a `.gitkeep` inside each):

```
src/app/(public)/
src/app/(public)/about/
src/app/(public)/blog/
src/app/(public)/blog/[slug]/
src/app/(public)/blog/series/[seriesId]/
src/app/(public)/blog/series/[seriesId]/[chapterId]/[slug]/
src/app/admin/
src/app/admin/login/
src/app/admin/posts/
src/app/admin/posts/new/
src/app/admin/posts/[id]/edit/
src/app/admin/series/
src/app/admin/series/new/
src/app/admin/series/[id]/edit/
src/app/admin/chapters/
src/app/admin/about/
src/app/api/auth/[...nextauth]/
src/app/api/posts/[id]/
src/app/api/series/[id]/
src/app/api/chapters/[id]/
src/components/ui/
src/components/public/
src/components/admin/
src/lib/db/
src/types/
```

### Step 0.5 — Create .env.local

Create `/Users/peter/Desktop/Project/life-style/.env.local`:

```env
NEXTAUTH_SECRET="replace-with-openssl-rand-base64-32-output"
NEXTAUTH_URL="http://localhost:3000"

NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

Generate the secret:
```bash
openssl rand -base64 32
```

### Step 0.6 — Hash the admin password

```bash
node -e "const b = require('bcryptjs'); b.hash('YOUR_PASSWORD_HERE', 10).then(console.log)"
```

Replace the `password` field in `db/users.json` with the output hash.

### Step 0.7 — Configure tsconfig for JSON imports

In `tsconfig.json`, verify `resolveJsonModule` is `true`:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

### Step 0.8 — Git init + first commit

```bash
git init
git add .
git commit -m "chore: scaffold Next.js app + install dependencies"
```

**✅ Phase 0 done when:** `npm run dev` starts with no errors and shows "Coming soon" at localhost:3000.

---

## Phase 1 — Types + Data Layer

**Status: ✅ DONE**  
**Goal:** Create the TypeScript types and mock data functions so any page can call `getPosts()`, `getSeries()` etc.  
**Prerequisite:** Phase 0 complete.

### Step 1.1 — TypeScript types

Create `src/types/index.ts` — copy exact code from `docs/05-coding-guide.md` Step 2.  
Types to define: `Series`, `Chapter`, `Post`, `User`, `SeriesWithChapters`.

### Step 1.2 — Mock data reader

Create `src/lib/db/mock.ts` — copy exact code from `docs/05-coding-guide.md` Step 3.  
Functions to implement:
- `getSeries()` — all series
- `getPublishedSeries()` — published series sorted by order
- `getSeriesById(id)` — single series
- `getChaptersBySeries(seriesId)` — chapters sorted by order
- `getPosts()` — all posts
- `getPublishedPosts()` — published posts
- `getPostBySlug(slug)` — single post
- `getLessonsByChapter(chapterId)` — lessons sorted by order
- `getBlogPosts()` — blog type only, published, sorted newest first
- `getPostsByCategory(category)` — filter by IT/ENGLISH/LIFESTYLE
- `getSeriesTree(seriesId)` — series + chapters + lessons in one object
- `getUserByEmail(email)` — for auth

### Step 1.3 — Data layer index (toggle)

Create `src/lib/db/index.ts`:
```ts
export * from './mock'
// export * from './firebase'  ← uncomment when switching to production
```

### Step 1.4 — Utility helpers

Create `src/lib/utils.ts` — copy from `docs/05-coding-guide.md` Step 4.  
Functions: `cn()`, `slugify()`, `formatDate()`, `calcReadTime()`.

**✅ Phase 1 done when:** You can import `getSeries()` in a test page and it returns the 6 series from `db/series.json`.

---

## Phase 2 — Auth

**Status: ✅ DONE**  
**Goal:** Admin login/logout with session protection.  
**Prerequisite:** Phase 1 complete. `.env.local` NEXTAUTH_SECRET set.

### Step 2.1 — NextAuth config

Create `src/lib/auth.ts` — copy from `docs/05-coding-guide.md` Step 5.  

Key points:
- Provider: Credentials (email + password)
- `authorize()` calls `getUserByEmail()` then `bcrypt.compare()`
- JWT callback: attach `role` to token
- Session callback: attach `role` to session user
- `pages.signIn` = `/admin/login`

### Step 2.2 — NextAuth API route

Create `src/app/api/auth/[...nextauth]/route.ts`:
```ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

### Step 2.3 — Middleware

Create `src/middleware.ts` at root of `src/` — copy from `docs/05-coding-guide.md` Step 6.  

Logic:
- If route starts with `/admin` AND is not `/admin/login` AND no session → redirect to `/admin/login`
- If on `/admin/login` AND already logged in → redirect to `/admin`

### Step 2.4 — Admin login page

Create `src/app/admin/login/page.tsx`:
- Centered card layout
- Email input + password input
- Submit calls `signIn('credentials', { email, password, redirect: false })`
- Show error message on failed login
- On success: `router.push('/admin')`

Refer to `docs/04-pages-design.md` Page 7 for visual spec.

### Step 2.5 — Test login

```
Email: peter@lifestyle.dev
Password: YOUR_PASSWORD (the one you hashed in Phase 0 Step 0.6)
```

**✅ Phase 2 done when:** Visiting `/admin` without login redirects to `/admin/login`. Logging in with correct credentials redirects to `/admin`. Logging in with wrong credentials shows an error.

---

## Phase 3 — Admin Dashboard

**Status: NOT STARTED**  
**Goal:** Full private dashboard to manage posts, series, chapters, and the About page.  
**Prerequisite:** Phase 2 complete.

### Step 3.1 — Admin layout

Create `src/app/admin/layout.tsx`:
- Wraps all `/admin/*` pages (except `/admin/login`)
- Uses `auth()` to get session — passes user to sidebar
- Structure: `<aside Sidebar> + <main>{children}</main>`

Create `src/components/admin/Sidebar.tsx`:
- Logo top-left
- Nav items: All Posts · New Post · Series · Chapters · About Page · Settings
- Bottom: avatar, user name, role, logout button
- Active item highlight (violet left border + background)

### Step 3.2 — Posts list page

Create `src/app/admin/posts/page.tsx`:
- Calls `getPosts()` server-side
- Renders `<PostsTable posts={posts} />`

Create `src/components/admin/PostsTable.tsx`:
- Grid columns: Title | Type (lesson/blog) | Category | Status | Actions
- Status badges: Published (green) / Draft (amber)
- Action buttons: Edit (links to `/admin/posts/[id]/edit`) | Delete (calls DELETE API with confirm dialog)

### Step 3.3 — New post API

Create `src/app/api/posts/route.ts` — GET + POST (copy from `docs/05-coding-guide.md` Step 7).  
Create `src/app/api/posts/[id]/route.ts` — PUT + DELETE.

> In mock data phase: PUT/DELETE will just return success JSON. Real writes happen when Firebase is connected.

### Step 3.4 — New/Edit post page + form

Create `src/app/admin/posts/new/page.tsx` + `src/app/admin/posts/[id]/edit/page.tsx`.  
Create `src/components/admin/PostForm.tsx` (shared by both pages):

Fields:
1. Title (large input) → auto-generates slug
2. Slug (editable text input)
3. **Type toggle:** `Blog Post` | `Lesson`
   - If Lesson: Series `<select>` → Chapter `<select>` (loads on series change)
4. Category `<select>`: IT / English / Lifestyle
5. Excerpt `<textarea>`
6. Cover image URL `<input>`
7. TipTap editor (see Step 3.5)
8. Published `<toggle>`
9. Buttons: "Save Draft" + "Publish"

### Step 3.5 — TipTap editor component

Create `src/components/admin/RichEditor.tsx`:

```tsx
'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// Toolbar buttons: Bold · Italic · H2 · H3 · BulletList · OrderedList · Blockquote · Code · CodeBlock
// Output: editor.getHTML() → store as string in form state
```

### Step 3.6 — Series pages

Create `src/app/admin/series/page.tsx` — table of all series (calls `getSeries()`).  
Create `src/app/admin/series/new/page.tsx` + `src/app/admin/series/[id]/edit/page.tsx`.  
Create `src/components/admin/SeriesForm.tsx`:

Fields: Title · Slug · Description · Category · Tags (chip input) · Icon (emoji) · Color (dropdown: blue/yellow/green/violet/teal/cyan/orange) · Level · Published toggle.

Create `src/app/api/series/route.ts` (GET + POST) and `src/app/api/series/[id]/route.ts` (PUT + DELETE).

### Step 3.7 — Chapters page

Create `src/app/admin/chapters/page.tsx`:
- Series dropdown at top (calls `getSeries()`)
- On series select: shows chapters for that series (calls `getChaptersBySeries(id)`)
- Table: order · title · lesson count · Edit · Delete
- "Add Chapter" button at bottom

Create `src/app/api/chapters/route.ts` (GET + POST) and `src/app/api/chapters/[id]/route.ts` (PUT + DELETE).

### Step 3.8 — About page editor

Create `src/app/admin/about/page.tsx`:
- Form with bio textarea, skills list (add/remove chips), social links (GitHub, LinkedIn, Twitter URL)
- Save button POSTs to `/api/about`
- For now: reads/writes from a `db/about.json` mock file

Create `db/about.json`:
```json
{
  "bio": "Hi, I'm Peter — a developer and English enthusiast...",
  "skills": ["Java", "JavaScript", "Next.js", "TypeScript", "English C1"],
  "social": {
    "github": "",
    "linkedin": "",
    "twitter": ""
  }
}
```

**✅ Phase 3 done when:** Peter can log in, see all posts, create a new blog post with the TipTap editor, hit Publish, and see it in the posts table.

---

## Phase 4 — Public Website

**Status: NOT STARTED**  
**Goal:** All public-facing pages visitors will see.  
**Prerequisite:** Phase 3 complete (data layer proven to work).

### Step 4.1 — Shared public layout

Create `src/app/(public)/layout.tsx`:
- Renders `<Navbar />` + `{children}` + `<Footer />`

Create `src/components/public/Navbar.tsx`:
- Logo (gradient, links to `/`)
- Links: Blog (`/blog`) · Tutorials (`/blog` filtered) · About (`/about`)
- Right: dark/light toggle (uses `next-themes`)

Create `src/components/public/Footer.tsx`:
- Logo + short description
- Links: Blog · About · GitHub · LinkedIn

### Step 4.2 — Home page

Create `src/app/(public)/page.tsx`.  
Sections (refer to `docs/04-pages-design.md` Page 1):
1. `<HeroSection />` — eyebrow pill, title with gradient, sub-tagline, two CTA buttons, radial gradient + dot grid background
2. `<CategoriesSection />` — 3 colored cards: IT (blue) · English (teal) · Lifestyle (orange)
3. `<FeaturedPostsSection />` — calls `getBlogPosts()`, renders first 3 as `<PostCard />`
4. `<AboutTeaser />` — photo, 2-line bio, "Learn More →" link

### Step 4.3 — Blog listing page

Create `src/app/(public)/blog/page.tsx`:
- Server component: calls `getPublishedSeries()` + `getBlogPosts()`
- Level 1 filter pills: All · IT · English · Lifestyle (client-side state)
- Level 2 tech pills (visible when IT selected): All Tech · Java · JS · Python · AI
- Search bar (client-side filter on title/excerpt)
- Tutorial series grid: `<SeriesCard />` per series
- Blog posts grid: `<PostCard />` per post

Create `src/components/public/SeriesCard.tsx`:
- Cover area: gradient background + emoji icon + series name
- Body: title, tags, chapter/lesson count, Start → button
- Locked state (Coming Soon badge) for `published: false` series

Create `src/components/public/PostCard.tsx`:
- Cover image (gradient fallback)
- Category badge overlay (top-left)
- Title, excerpt (2 lines), date + read time

### Step 4.4 — Series detail page

Create `src/app/(public)/blog/series/[seriesId]/page.tsx`:
- Calls `getSeriesTree(seriesId)` server-side
- Series banner: icon + title + level badge + tags + stats row + "Start Learning →" button
- `<ChapterTree />` accordion (chapters expand to show lessons)
- Clicking a published lesson: navigate to lesson reader

Create `src/components/public/ChapterTree.tsx`:
- Accordion list: chapter header (click to expand) + lesson rows
- Lesson row: order number · title · read time · Published / Coming Soon badge
- Published lessons are clickable links

### Step 4.5 — Lesson reader page

Create `src/app/(public)/blog/series/[seriesId]/[chapterId]/[slug]/page.tsx`:
- Calls `getSeriesTree(seriesId)` + `getPostBySlug(slug)`
- Left sidebar: `<ChapterTree />` with current lesson highlighted
- Main area: breadcrumb → title → meta row → rich text content
- Bottom nav: Prev / Next lesson with series progress bar

Create `src/components/public/LessonNav.tsx`:
- Prev button (disabled if first lesson)
- Next button (disabled if last lesson)
- Progress text: "Lesson X of Y"

### Step 4.6 — Blog post page

Create `src/app/(public)/blog/[slug]/page.tsx`:
- Calls `getPostBySlug(slug)`
- Renders: cover image · category badge · date · title · author chip · read time
- Body: `dangerouslySetInnerHTML={{ __html: post.content }}` (styled with Tailwind prose)
- Share bar: copy link + Twitter/X
- Related posts: `getPostsByCategory(post.category)` filtered and shown as 3 cards

### Step 4.7 — About page

Create `src/app/(public)/about/page.tsx`:
- Reads `db/about.json`
- Profile banner: avatar/photo + name + title + social links
- Bio section
- Skills grid: chip per skill
- Two-column section: Tech topics vs English topics

### Step 4.8 — 404 page

Create `src/app/not-found.tsx`:
- Large "404" in gradient text
- "Page not found" message
- "← Back to Home" button

**✅ Phase 4 done when:** All public pages render real data from mock JSON. Navigation works. Tutorial tree is clickable. Lesson reader shows content with prev/next working.

---

## Phase 5 — Design Polish

**Status: NOT STARTED**  
**Goal:** Make the visual design match the mockup exactly.  
**Prerequisite:** Phase 4 complete.

### Step 5.1 — Tailwind custom theme

Edit `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      violet: { DEFAULT: '#7C3AED', dark: '#6D28D9' },
      cyan:   { DEFAULT: '#06B6D4' },
    },
    fontFamily: {
      display: ['Space Grotesk', 'sans-serif'],
      body:    ['Inter', 'sans-serif'],
      mono:    ['JetBrains Mono', 'monospace'],
    },
  }
}
```

### Step 5.2 — Google Fonts

In `src/app/layout.tsx` root layout: add `<link>` for Space Grotesk + Inter + JetBrains Mono (or use `next/font/google`):
```ts
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
```

### Step 5.3 — Dark/Light mode

Install `next-themes`. Wrap root layout in `<ThemeProvider>`.  
Add `ThemeToggle` button to Navbar using `useTheme()`.  
All color tokens use `dark:` Tailwind variant.

### Step 5.4 — Animations

Add `framer-motion` entrance animations:
- Hero text: fade-in + slide-up on mount
- Post cards: stagger fade-in when listing page loads
- Sidebar lessons: subtle left-slide on chapter expand

### Step 5.5 — Responsive layout

Audit all pages for:
- Mobile (`sm`): single column, no sidebar, hamburger menu
- Tablet (`md`): 2-column grid, collapsible sidebar
- Desktop (`lg+`): full layout as in mockup

### Step 5.6 — Code syntax highlighting

Install `highlight.js` or `shiki` for code blocks in lesson content:
- Detect language from TipTap code block attributes
- Apply token colors (matching mockup: keywords blue, strings amber, comments green)

**✅ Phase 5 done when:** The live site visually matches `docs/ui-mockup.html` on desktop and looks clean on mobile.

---

## Phase 6 — SEO & Performance

**Status: NOT STARTED**  
**Prerequisite:** Phase 5 complete.

### Steps (each is one focused task)

- **6.1** Add `metadata` export to every `page.tsx`:
  ```ts
  export const metadata = { title: 'Page Title | Life-Style', description: '...' }
  ```
  For dynamic pages use `generateMetadata()` that reads from the data layer.

- **6.2** Open Graph: add `openGraph` to each page's metadata with a cover image URL.

- **6.3** Sitemap: install `next-sitemap`, create `next-sitemap.config.js`, add `postbuild` script.

- **6.4** `robots.txt`: auto-generated by `next-sitemap`. Disallow `/admin/*`.

- **6.5** Images: replace all `<img>` with Next.js `<Image>` component everywhere.

- **6.6** Lighthouse audit: run `npx lighthouse http://localhost:3000 --view`. Fix any score below 85.

**✅ Phase 6 done when:** Lighthouse scores 90+ on Performance, SEO, Accessibility on Home + Blog pages.

---

## Phase 7 — Deploy

**Status: NOT STARTED**  
**Prerequisite:** Phase 6 complete.

### Steps

- **7.1** Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
  - Enable Firestore (production mode)
  - Enable Authentication (Email/Password provider)
  - Create Web App → copy config values

- **7.2** Create `src/lib/db/firebase.ts` with same function signatures as `mock.ts`.  
  Use Firestore SDK: `collection()`, `getDocs()`, `addDoc()`, `updateDoc()`, `deleteDoc()`.

- **7.3** Switch data layer: in `src/lib/db/index.ts`:
  ```ts
  // export * from './mock'
  export * from './firebase'
  ```

- **7.4** Seed Firestore: write a one-time script `scripts/seed-firebase.ts` that:
  - Reads each `db/*.json` file
  - Writes each item into its corresponding Firestore collection

- **7.5** Push final code to GitHub.

- **7.6** Connect GitHub repo to [vercel.com](https://vercel.com).  
  All environment variables from `.env.local` must be added in Vercel dashboard.

- **7.7** Set `NEXTAUTH_URL` to the Vercel production domain.

- **7.8** Verify production: test login, post creation, public pages, tutorial tree.

- **7.9** Connect custom domain in Vercel → DNS settings.

**✅ Phase 7 done when:** The site is live at a public URL, Peter can log in and publish posts, visitors can read all content.

---

## Phase 8 — Post-Launch (Ongoing)

These are deferred features — do NOT start until Phase 7 is complete.

| Feature | Effort | Notes |
|---------|--------|-------|
| View count per post | Low | Firestore increment on page load |
| Newsletter signup | Medium | Resend or Mailchimp API |
| Comment system | High | Firestore subcollection or Giscus |
| Admin analytics dashboard | Medium | Chart.js + aggregate Firestore queries |
| RSS feed | Low | `next-rss` or manually build `/feed.xml` route |
| Progress tracking per user | High | Requires user accounts (Firebase Auth) |

---

## Quick Checklist — Phase Status

| Phase | Name | Status |
|-------|------|--------|
| 0 | Scaffold | ⬜ NOT STARTED |
| 1 | Types + Data Layer | ⬜ NOT STARTED |
| 2 | Auth | ⬜ NOT STARTED |
| 3 | Admin Dashboard | ⬜ NOT STARTED |
| 4 | Public Website | ⬜ NOT STARTED |
| 5 | Design Polish | ⬜ NOT STARTED |
| 6 | SEO & Performance | ⬜ NOT STARTED |
| 7 | Deploy | ⬜ NOT STARTED |
| 8 | Post-Launch | ⬜ DEFERRED |

> Update the status column to 🔄 IN PROGRESS or ✅ DONE as you go.

---

## Key Decisions to Remember

| Topic | Decision |
|-------|----------|
| Data source | Mock JSON in `db/` during Phases 0–6. Switch to Firebase at Phase 7. |
| Auth | NextAuth v5 beta with Credentials provider. Passwords hashed with bcryptjs. |
| Rich text | TipTap — stores HTML string. Render with `dangerouslySetInnerHTML`. |
| Images | Placeholder URLs (Unsplash) during dev. Cloudinary in production. |
| Styling | Tailwind CSS utility classes. Custom colors/fonts in `tailwind.config.ts`. |
| Server vs Client | All data fetching in Server Components. Interactive UI (filters, editor) in Client Components with `'use client'`. |
| API routes | Only used by the admin dashboard. Public pages fetch directly via data layer functions (no API calls from public pages). |
