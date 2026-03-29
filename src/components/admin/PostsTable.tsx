'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/types'
import Badge from '@/components/admin/Badge'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

function viewHref(post: Post): string {
  if (post.type === 'lesson' && post.seriesId && post.chapterId) {
    return `/blog/series/${post.seriesId}/${post.chapterId}/${post.slug}`
  }
  return `/blog/${post.slug}`
}

const SELECT_CLS =
  'rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500'

export default function PostsTable({ posts }: { posts: Post[] }) {
  const router = useRouter()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const [search, setSearch]       = useState('')
  const [typeFilter, setType]     = useState<'all' | 'blog' | 'lesson'>('all')
  const [catFilter, setCat]       = useState<'all' | 'IT' | 'ENGLISH' | 'LIFESTYLE'>('all')
  const [statusFilter, setStatus] = useState<'all' | 'published' | 'draft'>('all')

  const filtered = useMemo(() => {
    return posts.filter(p => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'all' && p.type !== typeFilter) return false
      if (catFilter !== 'all' && p.category !== catFilter) return false
      if (statusFilter === 'published' && !p.published) return false
      if (statusFilter === 'draft' && p.published) return false
      return true
    })
  }, [posts, search, typeFilter, catFilter, statusFilter])

  async function handleDelete(id: string) {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    setConfirmId(null)
    router.refresh()
  }

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 min-w-[180px]"
        />

        <select value={typeFilter} onChange={e => setType(e.target.value as typeof typeFilter)} className={SELECT_CLS}>
          <option value="all">All types</option>
          <option value="blog">Blog</option>
          <option value="lesson">Lesson</option>
        </select>

        <select value={catFilter} onChange={e => setCat(e.target.value as typeof catFilter)} className={SELECT_CLS}>
          <option value="all">All categories</option>
          <option value="IT">IT</option>
          <option value="ENGLISH">English</option>
          <option value="LIFESTYLE">Lifestyle</option>
        </select>

        <select value={statusFilter} onChange={e => setStatus(e.target.value as typeof statusFilter)} className={SELECT_CLS}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <span className="ml-auto text-xs text-slate-500">
          {filtered.length} / {posts.length} posts
        </span>
      </div>

      {/* ── Table ── */}
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No posts match the current filters.
                </td>
              </tr>
            )}
            {filtered.map(post => (
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
                    href={viewHref(post)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded px-2 py-1 text-xs text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
                  >
                    View
                  </Link>
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
