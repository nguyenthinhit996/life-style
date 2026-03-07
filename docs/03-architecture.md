# Technical Architecture

## Tech Stack Decision

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **Next.js 14+ (App Router)** | Full-stack: handles both frontend and API routes, built-in SEO tools |
| Language | **TypeScript** | Type safety, better developer experience, fewer bugs |
| Styling | **Tailwind CSS** | Fast, utility-first, easy to make bold/colorful designs |
| Database (dev) | **Mock JSON files (`db/`)** | No setup needed — instant local development and testing |
| Database (prod) | **Firebase Firestore** | NoSQL, real-time, scalable, generous free tier |
| Data Layer | **Custom service functions** | Swap mock ↔ Firebase by changing one import |
| Auth | **NextAuth.js (v5)** | Simple credentials-based login, built for Next.js |
| Rich Text Editor | **TipTap** | Modern, customizable, outputs clean HTML |
| Icons | **Lucide React** | Clean, consistent icon library |
| Animations | **Framer Motion** | Smooth, production-quality animations |
| Theming | **next-themes** | Dark/light mode toggle |
| Deployment | **Vercel** | Best-in-class Next.js hosting, free tier available |

---

## Folder Structure

```
life-style/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Public route group
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── about/
│   │   │   │   └── page.tsx          # About / Personal brand page
│   │   │   └── blog/
│   │   │       ├── page.tsx          # Blog listing page (filter + series cards + posts)
│   │   │       ├── [slug]/
│   │   │       │   └── page.tsx      # Standalone blog post
│   │   │       └── series/
│   │   │           └── [seriesId]/
│   │   │               ├── page.tsx  # Series overview (chapter tree + CTA)
│   │   │               └── [chapterId]/
│   │   │                   └── [slug]/
│   │   │                       └── page.tsx  # Lesson reader
│   │   ├── admin/                    # Admin dashboard (protected)
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Admin login
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx          # All posts list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # Create new post/lesson
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx  # Edit existing post
│   │   │   ├── series/
│   │   │   │   ├── page.tsx          # All series list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # Create new series
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx  # Edit series
│   │   │   ├── chapters/
│   │   │   │   └── page.tsx          # Manage chapters (filter by series)
│   │   │   ├── about/
│   │   │   │   └── page.tsx          # Edit About page content
│   │   │   └── layout.tsx            # Admin layout (sidebar + header)
│   │   ├── api/                      # API Route Handlers
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/    # NextAuth handler
│   │   │   ├── posts/
│   │   │   │   ├── route.ts          # GET all, POST create
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # PUT update, DELETE remove
│   │   │   ├── series/
│   │   │   │   ├── route.ts          # GET all series, POST create
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # PUT update, DELETE remove
│   │   │   └── chapters/
│   │   │       ├── route.ts          # GET all chapters, POST create
│   │   │       └── [id]/
│   │   │           └── route.ts      # PUT update, DELETE remove
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx             # 404 page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── ui/                       # Generic reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   ├── public/                   # Public-facing components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── PostCard.tsx
│   │   │   └── CategoryFilter.tsx
│   │   └── admin/                    # Admin dashboard components
│   │       ├── Sidebar.tsx
│   │       ├── PostForm.tsx
│   │       └── PostsTable.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts              # Toggle: mock vs Firebase — change here only
│   │   │   ├── mock.ts               # Reads from /db/*.json (local dev)
│   │   │   └── firebase.ts           # Firebase Firestore client (production)
│   │   ├── auth.ts                   # NextAuth config
│   │   └── utils.ts                  # Utility functions (slugify, cn, etc.)
│   └── types/
│       └── index.ts                  # Shared TypeScript types
├── db/                               # Mock data (local dev & testing)
│   ├── users.json                    # Admin user(s)
│   ├── series.json                   # Tutorial series (Java, JS, Python, AI, English…)
│   ├── chapters.json                 # Chapters within each series
│   └── posts.json                    # Individual posts / blog articles
├── public/
│   ├── images/                       # Static images
│   └── og-image.png                  # Open Graph default image
├── docs/                             # Project documentation
├── .env.local                        # Local environment variables
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
└── tsconfig.json                     # TypeScript config
```

---

## Data Flow

```
[DEV]  Visitor → Public Pages → Data Layer → mock.ts → /db/*.json
[PROD] Visitor → Public Pages → Data Layer → firebase.ts → Firestore

Admin → Login Page → NextAuth verifies credentials
Admin → Dashboard → API Routes → Data Layer (auto selects mock or Firebase)
```

### Data Layer Swap Strategy

```ts
// src/lib/db/index.ts  — change one line to switch environments
export * from './mock'       // ← DEV: reads JSON files
// export * from './firebase' // ← PROD: reads Firestore
```

Every page/component calls the same functions (`getPosts()`, `getSeriesTree()`, etc.).
You never need to touch the UI code when switching environments.

---

## Environment Variables

```env
# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Firebase (only needed in production / when switching from mock)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

---

## Data Model (TypeScript Types)

```ts
// Every series — Java, JS, Python, AI, English for Devs, etc.
type Series = {
  id: string
  title: string
  slug: string
  description: string
  category: 'IT' | 'ENGLISH' | 'LIFESTYLE'
  tags: string[]          // e.g. ["Java","OOP","Backend"] or ["JavaScript","Frontend"]
  icon: string            // emoji icon e.g. "☕" "⚡" "🐍" "🤖"
  color: 'blue' | 'yellow' | 'green' | 'violet' | 'teal' | 'orange' | 'cyan'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  totalChapters: number
  totalLessons: number
  published: boolean
  order: number
  createdAt: string
  updatedAt: string
}

type Chapter = {
  id: string
  seriesId: string        // foreign key → Series.id
  title: string
  description: string
  order: number
  totalLessons: number
}

type Post = {
  id: string
  type: 'lesson' | 'blog'
  seriesId: string | null // null for standalone blog posts
  chapterId: string | null
  title: string
  slug: string
  excerpt: string
  content: string         // rich text HTML from TipTap
  category?: 'IT' | 'ENGLISH' | 'LIFESTYLE'   // for blog posts
  tags?: string[]                               // for blog posts
  order: number | null
  published: boolean
  readTime: number        // minutes
  createdAt: string
}

type User = {
  id: string
  email: string
  password: string        // bcrypt hash
  name: string
  role: 'admin'
  createdAt: string
}
```

### Currently supported `tags` values

| Tag | Category | Color |
|-----|----------|-------|
| `Java` | IT | Blue |
| `JavaScript` | IT | Yellow/Amber |
| `Python` | IT | Emerald |
| `AI` | IT | Violet |
| `Machine Learning` | IT | Violet |
| `Web` | IT | Blue |
| `Frontend` | IT | Yellow |
| `Backend` | IT | Blue |
| `Writing` | ENGLISH | Teal |
| `Grammar` | ENGLISH | Teal |
| `English` | ENGLISH | Teal |
| `Tech Writing` | ENGLISH | Cyan |

> Adding a new language/topic = add a new entry in `db/series.json` + `db/chapters.json`. No code changes needed.

---

## Route Map

| Route | Type | Access |
|-------|------|--------|
| `/` | Public | Everyone |
| `/about` | Public | Everyone |
| `/blog` | Public | Everyone — listing, filter, series cards |
| `/blog/[slug]` | Public | Everyone — standalone blog post |
| `/blog/series/[seriesId]` | Public | Everyone — series overview + chapter tree |
| `/blog/series/[seriesId]/[chapterId]/[slug]` | Public | Everyone — lesson reader |
| `/admin/login` | Auth | Everyone (redirect if logged in) |
| `/admin` | Private | Admin only — dashboard home |
| `/admin/posts` | Private | Admin only — all posts list |
| `/admin/posts/new` | Private | Admin only — create post/lesson |
| `/admin/posts/[id]/edit` | Private | Admin only — edit post/lesson |
| `/admin/series` | Private | Admin only — manage series list |
| `/admin/series/new` | Private | Admin only — create new series |
| `/admin/series/[id]/edit` | Private | Admin only — edit series |
| `/admin/chapters` | Private | Admin only — manage chapters per series |
| `/admin/about` | Private | Admin only — edit About page content |
| `/api/posts` | API | Admin only |
| `/api/series` | API | Admin only |
| `/api/chapters` | API | Admin only |

---

## Key Decisions

### Why not a headless CMS?
Building a custom dashboard gives full control — no vendor lock-in, no monthly fees, and complete ownership of the data and UI.

### Why Firebase Firestore?
Firestore is a NoSQL document database — data is stored as flexible JSON-like documents. It has a generous free tier (Spark plan), works perfectly with Next.js on Vercel, and handles real-time updates easily. There are no schemas to migrate, which is ideal for a content-heavy blog with evolving data shapes.

### Why mock data first?
Starting with JSON files in a `db/` folder means zero setup — no account, no internet, no config. You can build and test the entire app locally before touching any online service. When ready, switch one import line and the whole app goes live on Firebase.

### Why TipTap?
It is the most developer-friendly rich text editor for React. It outputs clean HTML, is fully extensible, and looks great out of the box.
