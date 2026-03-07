'use client'
import { useState, useMemo, useRef, useEffect } from 'react'

// ── Icon dataset: label + emoji ────────────────────────────────────────────────
const ICONS: { label: string; emoji: string; cat: string }[] = [
  // Tech
  { label: 'laptop',       emoji: '💻', cat: 'Tech' },
  { label: 'desktop',      emoji: '🖥️', cat: 'Tech' },
  { label: 'phone',        emoji: '📱', cat: 'Tech' },
  { label: 'keyboard',     emoji: '⌨️', cat: 'Tech' },
  { label: 'mouse',        emoji: '🖱️', cat: 'Tech' },
  { label: 'floppy',       emoji: '💾', cat: 'Tech' },
  { label: 'disc',         emoji: '💿', cat: 'Tech' },
  { label: 'satellite',    emoji: '📡', cat: 'Tech' },
  { label: 'plug',         emoji: '🔌', cat: 'Tech' },
  { label: 'battery',      emoji: '🔋', cat: 'Tech' },
  { label: 'chip',         emoji: '🔲', cat: 'Tech' },
  { label: 'robot',        emoji: '🤖', cat: 'Tech' },
  { label: 'game',         emoji: '🎮', cat: 'Tech' },
  { label: 'vr',           emoji: '🥽', cat: 'Tech' },
  { label: 'camera',       emoji: '📷', cat: 'Tech' },
  { label: 'video',        emoji: '🎥', cat: 'Tech' },
  // Code
  { label: 'code',         emoji: '💡', cat: 'Code' },
  { label: 'gear',         emoji: '⚙️', cat: 'Code' },
  { label: 'wrench',       emoji: '🔧', cat: 'Code' },
  { label: 'tools',        emoji: '🛠️', cat: 'Code' },
  { label: 'bug',          emoji: '🐛', cat: 'Code' },
  { label: 'package',      emoji: '📦', cat: 'Code' },
  { label: 'lock',         emoji: '🔐', cat: 'Code' },
  { label: 'key',          emoji: '🔑', cat: 'Code' },
  { label: 'terminal',     emoji: '🖲️', cat: 'Code' },
  { label: 'magnifier',    emoji: '🔍', cat: 'Code' },
  { label: 'link',         emoji: '🔗', cat: 'Code' },
  { label: 'api',          emoji: '🔄', cat: 'Code' },
  { label: 'database',     emoji: '🗃️', cat: 'Code' },
  { label: 'server',       emoji: '🗄️', cat: 'Code' },
  { label: 'cloud',        emoji: '☁️', cat: 'Code' },
  { label: 'micro',        emoji: '🔬', cat: 'Code' },
  // Learning
  { label: 'book',         emoji: '📚', cat: 'Learn' },
  { label: 'open book',    emoji: '📖', cat: 'Learn' },
  { label: 'notepad',      emoji: '📝', cat: 'Learn' },
  { label: 'pencil',       emoji: '✏️', cat: 'Learn' },
  { label: 'graduation',   emoji: '🎓', cat: 'Learn' },
  { label: 'brain',        emoji: '🧠', cat: 'Learn' },
  { label: 'school',       emoji: '🏫', cat: 'Learn' },
  { label: 'lightbulb',    emoji: '💡', cat: 'Learn' },
  { label: 'telescope',    emoji: '🔭', cat: 'Learn' },
  { label: 'microscope',   emoji: '🔬', cat: 'Learn' },
  { label: 'chart',        emoji: '📊', cat: 'Learn' },
  { label: 'graph',        emoji: '📈', cat: 'Learn' },
  { label: 'clipboard',    emoji: '📋', cat: 'Learn' },
  { label: 'memo',         emoji: '📄', cat: 'Learn' },
  { label: 'calendar',     emoji: '📅', cat: 'Learn' },
  { label: 'trophy',       emoji: '🏆', cat: 'Learn' },
  // Language
  { label: 'globe',        emoji: '🌐', cat: 'Language' },
  { label: 'speech',       emoji: '🗣️', cat: 'Language' },
  { label: 'chat',         emoji: '💬', cat: 'Language' },
  { label: 'megaphone',    emoji: '📢', cat: 'Language' },
  { label: 'usa',          emoji: '🇺🇸', cat: 'Language' },
  { label: 'uk',           emoji: '🇬🇧', cat: 'Language' },
  { label: 'japan',        emoji: '🇯🇵', cat: 'Language' },
  { label: 'china',        emoji: '🇨🇳', cat: 'Language' },
  { label: 'korea',        emoji: '🇰🇷', cat: 'Language' },
  { label: 'spell',        emoji: '🔤', cat: 'Language' },
  { label: 'write',        emoji: '✍️', cat: 'Language' },
  { label: 'mail',         emoji: '📧', cat: 'Language' },
  // Lifestyle
  { label: 'coffee',       emoji: '☕', cat: 'Life' },
  { label: 'tea',          emoji: '🍵', cat: 'Life' },
  { label: 'food',         emoji: '🍱', cat: 'Life' },
  { label: 'art',          emoji: '🎨', cat: 'Life' },
  { label: 'music',        emoji: '🎵', cat: 'Life' },
  { label: 'movie',        emoji: '🎬', cat: 'Life' },
  { label: 'travel',       emoji: '✈️', cat: 'Life' },
  { label: 'fitness',      emoji: '🏃', cat: 'Life' },
  { label: 'yoga',         emoji: '🧘', cat: 'Life' },
  { label: 'bike',         emoji: '🚴', cat: 'Life' },
  { label: 'plant',        emoji: '🌱', cat: 'Life' },
  { label: 'home',         emoji: '🏠', cat: 'Life' },
  { label: 'heart',        emoji: '❤️', cat: 'Life' },
  { label: 'money',        emoji: '💰', cat: 'Life' },
  { label: 'health',       emoji: '💊', cat: 'Life' },
  { label: 'sleep',        emoji: '😴', cat: 'Life' },
  // Symbols
  { label: 'star',         emoji: '⭐', cat: 'Symbols' },
  { label: 'sparkle',      emoji: '✨', cat: 'Symbols' },
  { label: 'fire',         emoji: '🔥', cat: 'Symbols' },
  { label: 'rocket',       emoji: '🚀', cat: 'Symbols' },
  { label: 'gem',          emoji: '💎', cat: 'Symbols' },
  { label: 'lightning',    emoji: '⚡', cat: 'Symbols' },
  { label: 'rainbow',      emoji: '🌈', cat: 'Symbols' },
  { label: 'target',       emoji: '🎯', cat: 'Symbols' },
  { label: 'crown',        emoji: '👑', cat: 'Symbols' },
  { label: 'flag',         emoji: '🚩', cat: 'Symbols' },
  { label: 'tag',          emoji: '🏷️', cat: 'Symbols' },
  { label: 'check',        emoji: '✅', cat: 'Symbols' },
  { label: 'warning',      emoji: '⚠️', cat: 'Symbols' },
  { label: 'info',         emoji: 'ℹ️', cat: 'Symbols' },
  { label: 'plus',         emoji: '➕', cat: 'Symbols' },
  { label: 'infinity',     emoji: '♾️', cat: 'Symbols' },
  // Animals / fun
  { label: 'cat',          emoji: '🐱', cat: 'Fun' },
  { label: 'dog',          emoji: '🐶', cat: 'Fun' },
  { label: 'fox',          emoji: '🦊', cat: 'Fun' },
  { label: 'owl',          emoji: '🦉', cat: 'Fun' },
  { label: 'unicorn',      emoji: '🦄', cat: 'Fun' },
  { label: 'dragon',       emoji: '🐉', cat: 'Fun' },
  { label: 'snake',        emoji: '🐍', cat: 'Fun' },
  { label: 'penguin',      emoji: '🐧', cat: 'Fun' },
  { label: 'panda',        emoji: '🐼', cat: 'Fun' },
  { label: 'bear',         emoji: '🐻', cat: 'Fun' },
  { label: 'octopus',      emoji: '🐙', cat: 'Fun' },
  { label: 'ghost',        emoji: '👻', cat: 'Fun' },
]

const CATS = ['All', 'Tech', 'Code', 'Learn', 'Language', 'Life', 'Symbols', 'Fun'] as const

interface Props {
  current: string
  onSelect: (emoji: string) => void
  onClose: () => void
}

export default function EmojiPickerModal({ current, onSelect, onClose }: Props) {
  const [search, setSearch] = useState('')
  const [cat, setCat]       = useState<string>('All')
  const searchRef           = useRef<HTMLInputElement>(null)
  const overlayRef          = useRef<HTMLDivElement>(null)

  useEffect(() => { searchRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return ICONS.filter(ic =>
      (cat === 'All' || ic.cat === cat) &&
      (!q || ic.label.includes(q) || ic.emoji.includes(q) || ic.cat.toLowerCase().includes(q)),
    )
  }, [search, cat])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="flex w-[500px] max-h-[580px] flex-col rounded-2xl border border-white/[0.10] bg-[#0a1220] shadow-[0_32px_80px_rgba(0,0,0,0.8)]">

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 pt-5 pb-4">
          <div>
            <h2 className="text-base font-semibold text-white leading-none">Choose Icon</h2>
            <p className="mt-1 text-[11px] text-slate-500">{filtered.length} icons</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-500 transition hover:bg-white/10 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search icons…"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-violet-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto px-5 pb-3" style={{ scrollbarWidth: 'none' }}>
          {CATS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium tracking-wide transition-all ${
                cat === c
                  ? 'bg-violet-600 text-white shadow-[0_2px_12px_rgba(124,58,237,0.4)]'
                  : 'border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/[0.06]" />

        {/* Grid */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <span className="text-3xl">🔍</span>
              <span className="text-sm text-slate-600">No icons found for "{search}"</span>
            </div>
          ) : (
            <div className="grid grid-cols-9 gap-0.5">
              {filtered.map(ic => (
                <button
                  key={ic.emoji + ic.label}
                  type="button"
                  title={ic.label}
                  onClick={() => { onSelect(ic.emoji); onClose() }}
                  className={`group relative flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition-all duration-150
                    hover:bg-white/[0.08] hover:scale-110 active:scale-95
                    ${current === ic.emoji
                      ? 'bg-violet-500/20 ring-1 ring-violet-500/60 scale-105'
                      : ''
                    }`}
                >
                  {ic.emoji}
                  {current === ic.emoji && (
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#0a1220] bg-violet-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-white/[0.06] px-5 py-3.5">
          {current ? (
            <>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-2xl ring-1 ring-violet-500/30">
                {current}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white leading-none">Icon selected</p>
                <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                  {ICONS.find(i => i.emoji === current)?.label ?? 'custom'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { onSelect(''); onClose() }}
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs text-slate-500 transition hover:bg-white/[0.06] hover:text-red-400"
              >
                Remove
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-600">No icon selected — click one above to choose</p>
          )}
        </div>

      </div>
    </div>
  )
}
