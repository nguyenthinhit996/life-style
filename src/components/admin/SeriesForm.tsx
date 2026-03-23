'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Series } from '@/types'
import { slugify } from '@/lib/utils'
import EmojiPickerModal from '@/components/admin/EmojiPickerModal'

const COLORS = ['blue', 'yellow', 'green', 'violet', 'teal', 'cyan', 'orange'] as const
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const

const COLOR_HEX: Record<string, string> = {
  blue: '#3B82F6', yellow: '#EAB308', green: '#22C55E',
  violet: '#7C3AED', teal: '#14B8A6', cyan: '#06B6D4', orange: '#F97316',
}

export default function SeriesForm({ initialData = {} }: { initialData?: Partial<Series> }) {
  const router = useRouter()
  const isEdit = !!initialData.id

  const [title, setTitle]         = useState(initialData.title ?? '')
  const [slug, setSlug]           = useState(initialData.slug ?? '')
  const [description, setDesc]    = useState(initialData.description ?? '')
  const [category, setCategory]   = useState<string>(initialData.category ?? 'IT')
  const [tags, setTags]           = useState<string[]>(initialData.tags ?? [])
  const [tagInput, setTagInput]   = useState('')
  const [icon, setIcon]           = useState(initialData.icon ?? '')
  const [color, setColor]         = useState<string>(initialData.color ?? 'violet')
  const [level, setLevel]         = useState<string>(initialData.level ?? 'Beginner')
  const [published, setPublished] = useState(initialData.published ?? false)
  const [saving, setSaving]       = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  async function handleSave() {
    setSaving(true)
    const payload: Record<string, unknown> = {
      title,
      slug: slug || slugify(title),
      description, category, tags, icon, color, level, published,
      order: initialData.order ?? 0,
      updatedAt: new Date().toISOString(),
    }
    if (!isEdit) {
      payload.totalChapters = 0
      payload.totalLessons = 0
      payload.createdAt = new Date().toISOString()
    }
    const url    = isEdit ? `/api/series/${initialData.id}` : '/api/series'
    const method = isEdit ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    router.push('/admin/series')
  }

  return (
    <>
    <div className="flex max-w-2xl flex-col gap-5">
      <Field label="Title">
        <input
          value={title}
          onChange={e => { setTitle(e.target.value); if (!isEdit) setSlug(slugify(e.target.value)) }}
          placeholder="Series title…"
          className="input-style"
        />
      </Field>

      <Field label="Slug">
        <input value={slug} onChange={e => setSlug(e.target.value)} className="input-style font-mono text-sm" />
      </Field>

      <Field label="Description">
        <textarea value={description} onChange={e => setDesc(e.target.value)} rows={3} className="input-style resize-none" />
      </Field>

      <Field label="Category">
        <select value={category} onChange={e => setCategory(e.target.value)} className="select-style">
          <option value="IT">IT</option>
          <option value="ENGLISH">English</option>
          <option value="LIFESTYLE">Lifestyle</option>
        </select>
      </Field>

      <Field label="Tags">
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Press Enter to add"
            className="input-style flex-1"
          />
          <button type="button" onClick={addTag}
            className="rounded-lg bg-white/10 px-3 text-sm text-slate-300 hover:bg-white/20">
            Add
          </button>
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

      <Field label="Icon">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(true)}
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-3xl transition hover:border-violet-500/50 hover:bg-white/10"
          >
            {icon || <span className="text-slate-600 text-base">+</span>}
          </button>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(true)}
              className="rounded-lg bg-violet-600/20 px-4 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-600/30 transition"
            >
              {icon ? 'Change Icon' : 'Pick Icon'}
            </button>
            {icon && (
              <button
                type="button"
                onClick={() => setIcon('')}
                className="rounded-lg px-4 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </Field>

      <Field label="Color">
        <div className="flex gap-2">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-full ring-2 transition ${color === c ? 'scale-110 ring-white' : 'ring-transparent'}`}
              style={{ backgroundColor: COLOR_HEX[c] }}
            />
          ))}
        </div>
      </Field>

      <Field label="Level">
        <select value={level} onChange={e => setLevel(e.target.value)} className="select-style">
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </Field>

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

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-slate-300 hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Series'}
        </button>
      </div>
    </div>

    {showEmojiPicker && (
      <EmojiPickerModal
        current={icon}
        onSelect={setIcon}
        onClose={() => setShowEmojiPicker(false)}
      />
    )}
    </>
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
