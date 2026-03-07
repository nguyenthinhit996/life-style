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
  const [preview, setPreview]       = useState(false)

  useEffect(() => {
    if (!isEdit) setSlug(slugify(title))
  }, [title, isEdit])

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

  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  const readTime  = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="flex gap-6">

      {/* ── Left: main editor column ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">

        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post title…"
          className="w-full rounded-xl border border-white/[0.08] bg-[#0C1524] px-5 py-3.5 font-display text-2xl font-bold text-white placeholder-slate-700 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
        />

        {/* Slug row */}
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <span className="shrink-0 text-xs text-slate-600">/blog/</span>
          <input
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="flex-1 bg-transparent font-mono text-sm text-slate-400 outline-none placeholder-slate-700 focus:text-white"
            placeholder="post-slug"
          />
          <span className="shrink-0 text-[10px] text-slate-700">auto-generated from title</span>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2">
          {(['blog', 'lesson'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                type === t
                  ? 'bg-violet-600 text-white shadow shadow-violet-900/40'
                  : 'border border-white/[0.07] bg-white/[0.03] text-slate-500 hover:bg-white/[0.07] hover:text-white'
              }`}
            >
              {t === 'blog' ? '✍ Blog Post' : '📚 Lesson'}
            </button>
          ))}
        </div>

        {/* Editor / Preview */}
        <div className="flex flex-col gap-2">
          <RichEditor
            value={content}
            onChange={setContent}
            onPreview={() => setPreview(v => !v)}
            showPreview={preview}
          />

          {/* Preview pane */}
          {preview && (
            <div className="rounded-xl border border-violet-500/20 bg-[#0C1524] px-8 py-7">
              <div className="mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-400">Preview</span>
                {title && <span className="text-sm font-semibold text-white">{title}</span>}
              </div>
              <article
                className="prose prose-invert prose-headings:font-display prose-code:font-mono max-w-none
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-violet-500/50 prose-blockquote:text-slate-400
                  prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-300
                  prose-pre:bg-[#070D1A] prose-pre:border prose-pre:border-white/[0.07]
                  prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-slate-600">Nothing written yet…</p>' }}
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPublished(p => !p)}
              className={`relative h-5 w-9 rounded-full transition ${published ? 'bg-violet-600' : 'bg-white/10'}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${published ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-slate-500">{published ? 'Published' : 'Draft'}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="rounded-lg border border-white/[0.08] px-5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !title.trim()}
              className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-violet-900/40 transition hover:bg-violet-500 disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: metadata sidebar ── */}
      <div className="flex w-64 shrink-0 flex-col gap-4">

        {/* Stats */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0C1524] p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Stats</p>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Words</span>
              <span className="font-mono text-slate-300">{wordCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Read time</span>
              <span className="font-mono text-slate-300">{readTime} min</span>
            </div>
          </div>
        </div>

        {/* Series + Chapter (lessons only) */}
        {type === 'lesson' && (
          <div className="rounded-xl border border-white/[0.06] bg-[#0C1524] p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Lesson</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-600">Series</label>
                <select
                  value={seriesId}
                  onChange={e => { setSeriesId(e.target.value); setChapterId('') }}
                  className="select-style text-sm"
                >
                  <option value="">— Select series —</option>
                  {allSeries.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-600">Chapter</label>
                <select
                  value={chapterId}
                  onChange={e => setChapterId(e.target.value)}
                  disabled={!chapters.length}
                  className="select-style text-sm disabled:opacity-40"
                >
                  <option value="">— Select chapter —</option>
                  {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0C1524] p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Meta</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-600">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="select-style text-sm">
                <option value="">— Select —</option>
                <option value="IT">IT</option>
                <option value="ENGLISH">English</option>
                <option value="LIFESTYLE">Lifestyle</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">Cover Image URL</label>
              <input
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="input-style text-xs"
              />
              {coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImage} alt="cover preview" className="mt-2 w-full rounded-lg object-cover" style={{ maxHeight: 120 }} />
              )}
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0C1524] p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Excerpt</p>
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            rows={4}
            placeholder="Short summary shown in lists…"
            className="input-style resize-none text-sm"
          />
          <p className="mt-1 text-right text-[10px] text-slate-700">{excerpt.length} / 200</p>
        </div>

      </div>
    </div>
  )
}

