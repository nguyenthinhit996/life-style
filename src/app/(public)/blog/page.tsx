import type { Metadata } from 'next'
import { getPublishedSeries, getBlogPosts, getPosts } from '@/lib/db'
import BlogListingClient from '@/components/public/BlogListingClient'

export const metadata: Metadata = {
  title: 'Blog — Life-Style',
  description: 'Tutorial series and blog posts on IT, English, and Lifestyle by Peter.',
}

export default async function BlogPage() {
  const [allSeries, blogPosts, allPosts] = await Promise.all([
    getPublishedSeries(),
    getBlogPosts(),
    getPosts(),
  ])

  const seriesWithCount = allSeries.map((series) => ({
    series,
    lessonCount: allPosts.filter(
      (p) => p.seriesId === series.id && p.type === 'lesson',
    ).length,
  }))

  return <BlogListingClient seriesWithCount={seriesWithCount} posts={blogPosts} />
}
