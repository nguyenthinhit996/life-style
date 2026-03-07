# Phase 3 — Admin Dashboard

> **Goal:** A fully working private dashboard where Peter can view all posts/series/chapters, create and edit content with the TipTap rich-text editor, and manage the About page — all protected by Phase 2 auth.  
> **Prerequisite:** Phase 2 ✅ complete — login, middleware, and session all work.

---

## Brainstorm — What Needs to Happen

1. **Admin shell layout** — every `/admin/*` page (except `/admin/login`) shares a persistent sidebar + main content area. The sidebar shows nav links, current user, and a logout button.
2. **Posts list** — a server-rendered table of all posts pulled from `getPosts()`, with status badges and Edit/Delete action buttons.
3. **Post API routes** — REST endpoints at `/api/posts` (GET + POST) and `/api/posts/[id]` (PUT + DELETE). In mock-data phase, mutations just return JSON stubs — real writes come in Phase 7.
4. **New + Edit post form** — a shared `PostForm` client component with: title → auto-slug, type toggle (blog/lesson), conditional series + chapter dropdowns, category, excerpt, cover URL, TipTap editor, published toggle, and Save/Publish buttons.
5. **TipTap rich-text editor** — a `RichEditor` component with a toolbar (Bold, Italic, H2, H3, BulletList, OrderedList, Blockquote, Code, CodeBlock). Outputs HTML stored in form state.
6. **Series management** — list, create, edit series via `SeriesForm` and `/api/series` routes.
7. **Chapters management** — filter by series, list chapters, add/edit inline via `/api/chapters` routes.
8. **About page editor** — form reads `db/about.json` and POSTs to `/api/about` on save.
9. **UI primitives** — reusable `Badge` and `ConfirmDialog` components used across the admin.

---

## Checklist

### ☐ Step 3.1 — Admin shell layout + Sidebar

**`src/app/admin/layout.tsx`** — server component, wraps all `/admin/*` pages (login excluded via its own route group if needed, but middleware already handles auth):

```tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
```

> **Why re-check session in layout?** Middleware redirects unauthenticated visitors, but the layout check is a server-side safety net that also gives us `session.user` to pass to the Sidebar.

---

**`src/components/admin/Sidebar.tsx`** — client component (needs `usePathname` for active link):

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, FileText, FilePlus, BookOpen,
  Layers, User, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin',          label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/posts',    label: 'All Posts',   icon: FileText },
  { href: '/admin/posts/new',label: 'New Post',    icon: FilePlus },
  { href: '/admin/series',   label: 'Series',      icon: BookOpen },
  { href: '/admin/chapters', label: 'Chapters',    icon: Layers },
  { href: '/admin/about',    label: 'About Page',  icon: User },
]

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col justify-between border-r border-white/10 bg-[#0F172A] px-4 py-6">
      {/* Logo */}
      <div>
        <div className="mb-8 px-2 text-xl font-bold text-white">
          Life‑Style <span className="text-violet-400">Admin</span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                  active
                    ? 'border-l-2 border-violet-500 bg-violet-500/10 text-violet-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User + logout */}
      <div className="border-t border-white/10 pt-4">
        <div className="mb-3 px-2">
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <span className="mt-1 inline-block rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
            Admin
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
```

---

### ☐ Step 3.2 — Posts list page + PostsTable component

**`src/app/admin/posts/page.tsx`** — server component:

```tsx
import { getPosts } from '@/lib/db'
import PostsTable from '@/components/admin/PostsTable'
import Link from 'next/link'

export default async function AdminPostsPage() {
  const posts = await getPosts()
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-700"
        >
          + New Post
        </Link>
      </div>
      <PostsTable posts={posts} />
    </div>
  )
}
```

---

**`src/components/admin/PostsTable.tsx`** — client component (needs delete confirmation):

```tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { Post } from '@/types'
import Badge from '@/components/admin/Badge'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function PostsTable({ posts }: { posts: Post[] }) {
  const [confirmId, setConfirmId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    setConfirmId(null)
    // In mock phase: page will still show the item until refresh
    // In Firebase phase: use router.refresh() or React Query invalidation
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-white">{post.title}</td>
                <td className="px-4 py-3">
                  <Badge variant={post.type === 'lesson' ? 'cyan' : 'violet'}>
                    {post.type}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-400">{post.category ?? '—'}</td>
                <td className="px-4 py-3">
                  <Badge variant={post.published ? 'green' : 'amber'}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="flex gap-2 px-4 py-3">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmId(post.id)}
                    className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirmId}
        message="Delete this post? This cannot be undone."
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </>
  )
}
```

---

### ☐ Step 3.3 — UI primitives: Badge + ConfirmDialog

**`src/components/admin/Badge.tsx`**:

```tsx
import { cn } from '@/lib/utils'

const variants = {
  green:  'bg-emerald-500/15 text-emerald-400',
  amber:  'bg-amber-500/15  text-amber-400',
  violet: 'bg-violet-500/15 text-violet-400',
  cyan:   'bg-cyan-500/15   text-cyan-400',
  blue:   'bg-blue-500/15   text-blue-400',
}

type Variant = keyof typeof variants

export default function Badge({
  children,
  variant = 'violet',
}: {
  children: React.ReactNode
  variant?: Variant
}) {
  return (
    <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize', variants[variant])}>
      {children}
    </span>
  )
}
```

---

**`src/components/admin/ConfirmDialog.tsx`**:

```tsx
'use client'

export default function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1E293B] p-6 shadow-xl">
        <p className="mb-6 text-sm text-slate-300">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

### ☐ Step 3.4 — Post API routes

**`src/app/api/posts/route.ts`** — GET all + POST new:

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
  // TODO Phase 7: write to Firestore
  return NextResponse.json({ ...body, id: Date.now().toString() }, { status: 201 })
}
```

**`src/app/api/posts/[id]/route.ts`** — PUT update + DELETE:

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  // TODO Phase 7: update in Firestore
  return NextResponse.json({ id, ...body })
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  // TODO Phase 7: delete from Firestore
  return NextResponse.json({ deleted: id })
}
```

> **Note on Next.js 15+ dynamic params:** `params` is now a Promise and must be `await`-ed.

---

### ☐ Step 3.5 — TipTap RichEditor component

**`src/components/admin/RichEditor.tsx`** — client component:

```tsx
'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

const toolbarBtn = 'rounded px-2 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30'

export default function RichEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (html: string) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'min-h-[320px] outline-none prose prose-invert max-w-none p-4',
      },
    },
  })

  // Sync external value changes (e.g. when editing an existing post)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-white/10 bg-white/[0.03] p-2">
        <button type="button" className={cn(toolbarBtn, editor.isActive('bold') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" className={cn(toolbarBtn, editor.isActive('italic') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
        <button type="button" className={cn(toolbarBtn, editor.isActive('heading', { level: 2 }) && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={cn(toolbarBtn, editor.isActive('heading', { level: 3 }) && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <span className="mx-1 text-white/20">|</span>
        <button type="button" className={cn(toolbarBtn, editor.isActive('bulletList') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className={cn(toolbarBtn, editor.isActive('orderedList') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" className={cn(toolbarBtn, editor.isActive('blockquote') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>" Quote</button>
        <span className="mx-1 text-white/20">|</span>
        <button type="button" className={cn(toolbarBtn, editor.isActive('code') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleCode().run()}>`code`</button>
        <button type="button" className={cn(toolbarBtn, editor.isActive('codeBlock') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}>```block</button>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
```

---

### ☐ Step 3.6 — PostForm component (shared by New + Edit pages)

**`src/components/admin/PostForm.tsx`** — client component:

```tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Post, Series, Chapter } from '@/types'
import RichEditor from '@/components/admin/RichEditor'
import { slugify } from '@/lib/utils'

type PostFormProps = {
  initialData?: Partial<Post>
  allSeries: Series[]
}

export default function PostForm({ initialData = {}, allSeries }: PostFormProps) {
  const router = useRouter()
  const isEdit = !!initialData.id

  const [title, setTitle]         = useState(initialData.title ?? '')
  const [slug, setSlug]           = useState(initialData.slug ?? '')
  const [type, setType]           = useState<'blog' | 'lesson'>(initialData.type ?? 'blog')
  const [seriesId, setSeriesId]   = useState(initialData.seriesId ?? '')
  const [chapterId, setChapterId] = useState(initialData.chapterId ?? '')
  const [chapters, setChapters]   = useState<Chapter[]>([])
  const [category, setCategory]   = useState(initialData.category ?? '')
  const [excerpt, setExcerpt]     = useState(initialData.excerpt ?? '')
  const [coverImage, setCoverImage] = useState(initialData.coverImage ?? '')
  const [content, setContent]     = useState(initialData.content ?? '')
  const [published, setPublished] = useState(initialData.published ?? false)
  const [saving, setSaving]       = useState(false)

  // Auto-generate slug from title (only when creating new post)
  useEffect(() => {
    if (!isEdit) setSlug(slugify(title))
  }, [title, isEdit])

  // Load chapters when series changes
  useEffect(() => {
    if (!seriesId) { setChapters([]); return }
    fetch(`/api/chapters?seriesId=${seriesId}`)
      .then(r => r.json())
      .then(setChapters)
  }, [seriesId])

  async function handleSave(publish: boolean) {
    setSaving(true)
    const payload = {
      title, slug, type,
      seriesId: type === 'lesson' ? seriesId : null,
      chapterId: type === 'lesson' ? chapterId : null,
      category, excerpt, coverImage, content,
      published: publish,
      readTime: Math.max(1, Math.ceil(content.replace(/<[^>]+>/g, '').split(/\s+/).length / 200)),
      createdAt: initialData.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const url    = isEdit ? `/api/posts/${initialData.id}` : '/api/posts'
    const method = isEdit ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    router.push('/admin/posts')
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-lg font-bold text-white outline-none focus:border-violet-500" />
      </div>

      {/* Slug */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Slug</label>
        <input value={slug} onChange={e => setSlug(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-slate-300 outline-none focus:border-violet-500" />
      </div>

      {/* Type toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-slate-400">Type</label>
        <div className="flex gap-2">
          {(['blog', 'lesson'] as const).map(t => (
            <button key={t} type="button" onClick={() => setType(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${type === t ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
              {t === 'blog' ? 'Blog Post' : 'Lesson'}
            </button>
          ))}
        </div>
      </div>

      {/* Series + Chapter (only for lessons) */}
      {type === 'lesson' && (
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm text-slate-400">Series</label>
            <select value={seriesId} onChange={e => { setSeriesId(e.target.value); setChapterId('') }}
              className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-white outline-none focus:border-violet-500">
              <option value="">— Select series —</option>
              {allSeries.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm text-slate-400">Chapter</label>
            <select value={chapterId} onChange={e => setChapterId(e.target.value)}
              disabled={!chapters.length}
              className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-white outline-none focus:border-violet-500 disabled:opacity-40">
              <option value="">— Select chapter —</option>
              {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-white outline-none focus:border-violet-500">
          <option value="">— Select category —</option>
          <option value="IT">IT</option>
          <option value="ENGLISH">English</option>
          <option value="LIFESTYLE">Lifestyle</option>
        </select>
      </div>

      {/* Excerpt */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Excerpt</label>
        <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 outline-none focus:border-violet-500 resize-none" />
      </div>

      {/* Cover image */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Cover Image URL</label>
        <input value={coverImage} onChange={e => setCoverImage(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 outline-none focus:border-violet-500" />
      </div>

      {/* TipTap editor */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Content</label>
        <RichEditor value={content} onChange={setContent} />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setPublished(p => !p)}
          className={`relative h-6 w-11 rounded-full transition ${published ? 'bg-violet-600' : 'bg-white/10'}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${published ? 'left-[22px]' : 'left-0.5'}`} />
        </button>
        <span className="text-sm text-slate-400">{published ? 'Published' : 'Draft'}</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button onClick={() => handleSave(false)} disabled={saving}
          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 disabled:opacity-50">
          Save Draft
        </button>
        <button onClick={() => handleSave(true)} disabled={saving}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
```

---

### ☐ Step 3.7 — New post + Edit post pages

**`src/app/admin/posts/new/page.tsx`** — server component:

```tsx
import { getSeries } from '@/lib/db'
import PostForm from '@/components/admin/PostForm'

export default async function NewPostPage() {
  const allSeries = await getSeries()
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">New Post</h1>
      <PostForm allSeries={allSeries} />
    </div>
  )
}
```

**`src/app/admin/posts/[id]/edit/page.tsx`** — server component:

```tsx
import { getPosts, getSeries } from '@/lib/db'
import PostForm from '@/components/admin/PostForm'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [allPosts, allSeries] = await Promise.all([getPosts(), getSeries()])
  const post = allPosts.find(p => p.id === id)
  if (!post) notFound()

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Edit Post</h1>
      <PostForm initialData={post} allSeries={allSeries} />
    </div>
  )
}
```

---

### ☐ Step 3.8 — Series pages + SeriesForm + API routes

**`src/app/admin/series/page.tsx`** — server component:

```tsx
import { getSeries } from '@/lib/db'
import Link from 'next/link'
import Badge from '@/components/admin/Badge'

export default async function AdminSeriesPage() {
  const series = await getSeries()
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Series</h1>
        <Link href="/admin/series/new"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-700">
          + New Series
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Icon + Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Chapters</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {series.map(s => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-white">{s.icon} {s.title}</td>
                <td className="px-4 py-3 text-slate-400">{s.category}</td>
                <td className="px-4 py-3 text-slate-400">{s.level}</td>
                <td className="px-4 py-3 text-slate-400">{s.totalChapters}</td>
                <td className="px-4 py-3">
                  <Badge variant={s.published ? 'green' : 'amber'}>
                    {s.published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/series/${s.id}/edit`}
                    className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

**`src/app/api/series/route.ts`**:

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
  // TODO Phase 7: write to Firestore
  return NextResponse.json({ ...body, id: Date.now().toString() }, { status: 201 })
}
```

**`src/app/api/series/[id]/route.ts`**:

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  return NextResponse.json({ id, ...body })
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  return NextResponse.json({ deleted: id })
}
```

**`src/components/admin/SeriesForm.tsx`** — client component with all fields from `docs/04-pages-design.md` Page 10:

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Series } from '@/types'
import { slugify } from '@/lib/utils'

const COLORS = ['blue','yellow','green','violet','teal','cyan','orange'] as const
const LEVELS = ['Beginner','Intermediate','Advanced'] as const

export default function SeriesForm({ initialData = {} }: { initialData?: Partial<Series> }) {
  const router = useRouter()
  const isEdit = !!initialData.id

  const [title, setTitle]           = useState(initialData.title ?? '')
  const [slug, setSlug]             = useState(initialData.slug ?? '')
  const [description, setDesc]      = useState(initialData.description ?? '')
  const [category, setCategory]     = useState(initialData.category ?? 'IT')
  const [tags, setTags]             = useState<string[]>(initialData.tags ?? [])
  const [tagInput, setTagInput]     = useState('')
  const [icon, setIcon]             = useState(initialData.icon ?? '')
  const [color, setColor]           = useState(initialData.color ?? 'violet')
  const [level, setLevel]           = useState(initialData.level ?? 'Beginner')
  const [published, setPublished]   = useState(initialData.published ?? false)
  const [saving, setSaving]         = useState(false)

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  async function handleSave() {
    setSaving(true)
    const payload = { title, slug: slug || slugify(title), description, category, tags, icon, color, level, published }
    const url    = isEdit ? `/api/series/${initialData.id}` : '/api/series'
    const method = isEdit ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    router.push('/admin/series')
  }

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <Field label="Title">
        <input value={title} onChange={e => { setTitle(e.target.value); if (!isEdit) setSlug(slugify(e.target.value)) }}
          className="input-style" />
      </Field>
      <Field label="Slug">
        <input value={slug} onChange={e => setSlug(e.target.value)} className="input-style font-mono text-sm" />
      </Field>
      <Field label="Description">
        <textarea value={description} onChange={e => setDesc(e.target.value)} rows={3} className="input-style resize-none" />
      </Field>
      <Field label="Category">
        <select value={category} onChange={e => setCategory(e.target.value as any)} className="select-style">
          <option value="IT">IT</option>
          <option value="ENGLISH">English</option>
          <option value="LIFESTYLE">Lifestyle</option>
        </select>
      </Field>
      <Field label="Tags">
        <div className="flex gap-2">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Press Enter to add" className="input-style flex-1" />
          <button type="button" onClick={addTag}
            className="rounded-lg bg-white/10 px-3 text-sm text-slate-300 hover:bg-white/20">Add</button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 rounded-full bg-violet-500/15 px-3 py-0.5 text-xs text-violet-300">
              {tag}
              <button onClick={() => setTags(t => t.filter(x => x !== tag))} className="text-violet-400 hover:text-white">×</button>
            </span>
          ))}
        </div>
      </Field>
      <Field label="Icon (emoji)">
        <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="☕" className="input-style w-24" />
      </Field>
      <Field label="Color">
        <div className="flex gap-2">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-full ring-2 transition ${color === c ? 'ring-white scale-110' : 'ring-transparent'}`}
              style={{ backgroundColor: { blue:'#3B82F6', yellow:'#EAB308', green:'#22C55E', violet:'#7C3AED', teal:'#14B8A6', cyan:'#06B6D4', orange:'#F97316' }[c] }}
            />
          ))}
        </div>
      </Field>
      <Field label="Level">
        <select value={level} onChange={e => setLevel(e.target.value as any)} className="select-style">
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </Field>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setPublished(p => !p)}
          className={`relative h-6 w-11 rounded-full transition ${published ? 'bg-violet-600' : 'bg-white/10'}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${published ? 'left-[22px]' : 'left-0.5'}`} />
        </button>
        <span className="text-sm text-slate-400">{published ? 'Published' : 'Draft'}</span>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => router.back()}
          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-slate-300 hover:bg-white/5">Cancel</button>
        <button onClick={handleSave} disabled={saving}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Series'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-slate-400">{label}</label>
      {children}
    </div>
  )
}
```

> **Note:** `input-style` and `select-style` are Tailwind utility classes we define in `globals.css` under `@layer components {}` to avoid repeating the same border/bg/padding on every input. Add these to `src/app/globals.css`:
> ```css
> @layer components {
>   .input-style  { @apply rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-violet-500 w-full; }
>   .select-style { @apply rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-white outline-none focus:border-violet-500 w-full; }
> }
> ```

**New + Edit series pages** — minimal wrappers:

```tsx
// src/app/admin/series/new/page.tsx
import SeriesForm from '@/components/admin/SeriesForm'
export default function NewSeriesPage() {
  return <div><h1 className="mb-8 text-2xl font-bold">New Series</h1><SeriesForm /></div>
}

// src/app/admin/series/[id]/edit/page.tsx
import { getSeries } from '@/lib/db'
import SeriesForm from '@/components/admin/SeriesForm'
import { notFound } from 'next/navigation'
export default async function EditSeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const series = await getSeries()
  const item = series.find(s => s.id === id)
  if (!item) notFound()
  return <div><h1 className="mb-8 text-2xl font-bold">Edit Series</h1><SeriesForm initialData={item} /></div>
}
```

---

### ☐ Step 3.9 — Chapters page + API routes

**`src/app/admin/chapters/page.tsx`** — client component (needs dynamic series filter):

```tsx
'use client'
import { useState, useEffect } from 'react'
import type { Series, Chapter } from '@/types'

export default function AdminChaptersPage() {
  const [series, setSeries]       = useState<Series[]>([])
  const [seriesId, setSeriesId]   = useState('')
  const [chapters, setChapters]   = useState<Chapter[]>([])

  useEffect(() => {
    fetch('/api/series').then(r => r.json()).then(setSeries)
  }, [])

  useEffect(() => {
    if (!seriesId) { setChapters([]); return }
    fetch(`/api/chapters?seriesId=${seriesId}`).then(r => r.json()).then(setChapters)
  }, [seriesId])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Chapters</h1>
      <select value={seriesId} onChange={e => setSeriesId(e.target.value)}
        className="mb-6 rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-white outline-none focus:border-violet-500">
        <option value="">— Select a series —</option>
        {series.map(s => <option key={s.id} value={s.id}>{s.icon} {s.title}</option>)}
      </select>

      {chapters.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Lessons</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {chapters.map(ch => (
                <tr key={ch.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-slate-400">{ch.order}</td>
                  <td className="px-4 py-3 font-medium text-white">{ch.title}</td>
                  <td className="px-4 py-3 text-slate-400">{ch.totalLessons}</td>
                  <td className="px-4 py-3">
                    <button className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

**`src/app/api/chapters/route.ts`**:

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
  // TODO Phase 7: write to Firestore
  return NextResponse.json({ ...body, id: Date.now().toString() }, { status: 201 })
}
```

**`src/app/api/chapters/[id]/route.ts`**:

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  return NextResponse.json({ id, ...body })
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  return NextResponse.json({ deleted: id })
}
```

---

### ☐ Step 3.10 — About page editor + db/about.json

**`db/about.json`**:

```json
{
  "bio": "Hi, I'm Peter — a software developer and English enthusiast. I write about Java, JavaScript, Python, AI, and effective English for developers.",
  "skills": ["Java", "JavaScript", "TypeScript", "Next.js", "Python", "English C1"],
  "social": {
    "github": "",
    "linkedin": "",
    "twitter": ""
  }
}
```

**`src/lib/db/mock.ts`** — add this function (append to existing file):

```ts
import aboutData from '../../../db/about.json'

export async function getAbout() {
  return aboutData
}
```

**`src/app/api/about/route.ts`**:

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAbout } from '@/lib/db'

export async function GET() {
  const about = await getAbout()
  return NextResponse.json(about)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // TODO Phase 7: persist to Firestore / update JSON file
  return NextResponse.json(body)
}
```

**`src/app/admin/about/page.tsx`** — client component:

```tsx
'use client'
import { useState, useEffect } from 'react'

export default function AdminAboutPage() {
  const [bio, setBio]           = useState('')
  const [skills, setSkills]     = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [github, setGithub]     = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [twitter, setTwitter]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    fetch('/api/about').then(r => r.json()).then(data => {
      setBio(data.bio ?? '')
      setSkills(data.skills ?? [])
      setGithub(data.social?.github ?? '')
      setLinkedin(data.social?.linkedin ?? '')
      setTwitter(data.social?.twitter ?? '')
    })
  }, [])

  function addSkill() {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills(prev => [...prev, s])
    setSkillInput('')
  }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/about', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio, skills, social: { github, linkedin, twitter } }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold">About Page</h1>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={5}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 outline-none focus:border-violet-500 resize-none w-full" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-400">Skills</label>
          <div className="flex gap-2">
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add skill…"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-violet-500 flex-1" />
            <button onClick={addSkill}
              className="rounded-lg bg-white/10 px-3 text-sm text-slate-300 hover:bg-white/20">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1 rounded-full bg-cyan-500/15 px-3 py-0.5 text-xs text-cyan-300">
                {s}
                <button onClick={() => setSkills(sk => sk.filter(x => x !== s))} className="hover:text-white">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm text-slate-400">Social Links</label>
          {[['GitHub', github, setGithub], ['LinkedIn', linkedin, setLinkedin], ['Twitter / X', twitter, setTwitter]].map(
            ([label, value, setter]: any) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-24 text-sm text-slate-500">{label}</span>
                <input value={value} onChange={e => setter(e.target.value)} placeholder="https://..."
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 outline-none focus:border-violet-500" />
              </div>
            )
          )}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {saved && <span className="text-sm text-emerald-400">✓ Saved!</span>}
        </div>
      </div>
    </div>
  )
}
```

---

### ☐ Step 3.11 — Build smoke test

```bash
npm run build
```

Expected output — all routes registered:
```
Route (app)
├ ○ /
├ ○ /admin
├ ○ /admin/login
├ ○ /admin/posts
├ ƒ /admin/posts/[id]/edit
├ ○ /admin/posts/new
├ ○ /admin/series
├ ƒ /admin/series/[id]/edit
├ ○ /admin/series/new
├ ○ /admin/chapters
├ ○ /admin/about
├ ƒ /api/auth/[...nextauth]
├ ƒ /api/posts
├ ƒ /api/posts/[id]
├ ƒ /api/series
├ ƒ /api/series/[id]
├ ƒ /api/chapters
├ ƒ /api/chapters/[id]
└ ƒ /api/about
```

---

### ☐ Step 3.12 — Git commit

```bash
git add .
git commit -m "feat: Phase 3 — admin dashboard, post/series/chapter CRUD, TipTap editor"
```

---

## ✅ Phase 3 Complete When

| Check | Expectation |
|-------|-------------|
| `/admin` | Shows dashboard stub (redirects to login if unauthenticated) |
| `/admin/posts` | Lists all posts from `db/posts.json` |
| `/admin/posts/new` | Form loads with TipTap editor; Save Draft sends POST to `/api/posts` |
| `/admin/series` | Lists all 6 series with icon, level, status |
| `/admin/chapters` | Series dropdown loads chapters dynamically |
| `/admin/about` | Bio and skills pre-populated from `db/about.json` |
| `npm run build` | Zero TypeScript errors |

---

## Files Created in Phase 3

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx                      ← Admin shell (sidebar + main)
│   │   ├── page.tsx                        ← Dashboard stub (updated)
│   │   ├── posts/
│   │   │   ├── page.tsx                    ← Posts list (server)
│   │   │   ├── new/page.tsx                ← New post page
│   │   │   └── [id]/edit/page.tsx          ← Edit post page
│   │   ├── series/
│   │   │   ├── page.tsx                    ← Series list (server)
│   │   │   ├── new/page.tsx                ← New series page
│   │   │   └── [id]/edit/page.tsx          ← Edit series page
│   │   ├── chapters/
│   │   │   └── page.tsx                    ← Chapter manager (client)
│   │   └── about/
│   │       └── page.tsx                    ← About editor (client)
│   └── api/
│       ├── posts/
│       │   ├── route.ts                    ← GET + POST
│       │   └── [id]/route.ts               ← PUT + DELETE
│       ├── series/
│       │   ├── route.ts                    ← GET + POST
│       │   └── [id]/route.ts               ← PUT + DELETE
│       ├── chapters/
│       │   ├── route.ts                    ← GET + POST
│       │   └── [id]/route.ts               ← PUT + DELETE
│       └── about/
│           └── route.ts                    ← GET + POST
├── components/
│   └── admin/
│       ├── Sidebar.tsx                     ← Nav sidebar
│       ├── PostsTable.tsx                  ← Posts data table
│       ├── PostForm.tsx                    ← New/Edit post form
│       ├── RichEditor.tsx                  ← TipTap editor component
│       ├── SeriesForm.tsx                  ← Series create/edit form
│       ├── Badge.tsx                       ← Status/category badge
│       └── ConfirmDialog.tsx               ← Delete confirm modal
└── app/
    └── globals.css                         ← Add .input-style + .select-style
db/
└── about.json                              ← Mock about data
```

---

## What Comes After Phase 3

→ **Phase 4** — Public website: Navbar, Footer, Home page with hero + featured posts, blog list, series list, lesson reader.  
See [phase-step.md](./phase-step.md) Phase 4 section for details.
