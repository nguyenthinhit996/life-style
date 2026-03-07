# Pages & Design Guide

## Design Direction

**Bold & Colorful** — The site should feel energetic, confident, and modern.
Think vibrant accent colors, strong typography, and a dark-themed base with pops of color.

---

## Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background (dark) | Deep navy / dark slate | `#0F172A` |
| Surface / Card | Slightly lighter dark | `#1E293B` |
| Primary Accent | Electric violet / purple | `#7C3AED` |
| Secondary Accent | Cyan / teal | `#06B6D4` |
| IT / General | Blue | `#3B82F6` |
| Java tag | Blue | `#3B82F6` |
| JavaScript tag | Yellow / Amber | `#F59E0B` |
| Python tag | Emerald green | `#10B981` |
| AI / ML tag | Violet | `#7C3AED` |
| English category | Teal | `#14B8A6` |
| Lifestyle category | Orange | `#F97316` |
| Text (primary) | White | `#F8FAFC` |
| Text (muted) | Light gray | `#94A3B8` |

---

## Typography

| Usage | Font | Weight |
|-------|------|--------|
| Display / Hero | **Space Grotesk** or **Syne** | 700–800 |
| Headings | **Space Grotesk** | 600–700 |
| Body text | **Inter** | 400–500 |
| Code blocks | **JetBrains Mono** | 400 |

---

## Pages Breakdown

### 1. Home Page (`/`)

**Purpose:** Make a strong first impression and invite visitors to explore.

**Navbar (shared across all public pages):**
- Logo (gradient text, left-aligned)
- Nav links: `Blog` | `Tutorials` | `About`
  - `Tutorials` links to `/blog` pre-filtered to show tutorial series only
- Right side: dark/light mode toggle button

**Sections:**
1. **Hero Section**
   - Full-width, dark background with bold text
   - **Eyebrow pill** above the title: pulsing dot + text _"Code & Language · Personal Brand & Blog"_ — styled as a small rounded badge with violet border
   - Large headline: e.g., _"Hi, I'm Peter. I write about Code & Language."_ — gradient on "Code & Language" word
   - Sub-tagline: _"Tutorials on Java, JavaScript, Python, AI — and the English to communicate it all."_
   - Two CTA buttons: "Read My Blog →" (primary violet) + "About Me" (ghost/outline)
   - Subtle animated radial gradient background + dot-grid pattern overlay

2. **Featured Posts Section**
   - Section title: "Latest Articles"
   - 3 large post cards in a grid layout
   - Each card: cover image, colored category badge, title, excerpt, date

3. **Categories Section**
   - 3 large colorful cards: IT (blue), English (teal), Lifestyle (orange)
   - Under IT card: small tech tags row showing Java · JS · Python · AI
   - Each card has an icon, name, short description, and post count
   - Clicking navigates to `/blog?category=IT` etc.

4. **About Teaser Section**
   - Small photo of Peter
   - Short 2–3 line bio
   - "Learn More About Me →" link

---

### 2. About Page (`/about`)

**Purpose:** Showcase Peter's personal brand, story, and skills.

**Sections:**
1. **Profile Banner**
   - Large photo or avatar
   - Name + title (e.g., "Developer & English Enthusiast")
   - Social links: GitHub, LinkedIn, Twitter/X

2. **My Story**
   - 3–5 paragraph personal bio
   - What drives Peter, his background, and his mission

3. **Skills & Tools**
   - Grid of skill badges (e.g., React, Next.js, TypeScript, English C1, etc.)
   - Each badge: icon + name + level bar or tag

4. **What I Write About**
   - Two columns: **Tech / IT** and **English**
   - Tech side shows tags: Java · JavaScript · Python · AI
   - English side shows tags: Writing · Grammar · Tech English
   - Short description of each content pillar

5. **Contact / Connect**
   - Email link or contact form
   - Social media buttons

---

### 3. Blog Listing Page (`/blog`)

**Purpose:** Let visitors browse and discover all articles.

**Layout:**
- Top: Page title + subtitle
- **Level 1 filter** (broad category) — pill tabs: `All` | `IT` | `English` | `Lifestyle`
- **Level 2 filter** (technology tag, visible when IT is selected) — pill tags: `All Tech` | `Java` | `JavaScript` | `Python` | `AI` | `Web`
- Search bar input
- **Tutorial Series** section — large series cards with icon, tag, chapters/lessons count
- **Blog Posts** section — standard post grid: 3 columns desktop, 2 tablet, 1 mobile

**Post Card Design:**
- Cover image (16:9 ratio)
- Colored category badge top-left on image
- Title (bold, 2 lines max)
- Excerpt (2–3 lines, muted color)
- Date + estimated read time
- Hover effect: card lifts with a colored border glow

---

### 4. Series Detail Page (`/blog/series/[seriesId]`)

**Purpose:** Give the learner a full overview of a tutorial series and let them jump to any lesson.

**Layout:**
- **Series Banner (hero strip)**
  - Large icon (emoji) + series title + level badge (Beginner / Intermediate / Advanced)
  - Short description paragraph
  - Tag pills: e.g., ☕ Java · OOP · Backend
  - Stats row: `X Chapters · Y Lessons · ~Z hrs`
  - CTA button: "Start Learning →" (links to first unpublished/first lesson)
- **Chapter / Lesson Accordion Tree**
  - Each chapter row: number, title, lesson count — click to expand
  - Inside each chapter: lesson rows with title, lesson number, read-time, Published/Coming Soon badge
  - Clicking a published lesson navigates to the lesson reader
- **Sidebar (optional, desktop only):** sticky progress overview card

---

### 5. Lesson Reader Page (`/blog/series/[seriesId]/[chapterId]/[slug]`)

**Purpose:** Comfortable, distraction-free reading experience for a single tutorial lesson.

**Layout:**
- **Left sidebar (desktop):** collapsible chapter/lesson tree for the full series
  - Highlight the current lesson
  - Chapter headers are collapsible
- **Main content area:**
  - Breadcrumb: `Series Name → Chapter Title → Lesson Title`
  - Lesson title (large, Space Grotesk)
  - Meta row: Chapter number · Lesson number · Read time · Category tag
  - **Lesson body** — TipTap-rendered rich text:
    - Styled h2/h3 headings with accent left-border
    - Code blocks with syntax highlighting (colored by language)
    - Inline code in monospace with subtle background
    - Blockquotes in italic with left colored border
    - Ordered / unordered lists with custom bullets
  - **Bottom navigation bar:**
    - `← Previous: Lesson Title`
    - `→ Next: Lesson Title`
    - Series progress bar (e.g., "Lesson 3 of 24")
- **No sidebar on mobile** — lesson tree collapses to a top drawer/button

---

### 6. Blog Post Page (`/blog/[slug]`)

**Purpose:** Display a single article in a comfortable reading experience.

**Layout:**
- Cover image (full width)
- Category badge + date
- Large title
- Author chip (Peter's name + small avatar)
- Estimated reading time
- **Article body** — rendered rich text with styled:
  - Headings (h2, h3)
  - Paragraphs
  - Bullet and numbered lists
  - Code blocks (with syntax highlighting)
  - Blockquotes
  - Images (centered, with captions)
- **Share bar** (bottom): Copy link, Twitter/X, Facebook
- **Related Posts** (bottom): 3 post cards from the same category

---

### 7. Admin Login Page (`/admin/login`)

**Purpose:** Secure entry point for the admin dashboard.

**Layout:**
- Centered card on a dark background
- Site logo / name at the top
- Email input
- Password input
- "Sign In" button
- Error message display on failed login
- No public registration — login only

---

### 8. Admin Dashboard (`/admin/posts`)

**Purpose:** Private area to manage all blog content.

**Layout:**
- **Left Sidebar:**
  - Logo / site name
  - Navigation links: Dashboard, Posts, New Post, Settings
  - User info + Logout button at the bottom
- **Main area:**
  - Posts table: Title | Category | Status | Date | Actions
  - Status badge: Published (green) / Draft (gray)
  - Action buttons: Edit (pencil) | Delete (trash)

---

### 9. New / Edit Post Page (`/admin/posts/new`)

**Purpose:** Rich editor to write and publish blog posts or tutorial lessons.

**Layout:**
- Title input (large, full-width)
- Slug input (auto-generated, editable)
- **Type toggle:** Blog Post ― Lesson
  - If Lesson selected: Series dropdown → Chapter dropdown (loads based on series)
- Category dropdown
- Excerpt textarea
- Cover image URL input (or file upload)
- **TipTap editor** with toolbar:
  - Bold, Italic, Underline
  - H2, H3 headings
  - Bullet list, Numbered list
  - Blockquote
  - Code block
  - Link
  - Image insert
- "Save as Draft" button
- "Publish" button

---

### 10. Admin Series Pages (`/admin/series`)

**List page:**
- Table: icon + title | category | tags | level | chapters | status | actions
- "+ New Series" button top-right

**New / Edit form:**
- Title, slug (auto), description
- Category dropdown (IT / English / Lifestyle)
- Tags input (multi-tag chip input)
- Icon input (emoji text field)
- Color selector (blue / yellow / green / violet / teal / cyan / orange)
- Level dropdown
- Published toggle

---

### 11. Admin Chapters Page (`/admin/chapters`)

- Series dropdown at top to filter chapters
- Table: order number | chapter title | lesson count | actions
- Inline reorder (drag or up/down buttons)
- "+ Add Chapter" button

---

### 12. Admin About Page Editor (`/admin/about`)

- Bio text area (rich text or plain)
- Skills list (add/remove skill chips: name + level)
- Social links (GitHub, LinkedIn, Twitter/X URL inputs)
- "Save Changes" button

---

## Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| `sm` (640px+) | Large phones |
| `md` (768px+) | Tablets |
| `lg` (1024px+) | Laptops |
| `xl` (1280px+) | Desktops |

---

## Component Checklist

**Public Components:**
- [ ] `Navbar` — logo + navigation links + theme toggle
- [ ] `Footer` — links + copyright
- [ ] `HeroSection` — bold headline + CTA buttons
- [ ] `PostCard` — blog card with image, badge, title, excerpt
- [ ] `SeriesCard` — large series card with icon, tags, chapter/lesson count, locked state
- [ ] `CategoryFilter` — two-level pill tab filter (Level 1: All/IT/English; Level 2: Java/JS/Python/AI)
- [ ] `CategoryCard` — large colorful card for IT / English / Lifestyle
- [ ] `ChapterTree` — collapsible chapter/lesson accordion used on series detail + lesson sidebar
- [ ] `LessonNav` — bottom prev/next navigation bar with progress bar
- [ ] `ShareButtons` — copy link + social share

**Admin Components:**
- [ ] `Sidebar` — admin navigation (All Posts, New Post, Series, Chapters, About Page, Settings)
- [ ] `PostsTable` — list of all posts/lessons with type indicator and actions
- [ ] `PostForm` — title, slug, type selector, series/chapter selectors, TipTap editor, publish controls
- [ ] `SeriesTable` — list of all series with icon, tags, status, chapter count
- [ ] `SeriesForm` — title, slug, description, category, tags, icon, color, level, published
- [ ] `ChaptersTable` — chapters for a selected series with order and lesson count
- [ ] `AboutEditor` — edit bio, skills, and social links as structured form fields
- [ ] `ConfirmDialog` — confirmation before deleting

**UI Primitives:**
- [ ] `Button` — primary, secondary, ghost, danger variants
- [ ] `Badge` — category color badges
- [ ] `Input` — styled text input
- [ ] `Card` — base card container
- [ ] `ThemeToggle` — dark/light mode switcher
