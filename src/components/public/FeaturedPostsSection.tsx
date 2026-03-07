import Link from 'next/link'
import { getBlogPosts } from '@/lib/db'
import PostCard from './PostCard'

export default async function FeaturedPostsSection() {
  const posts = await getBlogPosts()
  const featured = posts.slice(0, 3)

  if (featured.length === 0) return null

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Latest Posts
            </h2>
            <p className="mt-1 text-white/40 font-body text-sm">
              Fresh articles from the blog
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-mono text-violet-400 hover:text-violet-300 transition-colors hidden sm:block"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="text-sm font-mono text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all posts →
          </Link>
        </div>
      </div>
    </section>
  )
}
