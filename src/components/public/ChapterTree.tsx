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
            <span className="text-xs font-mono text-slate-400 w-5 shrink-0">
              {chIdx + 1}.
            </span>
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold truncate">
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
                      ? 'bg-violet-50 text-violet-600 border border-violet-200'
                      : lesson.published
                        ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                        : 'text-slate-300 cursor-default pointer-events-none',
                  )}
                >
                  <span className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0',
                    isActive ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-400',
                  )}>
                    {isActive ? '●' : lesson.published ? '○' : '·'}
                  </span>
                  <span className="flex-1 line-clamp-2 leading-snug">{lesson.title}</span>
                  {lesson.readTime > 0 && (
                    <span className="text-xs font-mono text-slate-300 shrink-0 group-hover:text-slate-500 transition-colors">
                      {lesson.readTime}m
                    </span>
                  )}
                </Link>
              )
            })}
            {chapter.lessons.length === 0 && (
              <p className="px-3 py-1.5 text-xs text-slate-300 font-body italic">
                No lessons yet
              </p>
            )}
          </div>
        </div>
      ))}
    </nav>
  )
}
