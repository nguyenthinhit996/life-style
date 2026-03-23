import Link from 'next/link'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
}

const categoryColors: Record<string, string> = {
  IT: 'bg-violet-100 text-violet-700',
  ENGLISH: 'bg-cyan-100 text-cyan-700',
  LIFESTYLE: 'bg-emerald-100 text-emerald-700',
}

const categoryLabels: Record<string, string> = {
  IT: 'IT',
  ENGLISH: 'English',
  LIFESTYLE: 'Lifestyle',
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl bg-white border border-slate-200 hover:border-violet-300 overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/8"
    >
      {post.coverImage ? (
        <div className="aspect-video overflow-hidden bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-violet-50 to-white" />
      )}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          {post.category && (
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-full ${categoryColors[post.category] ?? 'bg-slate-100 text-slate-500'}`}
            >
              {categoryLabels[post.category] ?? post.category}
            </span>
          )}
          {post.readTime > 0 && (
            <span className="text-xs font-mono text-slate-400">{post.readTime} min read</span>
          )}
        </div>
        <h3 className="font-display text-base font-semibold text-slate-800 group-hover:text-violet-600 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-slate-500 font-body line-clamp-3 flex-1 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : ''}
          </span>
          <span className="group-hover:text-violet-600 transition-colors">Read →</span>
        </div>
      </div>
    </Link>
  )
}
