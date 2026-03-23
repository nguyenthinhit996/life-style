# Theme C — "Fresh & Bold" Light Theme Migration Plan

> Convert the entire site from dark theme (`#070D1A` navy) to **Theme C** (white/slate + violet/cyan gradient accents).
> Admin dashboard stays dark (separate scope) — only **public-facing pages** switch to light.

---

## Color Mapping Reference

| Role | Dark (current) | Light (Theme C) |
|------|---------------|------------------|
| Page background | `#070D1A` | `#F8FAFC` (slate-50) |
| Surface / cards | `#0C1524` | `#FFFFFF` (white) |
| Surface alt | `#111E34` | `#F1F5F9` (slate-100) |
| Borders | `#334155` / `white/10` | `#E2E8F0` (slate-200) |
| Text primary | `#F8FAFC` / `text-white` | `#0F172A` (slate-900) |
| Text secondary | `#94A3B8` / `text-white/60` | `#475569` (slate-600) |
| Text muted | `text-white/40` / `text-white/30` | `#94A3B8` (slate-400) |
| Accent primary | `#7C3AED` violet | **Keep** `#7C3AED` |
| Accent secondary | `#06B6D4` cyan | **Keep** `#06B6D4` |
| Hover card shadow | `shadow-violet-900/20` | `shadow-violet-500/10` |
| Code blocks bg | `#0d1117` | `#F8FAFC` border `#E2E8F0` |
| Navbar bg | `#0C1524/80` | `rgba(248,250,252,0.85)` |
| Footer bg | `#0C1524` | `#FFFFFF` |
| Active nav bg | `#7C3AED/15` | `rgba(124,58,237,0.08)` |
| Active nav text | `text-violet-300` | `text-violet-600` |

---

## Files to Change (29 files total)

### 1. Global CSS — `src/app/globals.css`

**Changes:**
- Update CSS custom properties:
  - `--color-bg: #070D1A` → `#F8FAFC`
  - `--color-surface: #0C1524` → `#FFFFFF`
  - `--color-surface2: #111E34` → `#F1F5F9`
  - `--color-border: #334155` → `#E2E8F0`
  - `--color-text: #F8FAFC` → `#0F172A`
  - `--color-muted: #94A3B8` → `#475569`
- Update `body` styles to use light background and dark text
- Switch `.ProseMirror pre` code blocks to light theme (GitHub Light)
- Switch token colors from GitHub Dark → GitHub Light palette
- Update `.input-style` and `.select-style` for light backgrounds
- Update `.public-content pre` code blocks to light theme
- Add `.admin-dark` scoped overrides so admin pages keep dark styling

### 2. Root Layout — `src/app/layout.tsx`

**No changes needed** — just sets fonts and renders children.

### 3. Home Page — `src/app/page.tsx`

**Changes:**
- `bg-[#070D1A] text-white` → `bg-[#F8FAFC] text-[#0F172A]`

### 4. Public Layout — `src/app/(public)/layout.tsx`

**Changes:**
- `bg-[#070D1A] text-white` → `bg-[#F8FAFC] text-[#0F172A]`

### 5. 404 Page — `src/app/not-found.tsx`

**Changes:**
- `bg-[#070D1A]` → `bg-[#F8FAFC]`
- `text-white` → `text-[#0F172A]`
- `text-white/50` → `text-slate-500`
- `text-white/70` → `text-slate-600`
- `border-white/20 hover:border-white/40` → `border-slate-200 hover:border-slate-300`

### 6. Navbar — `src/components/public/Navbar.tsx`

**Changes:**
- Navbar background: `bg-[#0C1524]/80` → `bg-[#F8FAFC]/85`
- Border: `border-[#334155]/50` → `border-[#E2E8F0]`
- Add violet/cyan gradient bottom accent line (via `after:` pseudo or border-image)
- Nav link text: `text-[#94A3B8]` → `text-slate-500`
- Nav link hover: `hover:bg-[#334155]/40 hover:text-[#F8FAFC]` → `hover:bg-violet-50 hover:text-violet-600`
- Active state: `bg-[#7C3AED]/15 text-violet-300` → `bg-violet-50 text-violet-600`
- Mobile menu: `bg-[#0C1524]` → `bg-white`
- Mobile menu border: `border-[#334155]/50` → `border-[#E2E8F0]`
- Mobile hamburger: `text-[#94A3B8] hover:bg-[#334155]/40 hover:text-[#F8FAFC]` → `text-slate-500 hover:bg-slate-100 hover:text-slate-800`

### 7. HeroSection — `src/components/public/HeroSection.tsx`

**Changes:**
- Blob colors: reduce opacity, keep violet/cyan hue but lighter
  - `bg-violet-600/20` → `bg-violet-500/10`
  - `bg-cyan-500/15` → `bg-cyan-400/8`
- Dot grid: `#fff` → `#0F172A` (dark dots on light bg), keep low opacity
- Heading: `text-white` → `text-[#0F172A]`
- Subtitle: `text-white/60` → `text-slate-500`
- Tag pill: keep cyan but adjust contrast for light bg
- CTA primary: keep `bg-violet-600` button (works on both), shadow → `shadow-violet-500/20`
- CTA outline: `border-white/20 text-white/80` → `border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600`

### 8. CategoriesSection — `src/components/public/CategoriesSection.tsx`

**Changes:**
- Heading: `text-white` → `text-[#0F172A]`
- Subtitle: `text-white/50` → `text-slate-500`
- Card backgrounds: Replace dark gradients with light pastel tints:
  - IT: `from-violet-500/20 to-violet-900/5` → `from-violet-50 to-white`
  - English: `from-cyan-500/20 to-cyan-900/5` → `from-cyan-50 to-white`
  - Lifestyle: `from-emerald-500/20 to-emerald-900/5` → `from-emerald-50 to-white`
- Card borders: adjust to match light palette
- Description: `text-white/60` → `text-slate-500`
- Link at bottom: `text-white/30` → `text-slate-400`
- Shadow on hover: `shadow-black/20` → `shadow-violet-500/8` (per category tinted)
- Add left colored border stripe (4px) per category card

### 9. FeaturedPostsSection — `src/components/public/FeaturedPostsSection.tsx`

**Changes:**
- Heading: `text-white` → `text-[#0F172A]`
- Sub text: `text-white/40` → `text-slate-400`

### 10. PostCard — `src/components/public/PostCard.tsx`

**Changes:**
- Card background: `bg-[#0C1524]` → `bg-white`
- Card border: `border-white/10` → `border-slate-200`
- Hover border: `hover:border-violet-500/40` → `hover:border-violet-300`
- Hover shadow: `hover:shadow-violet-900/20` → `hover:shadow-violet-500/8`
- Img fallback: `bg-[#111E34]` → `bg-slate-100`
- Cover fallback gradient: `from-violet-900/30 to-[#0C1524]` → `from-violet-50 to-white`
- Badge fallback: `bg-white/10 text-white/60` → `bg-slate-100 text-slate-500`
- Category badge colors: Keep pastel light badges (`bg-violet-100/60` etc.)
- Title: `text-white` → `text-slate-800`, hover → `text-violet-600`
- Excerpt: `text-white/50` → `text-slate-500`
- Footer text: `text-white/30` → `text-slate-400`
- Read arrow hover: `group-hover:text-violet-400` → `group-hover:text-violet-600`

### 11. SeriesCard — `src/components/public/SeriesCard.tsx`

**Changes:**
- Gradient backgrounds: Replace `to-[#0C1524]` with `to-white`
- Border: `border-white/10` → `border-slate-200`
- Badge colors: Dark badge → light pastel badge
- Title: `text-white` → `text-slate-800`, hover → `text-violet-600`
- Description: `text-white/55` → `text-slate-500`
- Tags: `bg-white/5 text-white/40` → `bg-slate-100 text-slate-500`
- Footer: `text-white/30` → `text-slate-400`
- Hover shadow: `shadow-black/30` → `shadow-violet-500/8` (per category)
- "Coming Soon" badge: `bg-white/10 text-white/40` → `bg-slate-100 text-slate-500`

### 12. Footer — `src/components/public/Footer.tsx`

**Changes:**
- Background: `bg-[#0C1524]` → `bg-white`
- Border: `border-[#334155]/50` → `border-[#E2E8F0]`
- Link text: `text-[#94A3B8]` → `text-slate-500`
- Link hover: `hover:text-[#F8FAFC]` → `hover:text-slate-800`
- Copyright: `text-[#475569]` → `text-slate-400`

### 13. BlogListingClient — `src/components/public/BlogListingClient.tsx`

**Changes:**
- Heading: `text-white` → `text-[#0F172A]`
- Filter buttons bg: `bg-[#0C1524]` → `bg-white`
- Filter border: `border-white/10` → `border-slate-200`
- Filter text: `text-white/60` → `text-slate-500`
- Active filter: Adjust violet active state for light bg
- Search input: `bg-[#0C1524] border-white/10 text-white/80 placeholder-white/30` → `bg-white border-slate-200 text-slate-800 placeholder-slate-400`

### 14. ChapterTree — `src/components/public/ChapterTree.tsx`

**Changes:**
- All `text-white/*` → appropriate slate equivalents
- Hover states: `hover:bg-white/5` → `hover:bg-slate-50`
- Active state: `bg-white/5 text-white/30` → `bg-violet-50 text-violet-600`
- Connector lines: `text-white/20` → `text-slate-300`

### 15. LessonNav — `src/components/public/LessonNav.tsx`

**Changes:**
- Card background: `bg-[#0C1524]` → `bg-white` with `border-slate-200`
- Text: `text-white/30` → `text-slate-400`
- Link text: `text-white/70 hover:text-white` → `text-slate-600 hover:text-violet-600`
- Separator: `text-white/30` → `text-slate-300`

### 16. ContentRenderer — `src/components/public/ContentRenderer.tsx`

**Changes:**
- Copy button: `bg-white/10 text-white/50` → `bg-slate-100 text-slate-500`
- Copy button hover: `hover:bg-white/20 hover:text-white` → `hover:bg-slate-200 hover:text-slate-700`
- Borders: `border-white/10` → `border-slate-200`
- Copied state color: keep `#4ade80` (green checkmark)

### 17. BackToTop — `src/components/public/BackToTop.tsx`

**Changes:**
- Shadow: `shadow-violet-900/40` → `shadow-violet-500/20`

### 18. ReadingProgressBar — `src/components/public/ReadingProgressBar.tsx`

**Changes:**
- Bar background: `bg-white/5` → `bg-slate-200`
- Gradient bar: Keep violet→cyan gradient

### 19. ShareButton — `src/components/public/ShareButton.tsx`

**Changes:** Check and adjust if contains dark colors.

### 20. NavGrass — `src/components/public/NavGrass.tsx`

**Changes:**
- Grass colors need to shift from dark greens to lighter garden greens
  - Back layer: `#0e2d14` etc → lighter forest shades
  - Mid layer: `#1a5e2a` etc → medium greens  
  - Front layer: `#2d904a` etc → brighter greens
- Keep flower palettes (they're already colorful)

### 21. NavRabbit — `src/components/public/NavRabbit.tsx`

**Changes:** Check if rabbit uses dark colors; likely neutral — may need light adjustment.

### 22. PageTransition — `src/components/public/PageTransition.tsx`

**Changes:** Check for dark bg colors.

---

## PUBLIC PAGES (Server Components)

### 23. About Page — `src/app/(public)/about/page.tsx`

**Changes:**
- Card backgrounds: `bg-[#0C1524]` → `bg-white`
- Borders: `border-white/10` → `border-slate-200`
- Text colors: `text-white/70` → `text-slate-600`

### 24. Blog Post — `src/app/(public)/blog/[slug]/page.tsx`

**Changes:**
- Prose classes: remove `prose-invert`, switch to light prose:
  - `prose-p:text-white/70` → `prose-p:text-slate-600`
  - `prose-headings:text-white` → `prose-headings:text-slate-800`
  - `prose-code:bg-[#111E34]` → `prose-code:bg-slate-100`
  - `prose-pre:bg-[#0d1117]` → `prose-pre:bg-[#F8FAFC]`
  - `prose-pre:border-white/10` → `prose-pre:border-slate-200`
  - `prose-blockquote:text-white/60` → `prose-blockquote:text-slate-500`
- All `text-white/*` → slate equivalents

### 25. Series Page — `src/app/(public)/blog/series/[seriesId]/page.tsx`

**Changes:**
- Badges: `bg-white/10 text-white/40` → `bg-slate-100 text-slate-500`
- Card: `bg-[#0C1524] border-white/10` → `bg-white border-slate-200`
- Text colors: various `text-white/*` → slate equivalents

### 26. Lesson Page — `src/app/(public)/blog/series/[seriesId]/[chapterId]/[slug]/page.tsx`

**Changes:**
- Same prose fixes as Blog Post (#24)
- Text colors → slate equivalents

### 27. Blog Listing — `src/app/(public)/blog/page.tsx`

**No changes** — uses `BlogListingClient` which is handled in #13.

---

## ADMIN PAGES & COMPONENTS — KEEP DARK

The admin dashboard will **stay dark** (it's a separate scope behind `/admin`).

The admin layout already wraps in its own `bg-[#070D1A] text-white`, so no changes needed for:
- `src/app/admin/layout.tsx` — **No change**
- `src/app/admin/page.tsx` — **No change**
- `src/app/admin/about/page.tsx` — **No change**
- `src/app/admin/chapters/page.tsx` — **No change**
- `src/app/admin/posts/page.tsx` — **No change**
- `src/app/admin/posts/[id]/edit/page.tsx` — **No change**
- `src/app/admin/posts/new/page.tsx` — **No change**
- `src/app/admin/series/page.tsx` — **No change**
- `src/app/admin/series/[id]/edit/page.tsx` — **No change**
- `src/app/admin/series/new/page.tsx` — **No change**
- `src/app/admin/login/page.tsx` — **No change** (dark login screen is fine)
- `src/components/admin/*` — **No changes** to any admin components

### Global CSS Admin Handling

Since `.input-style` / `.select-style` in `globals.css` are used by admin forms, we must:
- Keep the dark-themed classes for admin by scoping them under a `.admin-dark` parent, OR
- Create separate light input classes for public pages if needed (public pages don't use these classes currently)

**Decision**: The `.input-style` and `.select-style` classes are only used in admin pages. We'll scope them with the admin dark context so they're unaffected.

---

## Execution Order

1. **`globals.css`** — Update CSS vars and code theme (foundation change)
2. **Layouts** — `page.tsx`, `(public)/layout.tsx`, `not-found.tsx` (top-level containers)
3. **Navbar + Footer** — Frame components
4. **HeroSection**, **CategoriesSection**, **FeaturedPostsSection** — Home page sections
5. **PostCard**, **SeriesCard** — Shared card components
6. **BlogListingClient** — Blog page
7. **ChapterTree**, **LessonNav**, **ContentRenderer** — Reading components
8. **About page**, **Blog post page**, **Series page**, **Lesson page** — Individual pages
9. **BackToTop**, **ReadingProgressBar**, **ShareButton** — Small utility components
10. **NavGrass**, **NavRabbit** — Animated decorations (adjust for light bg)
11. **Final review** — Visual test in browser

---

## Notes

- **Accent colors preserved**: Violet (`#7C3AED`) and Cyan (`#06B6D4`) gradients stay identical
- **Fonts preserved**: Syne, DM Sans, JetBrains Mono — unchanged
- **Animations preserved**: PageTransition, NavRabbit, NavGrass, BackToTop — only colors adjusted
- **Admin untouched**: All `/admin` routes and admin components remain dark-themed
- **Code syntax**: Switch from GitHub Dark to GitHub Light token colors in globals.css
