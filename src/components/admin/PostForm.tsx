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

  const [title, setTitle]           = useState(initialData.title ?? '')
  const [slug, setSlug]             = useState(initialData.slug ?? '')
  const [type, setType]             = useState<'blog' | 'lesson'>(initialData.type ?? 'blog')
  const [seriesId, setSeriesId]     = useState(initialData.seriesId ?? '')
  const [chapterId, setChapterId]   = useState(initialData.chapterId ?? '')
  const [chapters, setChapters]     = useState<Chapter[]>([])
  const [category, setCategory]     = useState(initialData.category ?? '')
  const [excerpt, setExcerpt]       = useState(initialData.excerpt ?? '')
  const [coverImage, setCoverImage] = useState(initialData.coverImage ?? '')
  const [content, setContent]       = useState(initialData.content ?? '')
  const [published, setPublished]   = useState(initialData.published ?? false)
  const [saving, setSaving]         = useState(false)

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
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    router.push('/admin/posts')
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post title"
          className="input-style text-lg font-bold"
        />
      </div>

      {/* Slug */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Slug</label>
        <input
          value={slug}
          onChange={e => setSlug(e.target.value)}
          className="input-style font-mono text-sm"
        />
      </div>

      {/* Type toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-slate-400">Type</label>
        <div className="flex gap-2">
          {(['blog', 'lesson'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                type === t ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
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
            <select
              value={seriesId}
              onChange={e => { setSeriesId(e.target.value); setChapterId('') }}
              className="select-style"
            >
              <option value="">— Select series —</option>
              {allSeries.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm text-slate-400">Chapter</label>
            <select
              value={chapterId}
              onChange={e => setChapterId(e.target.value)}
              disabled={!chapters.length}
              className="select-style disabled:opacity-40"
            >
              <option value="">— Select chapter —</option>
              {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} className="select-style">
          <option value="">— Select category —</option>
          <option value="IT">IT</option>
          <option value="ENGLISH">English</option>
          <option value="LIFESTYLE">Lifestyle</option>
        </select>
      </div>

      {/* Excerpt */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          rows={3}
          className="input-style resize-none"
        />
      </div>

      {/* Cover image */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Cover Image URL</label>
        <input
          value={coverImage}
          onChange={e => setCoverImage(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="input-style text-sm"
        />
      </div>

      {/* TipTap editor */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Content</label>
        <RichEditor value={content} onChange={setContent} />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPublished(p => !p)}
          className={`relative h-6 w-11 rounded-full transition ${published ? 'bg-violet-600' : 'bg-white/10'}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${published ? 'left-[22px]' : 'left-0.5'}`} />
        </button>
        <span className="text-sm text-slate-400">{published ? 'Published' : 'Draft'}</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
