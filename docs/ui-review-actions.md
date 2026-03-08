# UI Review Actions

## Action List

---

### Action 1 — Home `/`
- **Source file(s)**: `src/app/page.tsx`, `src/components/public/HeroSection.tsx`, `src/components/public/FeaturedPostsSection.tsx`, `src/components/public/CategoriesSection.tsx`
- **Checklist items**:
  - [ ] Hero section: headline readable, CTA button visible and styled
  - [ ] Featured posts/series section: cards layout, image thumbnails
  - [ ] Navbar rabbit is active (not sleeping)
  - [ ] Grass strip looks natural, no overflow issues
  - [ ] Mobile: hero text doesn't overflow, cards stack cleanly
  - [ ] No dead whitespace below fold on large screens
- **UX dimensions**: clarity of purpose, visual hierarchy, delight, mobile usability
- **Screenshot path**: /tmp/review-home.png, /tmp/review-home-mobile.png

---

### Action 2 — Blog Listing `/blog`
- **Source file(s)**: `src/app/(public)/blog/page.tsx`, `src/components/public/BlogListingClient.tsx`, `src/components/public/PostCard.tsx`, `src/components/public/SeriesCard.tsx`
- **Checklist items**:
  - [ ] Post cards: title, date, tag/category badge, short excerpt
  - [ ] Series cards: visually distinct from standalone posts
  - [ ] Filter or tag bar (if exists): labels readable, active state visible
  - [ ] Pagination or infinite scroll: controls accessible
  - [ ] Empty state: message shown if no posts
  - [ ] Mobile: card grid collapses to single column
- **UX dimensions**: scannability, visual hierarchy, affordances, spacing
- **Screenshot path**: /tmp/review-blog.png, /tmp/review-blog-mobile.png

---

### Action 3 — Blog Post `/blog/[slug]`
- **Source file(s)**: `src/app/(public)/blog/[slug]/page.tsx`, `src/components/public/ContentRenderer.tsx`, `src/components/public/ReadingProgressBar.tsx`, `src/components/public/ShareButton.tsx`
- **Checklist items**:
  - [ ] Rabbit enters sleep pose when on this page
  - [ ] Prose max-width ~65ch for readability
  - [ ] Headings hierarchy clear (h1 title, h2 sections)
  - [ ] Code blocks: syntax highlighted, horizontal scroll on overflow
  - [ ] Images: responsive, not stretching beyond container
  - [ ] Back link to `/blog` or breadcrumb
  - [ ] Published date and estimated read time shown
  - [ ] Mobile: no horizontal scroll, font size comfortable
- **UX dimensions**: readability, visual hierarchy, delight (sleeping rabbit), mobile usability
- **Screenshot path**: /tmp/review-blogpost.png, /tmp/review-blogpost-mobile.png

---

### Action 4 — Series Overview `/blog/series/[seriesId]`
- **Source file(s)**: `src/app/(public)/blog/series/[seriesId]/page.tsx`, `src/components/public/ChapterTree.tsx`
- **Checklist items**:
  - [ ] Series title, description, total chapters shown
  - [ ] Chapter list: ordered, each with title + short description
  - [ ] Progress indicator (if user has started)
  - [ ] "Start reading" CTA prominent
  - [ ] Rabbit sleeping (reading-focused page)
  - [ ] Mobile: chapter list readable, no cramped layout
- **UX dimensions**: clarity of purpose, hierarchy, affordances, mobile usability
- **Screenshot path**: /tmp/review-series.png, /tmp/review-series-mobile.png

---

### Action 5 — Chapter Reader `/blog/series/[seriesId]/[chapterId]/[slug]`
- **Source file(s)**: `src/app/(public)/blog/series/[seriesId]/[chapterId]/[slug]/page.tsx`, `src/components/public/LessonNav.tsx`, `src/components/public/ContentRenderer.tsx`, `src/components/public/ReadingProgressBar.tsx`
- **Checklist items**:
  - [ ] Rabbit sleeping on this page
  - [ ] Sidebar or sticky nav: previous / next chapter links
  - [ ] Chapter title + series breadcrumb at top
  - [ ] Prose content: same checks as blog post (code blocks, images, width)
  - [ ] Lessons listed within chapter (if applicable)
  - [ ] Scroll progress indicator (if implemented)
  - [ ] Mobile: sidebar collapses or becomes bottom nav
- **UX dimensions**: readability, navigation clarity, feedback (progress), mobile usability
- **Screenshot path**: /tmp/review-chapter.png, /tmp/review-chapter-mobile.png

---

### Action 6 — About `/about`
- **Source file(s)**: `src/app/(public)/about/page.tsx`
- **Checklist items**:
  - [ ] Profile image or avatar: sized correctly, not pixelated
  - [ ] Bio text readable, good line length
  - [ ] Social links / contact: icons + accessible labels
  - [ ] Rabbit is active (non-reading page)
  - [ ] Mobile: content centered and padded
- **UX dimensions**: emotional tone, readability, affordances, mobile usability
- **Screenshot path**: /tmp/review-about.png, /tmp/review-about-mobile.png

---

### Action 7 — Admin Login `/admin/login`
- **Source file(s)**: `src/app/admin/login/page.tsx`
- **Checklist items**:
  - [ ] Form centered on screen
  - [ ] Email + password fields labeled and styled
  - [ ] Submit button prominent
  - [ ] Error message shown on wrong credentials
  - [ ] No navbar/grass (admin layout is separate)
  - [ ] Mobile: form fits on small screen
- **UX dimensions**: clarity, feedback & states, accessibility, mobile usability
- **Screenshot path**: /tmp/review-login.png, /tmp/review-login-mobile.png

---

### Action 8 — Admin Dashboard `/admin`
- **Source file(s)**: `src/app/admin/page.tsx`, `src/components/admin/Sidebar.tsx`
- **Checklist items**:
  - [ ] Sidebar navigation visible and linked correctly
  - [ ] Summary cards: post count, series count, chapter count
  - [ ] Active sidebar link highlighted
  - [ ] Mobile: sidebar collapses to hamburger or drawer
- **UX dimensions**: clarity, navigation, feedback, mobile usability
- **Screenshot path**: /tmp/review-admin.png, /tmp/review-admin-mobile.png

---

### Action 9 — Posts List `/admin/posts`
- **Source file(s)**: `src/app/admin/posts/page.tsx`, `src/components/admin/PostsTable.tsx`, `src/components/admin/ConfirmDialog.tsx`
- **Checklist items**:
  - [ ] Table: title, date, status, actions (edit/delete) columns
  - [ ] "New Post" button clearly placed
  - [ ] Delete confirmation dialog
  - [ ] Empty state when no posts
  - [ ] Mobile: table scrolls horizontally or collapses to card view
- **UX dimensions**: clarity, affordances, feedback, mobile usability
- **Screenshot path**: /tmp/review-admin-posts.png, /tmp/review-admin-posts-mobile.png

---

### Action 10 — New Post `/admin/posts/new`
- **Source file(s)**: `src/app/admin/posts/new/page.tsx`, `src/components/admin/PostForm.tsx`, `src/components/admin/RichEditor.tsx`
- **Checklist items**:
  - [ ] Rich text editor renders correctly (TipTap toolbar visible)
  - [ ] Title, slug, tags, cover image fields present
  - [ ] Save / Publish button states (idle, loading, success, error)
  - [ ] Slug auto-generates from title
  - [ ] Mobile: editor usable on smaller screens
- **UX dimensions**: affordances, feedback & states, readability, mobile usability
- **Screenshot path**: /tmp/review-post-new.png, /tmp/review-post-new-mobile.png

---

### Action 11 — Edit Post `/admin/posts/[id]/edit`
- **Source file(s)**: `src/app/admin/posts/[id]/edit/page.tsx`, `src/components/admin/PostForm.tsx`
- **Checklist items**:
  - [ ] Form pre-filled with existing post data
  - [ ] Same checks as New Post page
  - [ ] "Back to posts" link works
- **UX dimensions**: affordances, feedback, clarity
- **Screenshot path**: /tmp/review-post-edit.png

---

### Action 12 — Series List `/admin/series`
- **Source file(s)**: `src/app/admin/series/page.tsx`
- **Checklist items**:
  - [ ] Table: series title, chapter count, actions
  - [ ] "New Series" button
  - [ ] Delete confirmation dialog
  - [ ] Empty state
- **UX dimensions**: clarity, affordances, feedback
- **Screenshot path**: /tmp/review-admin-series.png

---

### Action 13 — New Series `/admin/series/new`
- **Source file(s)**: `src/app/admin/series/new/page.tsx`, `src/components/admin/SeriesForm.tsx`
- **Checklist items**:
  - [ ] Title, description, cover image fields
  - [ ] Save button states
  - [ ] Slug auto-generation
- **UX dimensions**: affordances, feedback, clarity
- **Screenshot path**: /tmp/review-series-new.png

---

### Action 14 — Edit Series `/admin/series/[id]/edit`
- **Source file(s)**: `src/app/admin/series/[id]/edit/page.tsx`, `src/components/admin/SeriesForm.tsx`
- **Checklist items**:
  - [ ] Pre-filled with existing data
  - [ ] Same checks as New Series
- **UX dimensions**: affordances, feedback, clarity
- **Screenshot path**: /tmp/review-series-edit.png

---

### Action 15 — Chapters List `/admin/chapters`
- **Source file(s)**: `src/app/admin/chapters/page.tsx`
- **Checklist items**:
  - [ ] Grouped by series or flat list with series label
  - [ ] Order / drag-to-reorder (if implemented)
  - [ ] Edit link per chapter
  - [ ] Empty state
- **UX dimensions**: clarity, hierarchy, affordances
- **Screenshot path**: /tmp/review-admin-chapters.png

---

### Action 16 — Edit About `/admin/about`
- **Source file(s)**: `src/app/admin/about/page.tsx`
- **Checklist items**:
  - [ ] Editable bio and social links
  - [ ] Save button and feedback
  - [ ] Image upload field (if applicable)
- **UX dimensions**: affordances, feedback, clarity
- **Screenshot path**: /tmp/review-admin-about.png

---

### Action 17 — Shared Components (Navbar + Footer + Grass)
- **Source file(s)**: `src/components/public/Navbar.tsx`, `src/components/public/NavRabbit.tsx`, `src/components/public/NavGrass.tsx`, `src/components/public/Footer.tsx`
- **Checklist items**:
  - [ ] `life·style` logo links to `/`
  - [ ] Blog / About links work and show active state
  - [ ] Rabbit track fills space between logo and links
  - [ ] Male + female rabbits move naturally on normal pages
  - [ ] Both rabbits sleep on `/blog/[slug]` and series/chapter pages
  - [ ] Hovering navbar wakes rabbits even on reading pages
  - [ ] Mobile hamburger menu opens/closes correctly
  - [ ] Sticky on scroll — doesn't flicker
  - [ ] Footer links work
  - [ ] Consistent padding with page content
  - [ ] Mobile footer layout doesn't break
  - [ ] Grass flowers vary in size
  - [ ] Positions change on each page refresh
  - [ ] No hydration error in console
  - [ ] Does not overlap navbar content on small screens
- **UX dimensions**: delight, affordances, mobile usability, accessibility
- **Screenshot path**: /tmp/review-navbar.png, /tmp/review-navbar-mobile.png
