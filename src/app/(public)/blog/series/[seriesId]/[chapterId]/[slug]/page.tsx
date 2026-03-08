import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getSeriesTree, getPostBySlug } from '@/lib/db'
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
                className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors mb-5 flex items-center gap-1 group"
              >
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                {tree.title}
              </Link>
              <h2 className="font-display text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
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
          <article className="flex-1 min-w-0 py-10 pb-20">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm font-mono text-white/30" aria-label="Breadcrumb">
              <Link href="/blog" className="hover:text-white/60 transition-colors">
                Blog
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/blog/series/${seriesId}`}
                className="hover:text-white/60 transition-colors"
              >
                {tree.title}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white/60 truncate">{post.title}</span>
            </nav>

            {/* Mobile: back to series link */}
            <Link
              href={`/blog/series/${seriesId}`}
              className="lg:hidden mb-6 inline-flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-white/60 transition-colors"
            >
              ← {tree.title}
            </Link>

            {/* Lesson header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                {post.readTime > 0 && (
                  <span className="text-xs font-mono text-white/30">
                    {post.readTime} min read
                  </span>
                )}
                <span className="text-xs font-mono text-white/30">
                  Lesson {currentIndex + 1} of {allLessons.length}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-4 text-white/60 font-body text-base leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </header>

            {/* Content */}
            {post.content ? (
              <ContentRenderer
                html={applyHighlighting(post.content)}
                className="prose prose-invert prose-headings:font-display prose-p:font-body prose-code:font-mono max-w-none prose-p:text-white/70 prose-headings:text-white prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline prose-code:bg-[#111E34] prose-code:text-sm prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl prose-blockquote:border-violet-500 prose-blockquote:text-white/60 public-content"
              />
            ) : (
              <div className="rounded-xl bg-[#0C1524] border border-white/10 p-8 text-center">
                <p className="text-white/30 font-body italic">
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
