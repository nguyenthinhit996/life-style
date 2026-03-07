'use client'

import { useState, useMemo } from 'react'
import type { Series, Post } from '@/types'
import SeriesCard from './SeriesCard'
import PostCard from './PostCard'
import { cn } from '@/lib/utils'

type Category = 'ALL' | 'IT' | 'ENGLISH' | 'LIFESTYLE'

interface Props {
  seriesWithCount: { series: Series; lessonCount: number }[]
  posts: Post[]
}

const categories: { value: Category; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'IT', label: 'IT & Code' },
  { value: 'ENGLISH', label: 'English' },
  { value: 'LIFESTYLE', label: 'Lifestyle' },
]

export default function BlogListingClient({ seriesWithCount, posts }: Props) {
  const [category, setCategory] = useState<Category>('ALL')
  const [search, setSearch] = useState('')

  const filteredSeries = useMemo(() => {
    return seriesWithCount.filter(({ series }) => {
      const matchCat = category === 'ALL' || series.category === category
      const matchSearch =
        !search ||
        series.title.toLowerCase().includes(search.toLowerCase()) ||
        (series.description ?? '').toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [seriesWithCount, category, search])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCat = category === 'ALL' || post.category === category
      const matchSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        (post.excerpt ?? '').toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [posts, category, search])

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Blog</h1>
          <p className="mt-3 text-white/50 font-body">
            Tutorial series, lessons, and standalone articles on Code, English, and Life.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-mono transition-colors duration-150',
                  category === c.value
                    ? 'bg-violet-600 text-white'
                    : 'bg-[#0C1524] border border-white/10 text-white/60 hover:text-white hover:border-white/30',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search series & posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 px-4 py-2 rounded-xl bg-[#0C1524] border border-white/10 text-white/80 placeholder-white/30 text-sm font-body focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>

        {/* Tutorial Series */}
        {filteredSeries.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Tutorial Series
              <span className="ml-2 text-sm font-mono text-white/30 font-normal">
                ({filteredSeries.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeries.map(({ series, lessonCount }) => (
                <SeriesCard key={series.id} series={series} lessonCount={lessonCount} />
              ))}
            </div>
          </section>
        )}

        {/* Blog Posts */}
        {filteredPosts.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Blog Posts
              <span className="ml-2 text-sm font-mono text-white/30 font-normal">
                ({filteredPosts.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {filteredSeries.length === 0 && filteredPosts.length === 0 && (
          <div className="text-center py-24 text-white/40 font-body">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg">No results found for &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => { setSearch(''); setCategory('ALL') }}
              className="mt-4 text-sm text-violet-400 hover:text-violet-300 font-mono transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
