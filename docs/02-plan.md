# Step-by-Step Build Plan

> Strategy: **Launch fast with basics → then improve.** Build the minimum working version first, then layer in more features.

---

## Phase 0 — Preparation (Day 1)

> Set up everything before writing a single line of app code.

### Steps

- [ ] Create a new Next.js project with TypeScript
  ```bash
  npx create-next-app@latest life-style --typescript --tailwind --eslint --app --src-dir
  ```
- [ ] Clean up default boilerplate files
- [ ] Set up folder structure (see `03-architecture.md`)
- [ ] Install core dependencies:
  - `firebase` — Firebase SDK (installed now, used later)
  - `next-auth` — admin authentication
  - `@tiptap/react` — rich text editor for the dashboard
  - `lucide-react` — icons
  - `clsx` + `tailwind-merge` — class utilities
- [ ] Initialize a Git repository and push to GitHub
- [ ] Create `.env.local` with placeholders for environment variables

### Output
A clean, runnable Next.js + Tailwind project on GitHub.

---

## Phase 1 — Mock Data Setup (Day 1–2)

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

- [ ] Create `db/series.json` — list of tutorial series
- [ ] Create `db/chapters.json` — chapters within each series (`seriesId` reference)
- [ ] Create `db/posts.json` — lessons (`seriesId + chapterId`) and standalone blog posts
- [ ] Create `db/users.json` — one admin user for login testing
- [ ] Create `src/lib/db/mock.ts` — functions to read and filter JSON data:
  - `getPosts()`, `getPostBySlug()`, `getPublishedPosts()`
  - `getSeries()`, `getSeriesById()`
  - `getChaptersBySeries()`, `getLessonsByChapter()`
- [ ] Create `src/lib/db/index.ts` — exports from mock (swap to Firebase later)
- [ ] Define shared TypeScript types in `src/types/index.ts`

### Firebase Migration (Later — Phase 7+)

- [ ] Create Firebase project at console.firebase.google.com
- [ ] Enable Firestore database
- [ ] Create `src/lib/db/firebase.ts` with the same function signatures as `mock.ts`
- [ ] Change one line in `src/lib/db/index.ts`: `export * from './firebase'`
- [ ] Upload mock JSON data to Firestore

### Output
All data available locally with zero setup. Ready to build UI on top immediately.

---

## Phase 2 — Admin Authentication (Day 2–3)

> Lock down the dashboard so only Peter can access it.

### Steps

- [ ] Set up **NextAuth.js** with Credentials provider (email + password)
- [ ] Add login page at `/admin/login`
  - Bold, clean form with email + password fields
  - Show error on wrong credentials
- [ ] Protect all `/admin/*` routes using Next.js middleware
  - Redirect unauthenticated users to `/admin/login`
- [ ] Implement logout functionality
- [ ] Store hashed passwords using `bcryptjs`

### Output
A working login system — only Peter can reach the dashboard.

---

## Phase 3 — Admin Dashboard (Day 3–6)

> Build the private dashboard to create and manage blog posts.

### Steps

- [ ] Build the admin layout (`/admin`):
  - Sidebar with navigation: All Posts, New Post, Series, Chapters, About Page, Settings
  - Header with user info and logout button
- [ ] **Posts List Page** (`/admin/posts`):
  - Table of all posts (title, type: lesson/blog, category, status, date)
  - Published / Draft toggle
  - Edit and Delete buttons per post
- [ ] **New Post Page** (`/admin/posts/new`):
  - Title input
  - Slug input (auto-generated from title, editable)
  - Type selector: Blog Post vs Lesson
  - If Lesson: Series selector + Chapter selector
  - Category selector (IT / English / Lifestyle)
  - Excerpt textarea
  - **TipTap rich text editor** for full post content
  - Cover image upload (store URL or use file upload)
  - Published toggle
  - Save / Publish button
- [ ] **Edit Post Page** (`/admin/posts/[id]/edit`):
  - Same form as New Post, pre-filled with existing data
- [ ] **Delete Post**:
  - Confirmation dialog before deleting
- [ ] **Series List Page** (`/admin/series`):
  - Table of all series (icon, title, category, tags, status, chapters count)
  - Create / Edit / Delete buttons
- [ ] **New / Edit Series Page** (`/admin/series/new` + `/admin/series/[id]/edit`):
  - Title, slug, description
  - Category selector
  - Tags input (comma-separated)
  - Icon (emoji picker or text input), Color selector
  - Level selector (Beginner / Intermediate / Advanced)
  - Published toggle
- [ ] **Chapters Page** (`/admin/chapters`):
  - Filter by Series dropdown
  - Table of chapters for selected series (title, order, lesson count)
  - Create / Edit / Delete buttons
- [ ] **About Page Editor** (`/admin/about`):
  - Edit bio text, skills, and social links stored as JSON
  - Save button to persist changes
- [ ] Build API routes (Next.js Route Handlers) for:
  - `GET /api/posts` — list all posts
  - `POST /api/posts` — create post or lesson
  - `PUT /api/posts/[id]` — update post/lesson
  - `DELETE /api/posts/[id]` — delete post/lesson
  - `GET /api/series` — list all series
  - `POST /api/series` — create series
  - `PUT /api/series/[id]` — update series
  - `DELETE /api/series/[id]` — delete series
  - `GET /api/chapters` — list chapters (filter by seriesId)
  - `POST /api/chapters` — create chapter
  - `PUT /api/chapters/[id]` — update chapter
  - `DELETE /api/chapters/[id]` — delete chapter

### Output
Fully working dashboard — Peter can write, edit, publish, and delete posts.

---

## Phase 4 — Public Website (Day 6–10)

> Build the pages visitors will see.

### Steps

- [ ] **Home Page** (`/`):
  - Bold hero section with Peter's name, tagline, and a CTA button
  - Featured blog posts section (latest 3 posts)
  - Categories section (IT / English / Lifestyle cards)
  - Mini About teaser with link to full About page
- [ ] **About Page** (`/about`):
  - Personal photo + name + title
  - Bio / story section
  - Skills section (tech stack, English proficiency, etc.)
  - Links to GitHub, LinkedIn, social media
- [ ] **Blog Listing Page** (`/blog`):
  - Grid of post cards + series cards
  - Level 1 filter: All / IT / English / Lifestyle
  - Level 2 filter (IT): Java / JavaScript / Python / AI
  - Search bar to find posts by keyword
- [ ] **Series Detail Page** (`/blog/series/[seriesId]`):
  - Series banner: icon, title, description, level badge, tags
  - Chapter/lesson tree (collapsible, shows progress)
  - "Start Learning" CTA to first lesson
- [ ] **Lesson Reader Page** (`/blog/series/[seriesId]/[chapterId]/[slug]`):
  - Left sidebar: chapter/lesson tree for current series
  - Main: lesson title, content, code blocks w/ syntax highlighting
  - Bottom nav: Previous Lesson ← → Next Lesson
  - Series breadcrumb: Series → Chapter → Lesson
- [ ] **Blog Post Page** (`/blog/[slug]`):
  - Full post content rendered from database
  - Cover image, title, category badge, date
  - Share buttons (copy link, social share)
  - Related posts section at the bottom
- [ ] **404 Page** — custom not-found page with navigation back to home

### Output
A fully navigable public website with real content.

---

## Phase 5 — Design Polish (Day 10–12)

> Make it look bold, colorful, and professional.

### Steps

- [ ] Define a color palette — primary accent color + secondary, with dark backgrounds
- [ ] Set up custom Tailwind theme in `tailwind.config.ts`
- [ ] Add consistent typography (e.g., Google Fonts — bold display font for headings)
- [ ] Add **Dark / Light mode** toggle using Tailwind's `dark:` classes + `next-themes`
- [ ] Add subtle animations and transitions:
  - Hover effects on cards and buttons
  - Page entrance animations using CSS or `framer-motion`
- [ ] Make all pages fully responsive (mobile, tablet, desktop)
- [ ] Polish the admin dashboard UI to match the brand

### Output
A visually impressive, on-brand website that works on all devices.

---

## Phase 6 — SEO & Performance (Day 12–13)

> Make the website discoverable and fast.

### Steps

- [ ] Add dynamic `metadata` to every page (title, description) using Next.js Metadata API
- [ ] Add Open Graph images for social sharing previews
- [ ] Generate a sitemap using `next-sitemap`
- [ ] Add `robots.txt`
- [ ] Optimize images using Next.js `<Image>` component
- [ ] Audit with Lighthouse — target 90+ score on Performance, SEO, Accessibility

### Output
A site that ranks well on Google and looks great when shared on social media.

---

## Phase 7 — Deploy (Day 13–14)

> Get the site live on the internet.

### Steps

- [ ] Push all code to GitHub
- [ ] Create a [Vercel](https://vercel.com) account and connect the GitHub repository
- [ ] Switch the data layer from mock to Firebase:
  - In `src/lib/db/index.ts` change `export * from './mock'` → `export * from './firebase'`
- [ ] Add all environment variables in Vercel dashboard:
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` (your production domain)
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - (and all other Firebase vars from `03-architecture.md`)
- [ ] Upload seed data to Firestore (copy from `db/*.json`)
- [ ] Verify the site works end-to-end in production
- [ ] Connect a custom domain (e.g., `peterblog.com`)

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

| Phase | Focus | Target |
|-------|-------|--------|
| 0 | Setup & tooling | Day 1 |
| 1 | Database | Day 1–2 |
| 2 | Auth / Login | Day 2–3 |
| 3 | Admin Dashboard | Day 3–6 |
| 4 | Public Website | Day 6–10 |
| 5 | Design Polish | Day 10–12 |
| 6 | SEO & Performance | Day 12–13 |
| 7 | Deploy | Day 13–14 |
| 8 | Improvements | Ongoing |
