'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

interface UnsplashPhoto {
  id: string
  urls: { small: string; regular: string }
  alt_description: string | null
  user: { name: string; links: { html: string } }
}

interface ImagePickerModalProps {
  onInsert: (url: string) => void
  onClose: () => void
}

// ─── Tab type ────────────────────────────────────────────────────────────────
type Tab = 'search' | 'url'

export default function ImagePickerModal({ onInsert, onClose }: ImagePickerModalProps) {
  const [tab, setTab]               = useState<Tab>(UNSPLASH_KEY ? 'search' : 'url')
  const [query, setQuery]           = useState('')
  const [photos, setPhotos]         = useState<UnsplashPhoto[]>([])
  const [loading, setLoading]       = useState(false)
  const [searched, setSearched]     = useState(false)
  const [urlValue, setUrlValue]     = useState('')
  const [hoverId, setHoverId]       = useState<string | null>(null)
  const inputRef                    = useRef<HTMLInputElement>(null)

  // Focus search input on open
  useEffect(() => { inputRef.current?.focus() }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const search = useCallback(async () => {
    if (!query.trim() || !UNSPLASH_KEY) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&client_id=${UNSPLASH_KEY}`,
      )
      const data = await res.json()
      setPhotos(data.results ?? [])
    } catch {
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (tab === 'search') search()
      if (tab === 'url' && urlValue.trim()) { onInsert(urlValue.trim()); onClose() }
    }
  }

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* ── Modal card ── */}
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a1220] shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
        style={{ maxHeight: '85vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <div>
            <h2 className="font-display text-sm font-bold text-white">Insert Image</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Search free photos from Unsplash or paste a URL
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/[0.07] px-5 pt-3">
          {(UNSPLASH_KEY ? (['search', 'url'] as Tab[]) : (['url'] as Tab[])).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'pb-2.5 text-xs font-semibold transition border-b-2 px-1 mr-3',
                tab === t
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300',
              )}
            >
              {t === 'search' ? '🔍 Search Unsplash' : '🔗 Paste URL'}
            </button>
          ))}
        </div>

        {/* ── Search tab ── */}
        {tab === 'search' && (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Search bar */}
            <div className="flex gap-2 border-b border-white/[0.06] px-5 py-3">
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search mountains, food, technology…"
                className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20"
              />
              <button
                onClick={search}
                disabled={!query.trim() || loading}
                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:opacity-40"
              >
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>

            {/* No API key warning */}
            {!UNSPLASH_KEY && (
              <div className="m-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-300">
                <p className="font-semibold">Unsplash API key not set</p>
                <p className="mt-1 text-amber-400/70">
                  Add <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_UNSPLASH_ACCESS_KEY</code> to{' '}
                  <code className="rounded bg-white/10 px-1">.env.local</code> —{' '}
                  get a free key at{' '}
                  <span className="text-amber-300 underline">unsplash.com/developers</span>
                </p>
              </div>
            )}

            {/* Photo grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading && (
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="aspect-video animate-pulse rounded-xl bg-white/[0.05]" />
                  ))}
                </div>
              )}

              {!loading && searched && photos.length === 0 && (
                <p className="py-12 text-center text-sm text-slate-600">No photos found for "{query}"</p>
              )}

              {!loading && !searched && UNSPLASH_KEY && (
                <p className="py-12 text-center text-sm text-slate-700">Search for a topic above to browse free photos</p>
              )}

              {!loading && photos.length > 0 && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    {photos.map(photo => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => { onInsert(photo.urls.regular); onClose() }}
                        onMouseEnter={() => setHoverId(photo.id)}
                        onMouseLeave={() => setHoverId(null)}
                        className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] transition hover:border-violet-500/50 hover:ring-2 hover:ring-violet-500/30"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.urls.small}
                          alt={photo.alt_description ?? ''}
                          className="aspect-video w-full object-cover transition group-hover:scale-105"
                        />
                        {/* Hover overlay */}
                        <div className={cn(
                          'absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 transition-opacity',
                          hoverId === photo.id ? 'opacity-100' : 'opacity-0',
                        )}>
                          <div />
                          <div>
                            <div className="mb-1.5 flex items-center justify-center">
                              <span className="rounded-lg bg-violet-600 px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
                                Use this photo
                              </span>
                            </div>
                            <p className="truncate text-center text-[10px] text-slate-400">
                              📷 {photo.user.name} on Unsplash
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="mt-3 text-center text-[10px] text-slate-700">
                    Photos by talented creators on{' '}
                    <a
                      href="https://unsplash.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 underline hover:text-slate-400"
                    >
                      Unsplash
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── URL tab ── */}
        {tab === 'url' && (
          <div className="flex flex-col gap-3 p-5">
            <p className="text-xs text-slate-500">Paste any direct image URL</p>
            <input
              autoFocus={tab === 'url'}
              value={urlValue}
              onChange={e => setUrlValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder="https://example.com/image.jpg"
              className="rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20"
            />
            {urlValue.trim() && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={urlValue}
                alt="Preview"
                className="max-h-48 w-full rounded-xl border border-white/[0.07] object-contain"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            )}
            <button
              onClick={() => { if (urlValue.trim()) { onInsert(urlValue.trim()); onClose() } }}
              disabled={!urlValue.trim()}
              className="self-start rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:opacity-40"
            >
              Insert Image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
