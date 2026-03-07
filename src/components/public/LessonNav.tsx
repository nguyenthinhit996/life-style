import Link from 'next/link'
import type { Chapter, Post } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  prev: (Post & { chapterId: string }) | null
  next: (Post & { chapterId: string }) | null
  seriesId: string
  currentIndex: number
  totalLessons: number
}

export default function LessonNav({ prev, next, seriesId, currentIndex, totalLessons }: Props) {
  return (
    <div className="mt-16 pt-8 border-t border-white/10">
      {/* Progress */}
      <div className="mb-6 text-center">
        <p className="text-xs font-mono text-white/30 mb-2">
          Lesson {currentIndex} of {totalLessons}
        </p>
        <div className="h-1 bg-white/10 rounded-full max-w-xs mx-auto">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${(currentIndex / totalLessons) * 100}%` }}
          />
        </div>
      </div>

      {/* Prev / Next */}
      <nav className="flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/blog/series/${seriesId}/${prev.chapterId}/${prev.slug}`}
            className={cn(
              'group flex items-center gap-3 flex-1 p-4 rounded-xl bg-[#0C1524]',
              'border border-white/10 hover:border-violet-500/40 transition-colors',
            )}
          >
            <span className="text-white/30 group-hover:text-violet-400 transition-colors text-lg">←</span>
            <div className="min-w-0">
              <div className="text-xs font-mono text-white/30">Previous</div>
              <div className="text-sm font-body text-white/70 group-hover:text-white transition-colors line-clamp-1">
                {prev.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {next ? (
          <Link
            href={`/blog/series/${seriesId}/${next.chapterId}/${next.slug}`}
            className={cn(
              'group flex items-center gap-3 flex-1 p-4 rounded-xl bg-[#0C1524]',
              'border border-white/10 hover:border-violet-500/40 transition-colors justify-end text-right',
            )}
          >
            <div className="min-w-0">
              <div className="text-xs font-mono text-white/30">Next</div>
              <div className="text-sm font-body text-white/70 group-hover:text-white transition-colors line-clamp-1">
                {next.title}
              </div>
            </div>
            <span className="text-white/30 group-hover:text-violet-400 transition-colors text-lg">→</span>
          </Link>
        ) : (
          <div className="flex-1 flex items-center justify-end p-4 text-sm font-mono text-white/30">
            ✓ Series complete
          </div>
        )}
      </nav>
    </div>
  )
}
