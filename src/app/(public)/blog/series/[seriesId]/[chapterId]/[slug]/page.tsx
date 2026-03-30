import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getSeriesTree, getPostBySlug } from '@/lib/db'

export const dynamic = 'force-dynamic'
import ChapterTree from '@/components/public/ChapterTree'
import LessonNav from '@/components/public/LessonNav'
import ReadingProgressBar from '@/components/public/ReadingProgressBar'
import BackToTop from '@/components/public/BackToTop'
import ContentRenderer from '@/components/public/ContentRenderer'
import { applyHighlighting } from '@/lib/highlight'
import type { Post } from '@/types'

interface Props {
  params: Promise<{ seriesId: string; chapterId: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, seriesId } = await params
  const [post, tree] = await Promise.all([
    getPostBySlug(slug),
    getSeriesTree(seriesId),
  ])
  if (!post || !tree) return {}
  return {
    title: `${post.title} — ${tree.title} | Life-Style`,
    description: post.excerpt ?? undefined,
  }
}

export default async function LessonPage({ params }: Props) {
  const { seriesId, chapterId, slug } = await params

  const [post, tree] = await Promise.all([
    getPostBySlug(slug),
    getSeriesTree(seriesId),
  ])

  if (!post || !tree) notFound()

  // Build a flat ordered list of all lessons across all chapters
  const allLessons: (Post & { chapterId: string })[] = tree.chapters.flatMap((ch) =>
    ch.lessons.map((l) => ({ ...l, chapterId: ch.id })),
  )

  const currentIndex = allLessons.findIndex((l) => l.slug === slug)
  if (currentIndex === -1) notFound()

  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <>
      <ReadingProgressBar />
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-8">
          {/* Sidebar — sticky on desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 pt-8 pb-20 overflow-y-auto max-h-[calc(100vh-5rem)]">
              <Link
                href={`/blog/series/${seriesId}`}
                className="text-xs font-mono text-slate-400 hover:text-slate-600 transition-colors mb-5 flex items-center gap-1 group"
              >
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                {tree.title}
              </Link>
              <h2 className="font-display text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Course Outline
              </h2>
              <ChapterTree
                chapters={tree.chapters}
                seriesId={seriesId}
                currentLessonSlug={slug}
              />
            </div>
          </aside>

          {/* Main content */}
          <article className="flex-1 min-w-0 max-w-3xl py-10 pb-20">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm font-mono text-slate-400 flex flex-wrap items-center" aria-label="Breadcrumb">
              <Link href="/blog" className="hover:text-slate-600 transition-colors">
                Blog
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/blog/series/${seriesId}`}
                className="hover:text-slate-600 transition-colors"
              >
                {tree.title}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-600">{post.title}</span>
            </nav>

            {/* Mobile: back to series link */}
            <Link
              href={`/blog/series/${seriesId}`}
              className="lg:hidden mb-4 inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← {tree.title}
            </Link>

            {/* Mobile chapter outline */}
            <details className="lg:hidden mb-6 rounded-xl border border-slate-200 bg-white">
              <summary className="cursor-pointer px-4 py-3 text-sm font-mono text-slate-500 hover:text-slate-700 transition-colors list-none flex items-center justify-between">
                <span>Course Outline</span>
                <span className="text-xs text-slate-400">▾</span>
              </summary>
              <div className="px-4 pb-4">
                <ChapterTree chapters={tree.chapters} seriesId={seriesId} currentLessonSlug={slug} />
              </div>
            </details>

            {/* Lesson header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                {post.readTime > 0 && (
                  <span className="text-xs font-mono text-slate-400">
                    {post.readTime} min read
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400">
                  Lesson {currentIndex + 1} of {allLessons.length}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-4 text-slate-500 font-body text-base leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </header>

            {/* Content */}
            {post.content ? (
              <ContentRenderer
                html={applyHighlighting(post.content)}
                className="prose prose-headings:font-display prose-p:font-body prose-code:font-mono max-w-none prose-p:text-slate-600 prose-headings:text-slate-800 prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-slate-100 prose-code:text-sm prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#F8FAFC] prose-pre:border prose-pre:border-slate-200 prose-img:rounded-xl prose-blockquote:border-violet-500 prose-blockquote:text-slate-500 public-content"
              />
            ) : (
              <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
                <p className="text-slate-400 font-body italic">
                  Content for this lesson is coming soon.
                </p>
              </div>
            )}

            {/* Prev / Next navigation */}
            <LessonNav
              prev={prev}
              next={next}
              seriesId={seriesId}
              currentIndex={currentIndex + 1}
              totalLessons={allLessons.length}
            />
          </article>
        </div>
      </div>
      <BackToTop />
    </>
  )
}
