# UI Review Plan

## 1. All URLs

### Public Pages

| # | URL | Page | Route File |
|---|-----|------|------------|
| 1 | `/` | Home | `src/app/page.tsx` |
| 2 | `/blog` | Blog listing | `src/app/(public)/blog/page.tsx` |
| 3 | `/blog/what-is-java-and-why-learn-it` | Blog post | `src/app/(public)/blog/[slug]/page.tsx` |
| 4 | `/blog/series/java-fundamentals` | Series overview | `src/app/(public)/blog/series/[seriesId]/page.tsx` |
| 5 | `/blog/series/java-fundamentals/jf-ch1/getting-started-with-java` | Chapter reader | `src/app/(public)/blog/series/[seriesId]/[chapterId]/[slug]/page.tsx` |
| 6 | `/about` | About | `src/app/(public)/about/page.tsx` |

### Admin Pages

| # | URL | Page | Route File |
|---|-----|------|------------|
| 7 | `/admin/login` | Login | `src/app/admin/login/page.tsx` |
| 8 | `/admin` | Dashboard | `src/app/admin/page.tsx` |
| 9 | `/admin/posts` | Posts list | `src/app/admin/posts/page.tsx` |
| 10 | `/admin/posts/new` | New post | `src/app/admin/posts/new/page.tsx` |
| 11 | `/admin/posts/:id/edit` | Edit post | `src/app/admin/posts/[id]/edit/page.tsx` |
| 12 | `/admin/series` | Series list | `src/app/admin/series/page.tsx` |
| 13 | `/admin/series/new` | New series | `src/app/admin/series/new/page.tsx` |
| 14 | `/admin/series/:id/edit` | Edit series | `src/app/admin/series/[id]/edit/page.tsx` |
| 15 | `/admin/chapters` | Chapters list | `src/app/admin/chapters/page.tsx` |
| 16 | `/admin/about` | Edit about | `src/app/admin/about/page.tsx` |

### Shared Layout Components (appear on every public page)

| Component | File |
|-----------|------|
| Navbar (with rabbit + grass) | `src/components/public/Navbar.tsx` |
| Footer | `src/components/public/Footer.tsx` |

---

## 2. Review Checklist Per Page

For each page, check the following dimensions:

- **Layout** — spacing, alignment, max-width, padding on mobile + desktop
- **Typography** — font sizes, line-height, hierarchy (h1→h2→body)
- **Colors** — contrast against dark background, consistent use of brand palette
- **Responsiveness** — looks good at 375px, 768px, 1280px
- **Empty states** — what shows when there is no data
- **Loading states** — skeleton or spinner if async
- **Interactive states** — hover, focus, disabled styles on buttons/links
- **Rabbit + grass** — positioned well, not clipping content, sleeping on read pages

---

## 3. Detailed Page-by-Page Plan

---

### Page 1 — Home `/`

**Goal**: First impression. Brand identity, entry points to blog and series.

**Check:**
- [ ] Hero section: headline readable, CTA button visible and styled
- [ ] Featured posts/series section: cards layout, image thumbnails
- [ ] Navbar rabbit is active (not sleeping)
- [ ] Grass strip looks natural, no overflow issues
- [ ] Mobile: hero text doesn't overflow, cards stack cleanly
- [ ] No dead whitespace below fold on large screens

---

### Page 2 — Blog Listing `/blog`

**Goal**: Scannable list of all posts and series.

**Check:**
- [ ] Post cards: title, date, tag/category badge, short excerpt
- [ ] Series cards: visually distinct from standalone posts
- [ ] Filter or tag bar (if exists): labels readable, active state visible
- [ ] Pagination or infinite scroll: controls accessible
- [ ] Empty state: message shown if no posts
- [ ] Mobile: card grid collapses to single column

---

### Page 3 — Blog Post `/blog/[slug]`

**Goal**: Clean, focused reading experience.

**Check:**
- [ ] Rabbit enters sleep pose when on this page
- [ ] Prose max-width ~65ch for readability
- [ ] Headings hierarchy clear (h1 title, h2 sections)
- [ ] Code blocks: syntax highlighted, horizontal scroll on overflow
- [ ] Images: responsive, not stretching beyond container
- [ ] Back link to `/blog` or breadcrumb
- [ ] Published date and estimated read time shown
- [ ] Mobile: no horizontal scroll, font size comfortable

---

### Page 4 — Series Overview `/blog/series/[seriesId]`

**Goal**: Introduce the series and list all chapters.

**Check:**
- [ ] Series title, description, total chapters shown
- [ ] Chapter list: ordered, each with title + short description
- [ ] Progress indicator (if user has started)
- [ ] "Start reading" CTA prominent
- [ ] Rabbit sleeping (reading-focused page)
- [ ] Mobile: chapter list readable, no cramped layout

---

### Page 5 — Chapter Reader `/blog/series/[seriesId]/[chapterId]/[slug]`

**Goal**: Deep reading mode. Distraction-free.

**Check:**
- [ ] Rabbit sleeping on this page
- [ ] Sidebar or sticky nav: previous / next chapter links
- [ ] Chapter title + series breadcrumb at top
- [ ] Prose content: same checks as blog post (code blocks, images, width)
- [ ] Lessons listed within chapter (if applicable)
- [ ] Scroll progress indicator (if implemented)
- [ ] Mobile: sidebar collapses or becomes bottom nav

---

### Page 6 — About `/about`

**Goal**: Personal bio, brand story, contact info.

**Check:**
- [ ] Profile image or avatar: sized correctly, not pixelated
- [ ] Bio text readable, good line length
- [ ] Social links / contact: icons + accessible labels
- [ ] Rabbit is active (non-reading page)
- [ ] Mobile: content centered and padded

---

### Page 7 — Admin Login `/admin/login`

**Check:**
- [ ] Form centered on screen
- [ ] Email + password fields labeled and styled
- [ ] Submit button prominent
- [ ] Error message shown on wrong credentials
- [ ] No navbar/grass (admin layout is separate)
- [ ] Mobile: form fits on small screen

---

### Page 8 — Admin Dashboard `/admin`

**Check:**
- [ ] Sidebar navigation visible and linked correctly
- [ ] Summary cards: post count, series count, chapter count
- [ ] Active sidebar link highlighted
- [ ] Mobile: sidebar collapses to hamburger or drawer

---

### Page 9 — Posts List `/admin/posts`

**Check:**
- [ ] Table: title, date, status, actions (edit/delete) columns
- [ ] "New Post" button clearly placed
- [ ] Delete confirmation dialog
- [ ] Empty state when no posts
- [ ] Mobile: table scrolls horizontally or collapses to card view

---

### Page 10 — New Post `/admin/posts/new`

**Check:**
- [ ] Rich text editor renders correctly (TipTap toolbar visible)
- [ ] Title, slug, tags, cover image fields present
- [ ] Save / Publish button states (idle, loading, success, error)
- [ ] Slug auto-generates from title
- [ ] Mobile: editor usable on smaller screens

---

### Page 11 — Edit Post `/admin/posts/[id]/edit`

**Check:**
- [ ] Form pre-filled with existing post data
- [ ] Same checks as New Post page
- [ ] "Back to posts" link works

---

### Page 12 — Series List `/admin/series`

**Check:**
- [ ] Table: series title, chapter count, actions
- [ ] "New Series" button
- [ ] Delete confirmation dialog
- [ ] Empty state

---

### Page 13 — New Series `/admin/series/new`

**Check:**
- [ ] Title, description, cover image fields
- [ ] Save button states
- [ ] Slug auto-generation

---

### Page 14 — Edit Series `/admin/series/[id]/edit`

**Check:**
- [ ] Pre-filled with existing data
- [ ] Same checks as New Series

---

### Page 15 — Chapters List `/admin/chapters`

**Check:**
- [ ] Grouped by series or flat list with series label
- [ ] Order / drag-to-reorder (if implemented)
- [ ] Edit link per chapter
- [ ] Empty state

---

### Page 16 — Edit About `/admin/about`

**Check:**
- [ ] Editable bio and social links
- [ ] Save button and feedback
- [ ] Image upload field (if applicable)

---

## 4. Shared Component Checks

### Navbar
- [ ] `life·style` logo links to `/`
- [ ] Blog / About links work and show active state
- [ ] Rabbit track fills space between logo and links
- [ ] Male + female rabbits move naturally on normal pages
- [ ] Both rabbits sleep on `/blog/[slug]` and series/chapter pages
- [ ] Hovering navbar wakes rabbits even on reading pages
- [ ] Mobile hamburger menu opens/closes correctly
- [ ] Sticky on scroll — doesn't flicker

### Footer
- [ ] Links work
- [ ] Consistent padding with page content
- [ ] Mobile layout doesn't break

### Grass Strip
- [ ] Flowers vary in size (small to large)
- [ ] Positions change on each page refresh
- [ ] No hydration error in console
- [ ] Does not overlap navbar content on small screens

---

## 5. Review Order

Suggested order to review (most visible → least visible):

1. Navbar + grass strip (shared, seen everywhere)
2. Home `/`
3. Blog listing `/blog`
4. Blog post `/blog/[slug]`
5. Series overview `/blog/series/[seriesId]`
6. Chapter reader `/blog/series/.../[chapterId]/[slug]`
7. About `/about`
8. Admin login `/admin/login`
9. Admin dashboard `/admin`
10. Admin posts list + new + edit
11. Admin series list + new + edit
12. Admin chapters + about
