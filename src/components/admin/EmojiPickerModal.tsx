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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="flex w-[420px] max-h-[520px] flex-col rounded-2xl border border-white/[0.12] bg-[#0C1524] shadow-[0_24px_60px_rgba(0,0,0,0.7)]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <span className="text-sm font-semibold text-white">Choose Icon</span>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg leading-none">×</button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2">
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search icons…"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto px-4 pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {CATS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition ${
                cat === c
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-600">No icons found</div>
          ) : (
            <div className="grid grid-cols-8 gap-1 pt-1">
              {filtered.map(ic => (
                <button
                  key={ic.emoji + ic.label}
                  type="button"
                  title={ic.label}
                  onClick={() => { onSelect(ic.emoji); onClose() }}
                  className={`group flex h-10 w-10 items-center justify-center rounded-xl text-xl transition hover:bg-white/10 hover:scale-110 ${
                    current === ic.emoji ? 'bg-violet-600/20 ring-1 ring-violet-500' : ''
                  }`}
                >
                  {ic.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current + clear */}
        <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Selected:</span>
            <span className="text-2xl">{current || '—'}</span>
          </div>
          {current && (
            <button
              type="button"
              onClick={() => { onSelect(''); onClose() }}
              className="rounded-lg px-3 py-1 text-xs text-slate-500 hover:bg-white/5 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
