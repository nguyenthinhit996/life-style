import Link from 'next/link'
import type { Series } from '@/types'

interface SeriesCardProps {
  series: Series
  lessonCount?: number
}

const categoryColors: Record<string, { gradient: string; border: string; badge: string }> = {
  IT: {
    gradient: 'from-violet-50 to-white',
    border: 'border-slate-200 hover:border-violet-300',
    badge: 'bg-violet-100 text-violet-700',
  },
  ENGLISH: {
    gradient: 'from-cyan-50 to-white',
    border: 'border-slate-200 hover:border-cyan-300',
    badge: 'bg-cyan-100 text-cyan-700',
  },
  LIFESTYLE: {
    gradient: 'from-emerald-50 to-white',
    border: 'border-slate-200 hover:border-emerald-300',
    badge: 'bg-emerald-100 text-emerald-700',
  },
}

const categoryLabels: Record<string, string> = {
  IT: 'IT',
  ENGLISH: 'English',
  LIFESTYLE: 'Lifestyle',
}

const levelColors: Record<string, string> = {
  Beginner: 'text-green-600',
  Intermediate: 'text-yellow-600',
  Advanced: 'text-red-500',
}

export default function SeriesCard({ series, lessonCount }: SeriesCardProps) {
  const colors = categoryColors[series.category] ?? {
    gradient: 'from-slate-50 to-white',
    border: 'border-slate-200 hover:border-slate-300',
    badge: 'bg-slate-100 text-slate-500',
  }

  return (
    <Link
      href={`/blog/series/${series.id}`}
      className={`group relative flex flex-col rounded-2xl border bg-gradient-to-b ${colors.gradient} ${colors.border} overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/8`}
    >
      {/* Cover area */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-3">
          <span className="text-4xl">{series.icon}</span>
          {!series.published && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              Coming Soon
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${colors.badge}`}>
            {categoryLabels[series.category] ?? series.category}
          </span>
          <span className={`text-xs font-mono ${levelColors[series.level] ?? 'text-slate-400'}`}>
            {series.level}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-6 pb-6">
        <h3 className="font-display text-lg font-bold text-slate-800 group-hover:text-violet-600 transition-colors leading-snug">
          {series.title}
        </h3>
        {series.description && (
          <p className="mt-2 text-sm text-slate-500 font-body line-clamp-2 leading-relaxed flex-1">
            {series.description}
          </p>
        )}

        {/* Tags */}
        {series.tags && series.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {series.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>
            {series.totalChapters} chapters
            {lessonCount !== undefined ? ` · ${lessonCount} lessons` : ''} 
          </span>
          <span className="group-hover:text-violet-600 transition-colors">
            {series.published ? 'Start →' : 'Preview →'}
          </span>
        </div>
      </div>
    </Link>
  )
}
