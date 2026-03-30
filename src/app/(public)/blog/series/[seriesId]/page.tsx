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
  Beginner: 'bg-green-100 text-green-600',
  Intermediate: 'bg-yellow-100 text-yellow-600',
  Advanced: 'bg-red-100 text-red-600',
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
        <nav className="mb-8 text-sm font-mono text-slate-400 flex flex-wrap items-center" aria-label="Breadcrumb">
          <Link href="/blog" className="hover:text-slate-600 transition-colors">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-600">{tree.title}</span>
        </nav>

        {/* Series banner */}
        <div className="mb-10">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl">{tree.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${levelColors[tree.level] ?? 'bg-slate-100 text-slate-400'}`}>
                  {tree.level}
                </span>
                {tree.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
                {tree.title}
              </h1>
            </div>
          </div>

          {tree.description && (
            <p className="text-slate-500 font-body text-lg leading-relaxed mt-4">
              {tree.description}
            </p>
          )}

          {/* Stats */}
          <div className="mt-5 flex items-center gap-6 text-sm font-mono text-slate-400">
            <span>{chapters.length} chapters</span>
            <span>{totalLessons} lessons</span>
            {totalReadTime > 0 && <span>~{totalReadTime} min total</span>}
          </div>

          {/* CTA */}
          {firstPublishedLesson && firstChapterWithLesson && (
            <Link
              href={`/blog/series/${seriesId}/${firstChapterWithLesson.id}/${firstPublishedLesson.slug}`}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-body text-sm font-semibold transition-colors shadow-lg shadow-violet-500/20"
            >
              Start Learning →
            </Link>
          )}
        </div>

        {/* Chapter tree */}
        {chapters.length > 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <h2 className="font-display text-lg font-semibold text-slate-800 mb-6">
              Course Outline
            </h2>
            <ChapterTree chapters={chapters} seriesId={seriesId} />
          </div>
        ) : (
          <p className="text-slate-400 font-body">No chapters available yet.</p>
        )}
      </div>
    </div>
  )
}
