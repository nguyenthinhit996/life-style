import Link from 'next/link'
import type { Chapter, Post } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  chapters: (Chapter & { lessons: Post[] })[]
  seriesId: string
  currentLessonSlug?: string
}

export default function ChapterTree({ chapters, seriesId, currentLessonSlug }: Props) {
  return (
    <nav className="space-y-4">
      {chapters.map((chapter, chIdx) => (
        <div key={chapter.id}>
          {/* Chapter header */}
          <div className="flex items-center gap-2 mb-2 px-2">
            <span className="text-xs font-mono text-white/30 w-5 shrink-0">
              {chIdx + 1}.
            </span>
            <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider font-semibold truncate">
              {chapter.title}
            </h4>
          </div>

          {/* Lessons */}
          <div className="space-y-0.5">
            {chapter.lessons.map((lesson) => {
              const isActive = currentLessonSlug === lesson.slug
              return (
                <Link
                  key={lesson.id}
                  href={`/blog/series/${seriesId}/${chapter.id}/${lesson.slug}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-body transition-colors duration-150 group',
                    isActive
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : lesson.published
                        ? 'text-white/60 hover:text-white hover:bg-white/5'
                        : 'text-white/25 cursor-default pointer-events-none',
                  )}
                >
                  <span className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0',
                    isActive ? 'bg-violet-500 text-white' : 'bg-white/5 text-white/30',
                  )}>
                    {isActive ? '●' : lesson.published ? '○' : '·'}
                  </span>
                  <span className="flex-1 line-clamp-2 leading-snug">{lesson.title}</span>
                  {lesson.readTime > 0 && (
                    <span className="text-xs font-mono text-white/20 shrink-0 group-hover:text-white/40 transition-colors">
                      {lesson.readTime}m
                    </span>
                  )}
                </Link>
              )
            })}
            {chapter.lessons.length === 0 && (
              <p className="px-3 py-1.5 text-xs text-white/25 font-body italic">
                No lessons yet
              </p>
            )}
          </div>
        </div>
      ))}
    </nav>
  )
}
