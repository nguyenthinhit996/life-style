# UI Fix Plan
Generated: 2026-03-08

---

## Section A — Bug Fixes (High → Low severity)

---

### Bug Fix 1 — Chapter Reader: Article Content Too Wide
- **Page(s)**: `/blog/series/[seriesId]/[chapterId]/[slug]`
- **File**: `src/app/(public)/blog/series/[seriesId]/[chapterId]/[slug]/page.tsx`
- **Issue**: The `<article>` inside the sidebar layout is `flex-1 min-w-0` with no max-width. On a 1280px viewport it renders at ~912px — far exceeding the ~65ch (~680px) optimal reading width.
- **Severity**: High
- **Action**: Add `max-w-3xl` to the `<article>` element:
  ```diff
  - <article className="flex-1 min-w-0 py-10 pb-20">
  + <article className="flex-1 min-w-0 max-w-3xl py-10 pb-20">
  ```

---

### Bug Fix 2 — Admin Dashboard: Stats Grid Breaks on Mobile
- **Page(s)**: `/admin`
- **File**: `src/app/admin/page.tsx`
- **Issue**: Stats bento uses `grid-cols-5` with no responsive breakpoints. On mobile each column is ~55px wide.
- **Severity**: High
- **Action**: Change the grid class:
  ```diff
  - <div className="grid grid-cols-5 gap-3">
  + <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
  ```

---

### Bug Fix 3 — Admin Layout: No Mobile Sidebar Handling
- **Page(s)**: All `/admin/*` pages
- **File**: `src/app/admin/layout.tsx`, `src/components/admin/Sidebar.tsx`
- **Issue**: Admin layout uses `flex h-screen` with a fixed `w-56` sidebar. On mobile (375px), sidebar takes 224px leaving only ~151px for content.
- **Severity**: High
- **Action**: Hide sidebar on mobile using `hidden lg:flex`. The admin is primarily a desktop tool; on mobile, redirect or show a simple top bar.

  In `src/app/admin/layout.tsx`:
  ```diff
  - <div className="flex h-screen bg-[#070D1A] text-white">
  -   <Sidebar user={session.user} />
  -   <main className="flex-1 overflow-y-auto p-8" ...>
  + <div className="flex h-screen bg-[#070D1A] text-white">
  +   <div className="hidden lg:flex">
  +     <Sidebar user={session.user} />
  +   </div>
  +   <main className="flex-1 overflow-y-auto p-4 lg:p-8" ...>
  ```
  Add a mobile warning bar inside `<main>` before `{children}`:
  ```jsx
  <div className="lg:hidden mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
    Admin panel is optimised for desktop. Some features may be limited on mobile.
  </div>
  ```

---

### Bug Fix 4 — Blog Post: Mobile Horizontal Overflow
- **Page(s)**: `/blog/[slug]`
- **File**: `src/app/(public)/blog/[slug]/page.tsx`, `src/app/globals.css`
- **Issue**: Playwright detected `scrollWidth > 385` on 375px viewport. Source is likely wide images or tables inside post content lacking `overflow-x: hidden` on the wrapper.
- **Severity**: High
- **Action 1** — Add `overflow-x: hidden` to the blog post page outer wrapper:
  ```diff
  - <div className="min-h-screen pt-24 pb-20">
  + <div className="min-h-screen pt-24 pb-20 overflow-x-hidden">
  ```
  **Action 2** — In `globals.css`, ensure wide content inside prose wraps:
  ```css
  .public-content table {
    display: block;
    overflow-x: auto;
    max-width: 100%;
  }
  .public-content img {
    max-width: 100%;
    height: auto;
  }
  ```

---

### Bug Fix 5 — Home → Blog: Category URL Param Ignored
- **Page(s)**: `/blog` (inbound from `/` category cards)
- **File**: `src/components/public/BlogListingClient.tsx`
- **Issue**: `CategoriesSection` links to `/blog?category=IT` but `BlogListingClient` uses `useState('ALL')` without reading `useSearchParams`. The filter is never applied from URL.
- **Severity**: Medium
- **Action**: Add `useSearchParams` to read initial category from URL:
  ```diff
  + import { useSearchParams } from 'next/navigation'
  
    export default function BlogListingClient({ seriesWithCount, posts }: Props) {
  +   const searchParams = useSearchParams()
  +   const initialCategory = (searchParams.get('category') as Category) || 'ALL'
  -   const [category, setCategory] = useState<Category>('ALL')
  +   const [category, setCategory] = useState<Category>(initialCategory)
  ```

---

## Section B — UX / UI Improvements (High → Low impact)

---

### UX Fix 1 — Chapter Reader: Add Mobile Chapter Navigation
- **Page(s)**: `/blog/series/[seriesId]/[chapterId]/[slug]`
- **File**: `src/app/(public)/blog/series/[seriesId]/[chapterId]/[slug]/page.tsx`
- **UX Dimension**: Mobile usability
- **Problem**: On mobile, the sidebar is hidden (`hidden lg:block`) and there's no way to navigate to other chapters apart from the prev/next lesson buttons. Users have no overview of where they are in the course.
- **Impact**: High
- **Action**: Add a collapsible "Course Outline" button/accordion above the lesson header on mobile. Below the existing `Link` back-to-series:
  ```jsx
  {/* Mobile chapter outline toggle */}
  <details className="lg:hidden mb-6 rounded-xl border border-white/10 bg-[#0C1524]">
    <summary className="cursor-pointer px-4 py-3 text-sm font-mono text-white/50 hover:text-white/80 transition-colors list-none flex items-center justify-between">
      <span>Course Outline</span>
      <span className="text-xs">▾</span>
    </summary>
    <div className="px-4 pb-4">
      <ChapterTree chapters={tree.chapters} seriesId={seriesId} currentLessonSlug={slug} />
    </div>
  </details>
  ```

---

### UX Fix 2 — Share Button: Add Copy Confirmation Feedback
- **Page(s)**: `/blog/[slug]`
- **File**: `src/components/public/ShareButton.tsx`
- **UX Dimension**: Feedback & states
- **Problem**: Click "Copy link" → nothing visually changes. User has no confirmation the link was copied.
- **Impact**: Medium
- **Action**: Replace with a stateful version:
  ```tsx
  'use client'
  import { useState } from 'react'
  
  export default function ShareButton() {
    const [copied, setCopied] = useState(false)
  
    const copyLink = async () => {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  
    return (
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 text-sm font-mono text-violet-400 hover:text-violet-300 transition-colors"
      >
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span className="text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            Copy link
          </>
        )}
      </button>
    )
  }
  ```

---

### UX Fix 3 — Blog Listing: Increase Filter Pill Touch Targets
- **Page(s)**: `/blog`
- **File**: `src/components/public/BlogListingClient.tsx`
- **UX Dimension**: Mobile usability
- **Problem**: Category filter pills are `py-1.5` (~32px tall) — below the 44px mobile touch target recommendation.
- **Impact**: Medium
- **Action**: Change in `BlogListingClient.tsx`:
  ```diff
  - 'px-4 py-1.5 rounded-full text-sm font-mono transition-colors duration-150',
  + 'px-4 py-2.5 rounded-full text-sm font-mono transition-colors duration-150',
  ```

---

### UX Fix 4 — Blog Listing: Add aria-label to Search Input
- **Page(s)**: `/blog`
- **File**: `src/components/public/BlogListingClient.tsx`
- **UX Dimension**: Accessibility basics
- **Problem**: Search input has no label — only placeholder text. Screen readers will not announce what this field is for.
- **Impact**: Low
- **Action**:
  ```diff
  - <input
  -   type="text"
  -   placeholder="Search series & posts…"
  + <input
  +   type="text"
  +   placeholder="Search series & posts…"
  +   aria-label="Search series and posts"
  ```

---

### UX Fix 5 — Reading Progress Bar: Increase Height
- **Page(s)**: `/blog/[slug]`, `/blog/series/.../[chapterId]/[slug]`
- **File**: `src/components/public/ReadingProgressBar.tsx`
- **UX Dimension**: Feedback & states
- **Problem**: `h-0.5` (2px) progress bar is almost invisible at normal viewing distance.
- **Impact**: Low
- **Action**:
  ```diff
  - <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-white/5 pointer-events-none">
  + <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-white/5 pointer-events-none">
  ```

---

### UX Fix 6 — Admin Login: Add Logo + Back-to-Site Link
- **Page(s)**: `/admin/login`
- **File**: `src/app/admin/login/page.tsx`
- **UX Dimension**: Emotional tone / clarity
- **Problem**: The login page is completely disconnected from the site's branding. No logo, no way to go back to the public site.
- **Impact**: Low
- **Action**: Add above the `<div className="w-full max-w-sm ...">`:
  ```jsx
  <div className="mb-6 text-center">
    <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text font-display text-xl font-bold tracking-tight text-transparent">
      life·style
    </span>
  </div>
  ```
  And below the `</form>` closing tag:
  ```jsx
  <p className="mt-4 text-center text-xs text-slate-600">
    <a href="/" className="hover:text-slate-400 transition-colors">← Back to site</a>
  </p>
  ```

---

### UX Fix 7 — Series Page: Add Total Reading Time
- **Page(s)**: `/blog/series/[seriesId]`
- **File**: `src/app/(public)/blog/series/[seriesId]/page.tsx`
- **UX Dimension**: Clarity of purpose
- **Problem**: Users see "N chapters · N lessons" but not how long the series will take. This is important for learner expectation-setting.
- **Impact**: Low
- **Action**: In `SeriesDetailPage`, compute total reading time and add to the stats row:
  ```diff
  + const totalReadTime = chapters.reduce((sum, ch) =>
  +   sum + ch.lessons.reduce((s, l) => s + (l.readTime || 0), 0), 0)
  
    <div className="mt-5 flex items-center gap-6 text-sm font-mono text-white/40">
      <span>{chapters.length} chapters</span>
      <span>{totalLessons} lessons</span>
  +   {totalReadTime > 0 && <span>~{totalReadTime} min total</span>}
    </div>
  ```

---

### UX Fix 8 — About: Fill Social Links in DB
- **Page(s)**: `/about`
- **File**: `db/about.json`
- **UX Dimension**: Interactive affordances, emotional tone
- **Problem**: All social link strings are `""` — the contact section is invisible. The page looks anonymous for what should be a personal brand.
- **Impact**: Medium
- **Action**: Update `db/about.json` social section with real URLs. Example:
  ```json
  "social": {
    "github": "https://github.com/peter",
    "linkedin": "https://linkedin.com/in/peter",
    "twitter": ""
  }
  ```
  Note: The code already correctly hides links with empty values, so only add URLs you actually want shown.
