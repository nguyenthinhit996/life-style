import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostBySlug, getPostsByCategory } from '@/lib/db'
import ReadingProgressBar from '@/components/public/ReadingProgressBar'
import PostCard from '@/components/public/PostCard'
import BackToTop from '@/components/public/BackToTop'
import ShareButton from '@/components/public/ShareButton'
import { applyHighlighting } from '@/lib/highlight'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — Life-Style`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
    },
  }
}

const categoryColors: Record<string, string> = {
  IT: 'bg-violet-500/20 text-violet-300',
  ENGLISH: 'bg-cyan-500/20 text-cyan-300',
  LIFESTYLE: 'bg-emerald-500/20 text-emerald-300',
}
const categoryLabels: Record<string, string> = {
  IT: 'IT',
  ENGLISH: 'English',
  LIFESTYLE: 'Lifestyle',
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || !post.published || post.type !== 'blog') notFound()

  // Related posts (same category, excluding this one)
  const related = post.category
    ? (await getPostsByCategory(post.category))
        .filter((p) => p.id !== post.id && p.type === 'blog')
        .slice(0, 3)
    : []

  return (
    <>
      <ReadingProgressBar />
      <div className="min-h-screen pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm font-mono text-white/30" aria-label="Breadcrumb">
            <Link href="/blog" className="hover:text-white/60 transition-colors">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/60 truncate">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {post.category && (
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-full ${categoryColors[post.category] ?? 'bg-white/10 text-white/60'}`}
                >
                  {categoryLabels[post.category] ?? post.category}
                </span>
              )}
              {post.readTime > 0 && (
                <span className="text-xs font-mono text-white/30">
                  {post.readTime} min read
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>

            {post.createdAt && (
              <time className="mt-4 block text-sm font-mono text-white/30">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}

            {post.excerpt && (
              <p className="mt-6 text-lg text-white/60 font-body leading-relaxed border-l-2 border-violet-500 pl-5">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Cover image */}
          {post.coverImage && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          {post.content ? (
            <div
              className="prose prose-invert prose-headings:font-display prose-p:font-body prose-code:font-mono max-w-none prose-p:text-white/70 prose-headings:text-white prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline prose-code:bg-[#111E34] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl prose-blockquote:border-violet-500 prose-blockquote:text-white/60 public-content"
              dangerouslySetInnerHTML={{ __html: applyHighlighting(post.content) }}
            />
          ) : (
            <p className="text-white/40 font-body italic">Content coming soon.</p>
          )}

          {/* Share */}
          <div className="mt-16 pt-8 border-t border-white/10 flex items-center gap-4">
            <span className="text-sm font-mono text-white/40">Share:</span>
            <ShareButton />
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 mt-20">
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
      <BackToTop />
    </>
  )
}
