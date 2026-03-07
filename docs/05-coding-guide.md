# Coding Starter Guide

> Copy-paste ready starter code for each layer of the app.  
> Follow in order: Types → Data Layer → Auth → Middleware → API Routes → Pages.

---

## Step 1 — Scaffold the Project

```bash
# Run this inside /Users/peter/Desktop/Project/life-style
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Then install all dependencies:

```bash
npm install firebase next-auth@beta @tiptap/react @tiptap/pm @tiptap/starter-kit \
  lucide-react clsx tailwind-merge framer-motion next-themes bcryptjs
npm install -D @types/bcryptjs
```

---

## Step 2 — TypeScript Types (`src/types/index.ts`)

```ts
export type Series = {
  id: string
  title: string
  slug: string
  description: string
  category: 'IT' | 'ENGLISH' | 'LIFESTYLE'
  tags: string[]
  icon: string
  color: 'blue' | 'yellow' | 'green' | 'violet' | 'teal' | 'orange' | 'cyan'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  totalChapters: number
  totalLessons: number
  published: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export type Chapter = {
  id: string
  seriesId: string
  title: string
  description: string
  order: number
  totalLessons: number
}

export type Post = {
  id: string
  type: 'lesson' | 'blog'
  seriesId: string | null
  chapterId: string | null
  title: string
  slug: string
  excerpt: string
  content: string          // HTML from TipTap
  coverImage?: string
  category?: 'IT' | 'ENGLISH' | 'LIFESTYLE'
  tags?: string[]
  order: number | null
  published: boolean
  readTime: number         // minutes
  createdAt: string
  updatedAt?: string
}

export type User = {
  id: string
  email: string
  password: string         // bcrypt hash
  name: string
  role: 'admin'
  createdAt: string
}

// Useful composite type for the tutorial tree view
export type SeriesWithChapters = Series & {
  chapters: (Chapter & { lessons: Post[] })[]
}
```

---

## Step 3 — Data Layer

### `src/lib/db/mock.ts`

```ts
import seriesData   from '../../../db/series.json'
import chaptersData from '../../../db/chapters.json'
import postsData    from '../../../db/posts.json'
import usersData    from '../../../db/users.json'
import type { Series, Chapter, Post, User } from '@/types'

const series: Series[]   = seriesData   as Series[]
const chapters: Chapter[] = chaptersData as Chapter[]
const posts: Post[]       = postsData    as Post[]
const users: User[]       = usersData    as User[]

// ── Series ────────────────────────────────────────────────
export async function getSeries(): Promise<Series[]> {
  return series
}

export async function getPublishedSeries(): Promise<Series[]> {
  return series.filter(s => s.published).sort((a, b) => a.order - b.order)
}

export async function getSeriesById(id: string): Promise<Series | undefined> {
  return series.find(s => s.id === id)
}

// ── Chapters ──────────────────────────────────────────────
export async function getChaptersBySeries(seriesId: string): Promise<Chapter[]> {
  return chapters.filter(c => c.seriesId === seriesId).sort((a, b) => a.order - b.order)
}

// ── Posts / Lessons ───────────────────────────────────────
export async function getPosts(): Promise<Post[]> {
  return posts
}

export async function getPublishedPosts(): Promise<Post[]> {
  return posts.filter(p => p.published)
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return posts.find(p => p.slug === slug)
}

export async function getLessonsByChapter(chapterId: string): Promise<Post[]> {
  return posts
    .filter(p => p.chapterId === chapterId && p.type === 'lesson')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function getBlogPosts(): Promise<Post[]> {
  return posts
    .filter(p => p.type === 'blog' && p.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  return posts.filter(p => p.category === category && p.published)
}

// Full series tree — series + chapters + lessons in one call
export async function getSeriesTree(seriesId: string) {
  const s = await getSeriesById(seriesId)
  if (!s) return null
  const chs = await getChaptersBySeries(seriesId)
  const chaptersWithLessons = await Promise.all(
    chs.map(async ch => ({
      ...ch,
      lessons: await getLessonsByChapter(ch.id),
    }))
  )
  return { ...s, chapters: chaptersWithLessons }
}

// ── Auth ──────────────────────────────────────────────────
export async function getUserByEmail(email: string): Promise<User | undefined> {
  return users.find(u => u.email === email)
}
```

### `src/lib/db/index.ts`

```ts
// Change this one line to switch between mock (local) and Firebase (production)
export * from './mock'
// export * from './firebase'
```

---

## Step 4 — Utility Helpers (`src/lib/utils.ts`)

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a URL-safe slug from a title
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// e.g. "2026-03-07" → "Mar 7, 2026"
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

// Estimate read time from HTML content
export function calcReadTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
```

---

## Step 5 — Auth (`src/lib/auth.ts`)

> Uses NextAuth v5 (beta). Install: `npm install next-auth@beta`

```ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await getUserByEmail(credentials.email as string)
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
})
```

### Register the handler (`src/app/api/auth/[...nextauth]/route.ts`)

```ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

---

## Step 6 — Middleware (protect `/admin/*`)

**`src/middleware.ts`** — place in the root of `/src`

```ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage  = req.nextUrl.pathname === '/admin/login'
  const isLoggedIn   = !!req.auth

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

---

## Step 7 — API Routes

### GET + POST posts (`src/app/api/posts/route.ts`)

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPosts } from '@/lib/db'

export async function GET() {
  const posts = await getPosts()
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  // TODO: validate + write to Firebase (for now, just return the body)
  return NextResponse.json({ ...body, id: Date.now().toString() }, { status: 201 })
}
```

### PUT + DELETE post (`src/app/api/posts/[id]/route.ts`)

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // TODO: update in Firebase
  return NextResponse.json({ id: params.id, ...body })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // TODO: delete from Firebase
  return NextResponse.json({ deleted: params.id })
}
```

---

## Step 8 — Environment Variables (`.env.local`)

Create this file at the project root. **Never commit it to Git.**

```env
# ── NextAuth ──────────────────────────────────────────────
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# ── Firebase (only needed when switching from mock to Firebase) ──
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

Generate your secret:
```bash
openssl rand -base64 32
```

---

## Step 9 — Cover Image Strategy

**During development (mock data phase):**  
Use free placeholder images. Put URLs directly in `db/posts.json`:
```json
"coverImage": "https://images.unsplash.com/photo-xxxx?w=800&q=80"
```

**In production (Firebase phase):**  
Two options — pick one:

| Option | Cost | How |
|--------|------|-----|
| **Firebase Storage** | Free tier 5GB | Upload in admin dashboard, store gsutil URL |
| **Cloudinary** | Free tier 25GB | Upload via Cloudinary widget, store HTTPS URL |

Recommendation: **Cloudinary** — better image optimization, free CDN, easy unsigned upload widget.
Add to `.env.local` when ready:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

---

## Step 10 — Hash the Admin Password

Before using `db/users.json`, generate a real bcrypt hash for your password:

```bash
node -e "const b = require('bcryptjs'); b.hash('YOUR_PASSWORD', 10).then(console.log)"
```

Replace the `password` field in `db/users.json` with the output hash.

### GET + POST series (`src/app/api/series/route.ts`)

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSeries } from '@/lib/db'

export async function GET() {
  const series = await getSeries()
  return NextResponse.json(series)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // TODO: write to Firebase
  return NextResponse.json({ ...body, id: Date.now().toString() }, { status: 201 })
}
```

### GET + POST chapters (`src/app/api/chapters/route.ts`)

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getChaptersBySeries } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const seriesId = searchParams.get('seriesId')
  if (!seriesId) return NextResponse.json({ error: 'seriesId required' }, { status: 400 })
  const chapters = await getChaptersBySeries(seriesId)
  return NextResponse.json(chapters)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // TODO: write to Firebase
  return NextResponse.json({ ...body, id: Date.now().toString() }, { status: 201 })
}
```

---

## Quick Reference — What Calls What

```
Page/Component
  └── calls: getSeries() / getPosts() / getSeriesTree()
        └── src/lib/db/index.ts
              └── src/lib/db/mock.ts  (reads /db/*.json)
                  OR
              └── src/lib/db/firebase.ts  (reads Firestore)

Admin form submit
  └── calls: POST /api/posts  or  PUT /api/posts/[id]
        └── src/app/api/posts/route.ts
              └── auth() checks session
                    └── reads/writes data layer
```
