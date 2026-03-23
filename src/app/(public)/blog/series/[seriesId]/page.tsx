import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getSeriesById, getSeriesTree } from '@/lib/db'

export const dynamic = 'force-dynamic'
import ChapterTree from '@/components/public/ChapterTree'

interface Props {
  params: Promise<{ seriesId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seriesId } = await params
  const series = await getSeriesById(seriesId)
  if (!series) return {}
  return {
    title: `${series.title} — Life-Style`,
    description: series.description ?? undefined,
  }
}

const levelColors: Record<string, string> = {
  Beginner: 'bg-green-500/20 text-green-400',
  Intermediate: 'bg-yellow-500/20 text-yellow-400',
  Advanced: 'bg-red-500/20 text-red-400',
}

export default async function SeriesDetailPage({ params }: Props) {
  const { seriesId } = await params
  const tree = await getSeriesTree(seriesId)

  if (!tree) notFound()

  const { chapters } = tree
  const firstPublishedLesson = chapters
    .flatMap((ch) => ch.lessons)
    .find((l) => l.published)

  const firstChapterWithLesson = firstPublishedLesson
    ? chapters.find((ch) => ch.lessons.some((l) => l.id === firstPublishedLesson.id))
    : null

  const totalLessons = chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)
  const totalReadTime = chapters.reduce(
    (sum, ch) => sum + ch.lessons.reduce((s, l) => s + (l.readTime || 0), 0),
    0
  )

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm font-mono text-white/30" aria-label="Breadcrumb">
          <Link href="/blog" className="hover:text-white/60 transition-colors">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/60">{tree.title}</span>
        </nav>

        {/* Series banner */}
        <div className="mb-10">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl">{tree.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${levelColors[tree.level] ?? 'bg-white/10 text-white/40'}`}>
                  {tree.level}
                </span>
                {tree.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                {tree.title}
              </h1>
            </div>
          </div>

          {tree.description && (
            <p className="text-white/60 font-body text-lg leading-relaxed mt-4">
              {tree.description}
            </p>
          )}

          {/* Stats */}
          <div className="mt-5 flex items-center gap-6 text-sm font-mono text-white/40">
            <span>{chapters.length} chapters</span>
            <span>{totalLessons} lessons</span>
            {totalReadTime > 0 && <span>~{totalReadTime} min total</span>}
          </div>

          {/* CTA */}
          {firstPublishedLesson && firstChapterWithLesson && (
            <Link
              href={`/blog/series/${seriesId}/${firstChapterWithLesson.id}/${firstPublishedLesson.slug}`}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-body text-sm font-semibold transition-colors shadow-lg shadow-violet-900/30"
            >
              Start Learning →
            </Link>
          )}
        </div>

        {/* Chapter tree */}
        {chapters.length > 0 ? (
          <div className="rounded-2xl bg-[#0C1524] border border-white/10 p-6">
            <h2 className="font-display text-lg font-semibold text-white mb-6">
              Course Outline
            </h2>
            <ChapterTree chapters={chapters} seriesId={seriesId} />
          </div>
        ) : (
          <p className="text-white/40 font-body">No chapters available yet.</p>
        )}
      </div>
    </div>
  )
}
