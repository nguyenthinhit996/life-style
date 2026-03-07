import Link from 'next/link'
import type { Series } from '@/types'

interface SeriesCardProps {
  series: Series
  lessonCount?: number
}

const categoryColors: Record<string, { gradient: string; border: string; badge: string }> = {
  IT: {
    gradient: 'from-violet-500/15 to-[#0C1524]',
    border: 'border-violet-500/20 hover:border-violet-500/50',
    badge: 'bg-violet-500/20 text-violet-300',
  },
  ENGLISH: {
    gradient: 'from-cyan-500/15 to-[#0C1524]',
    border: 'border-cyan-500/20 hover:border-cyan-500/50',
    badge: 'bg-cyan-500/20 text-cyan-300',
  },
  LIFESTYLE: {
    gradient: 'from-emerald-500/15 to-[#0C1524]',
    border: 'border-emerald-500/20 hover:border-emerald-500/50',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
}

const categoryLabels: Record<string, string> = {
  IT: 'IT',
  ENGLISH: 'English',
  LIFESTYLE: 'Lifestyle',
}

const levelColors: Record<string, string> = {
  Beginner: 'text-green-400',
  Intermediate: 'text-yellow-400',
  Advanced: 'text-red-400',
}

export default function SeriesCard({ series, lessonCount }: SeriesCardProps) {
  const colors = categoryColors[series.category] ?? {
    gradient: 'from-white/5 to-[#0C1524]',
    border: 'border-white/10 hover:border-white/30',
    badge: 'bg-white/10 text-white/60',
  }

  return (
    <Link
      href={`/blog/series/${series.id}`}
      className={`group relative flex flex-col rounded-2xl border bg-gradient-to-b ${colors.gradient} ${colors.border} overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30`}
    >
      {/* Cover area */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-3">
          <span className="text-4xl">{series.icon}</span>
          {!series.published && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/40">
              Coming Soon
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${colors.badge}`}>
            {categoryLabels[series.category] ?? series.category}
          </span>
          <span className={`text-xs font-mono ${levelColors[series.level] ?? 'text-white/40'}`}>
            {series.level}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-6 pb-6">
        <h3 className="font-display text-lg font-bold text-white group-hover:text-violet-300 transition-colors leading-snug">
          {series.title}
        </h3>
        {series.description && (
          <p className="mt-2 text-sm text-white/55 font-body line-clamp-2 leading-relaxed flex-1">
            {series.description}
          </p>
        )}

        {/* Tags */}
        {series.tags && series.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {series.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-white/30">
          <span>
            {series.totalChapters} chapters
            {lessonCount !== undefined ? ` · ${lessonCount} lessons` : ''} 
          </span>
          <span className="group-hover:text-violet-400 transition-colors">
            {series.published ? 'Start →' : 'Preview →'}
          </span>
        </div>
      </div>
    </Link>
  )
}
