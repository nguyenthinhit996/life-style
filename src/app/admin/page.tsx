import { getPosts, getSeries, getChapters } from '@/lib/db'
import Link from 'next/link'
import Badge from '@/components/admin/Badge'

export default async function AdminDashboard() {
  const [posts, series, chapters] = await Promise.all([getPosts(), getSeries(), getChapters()])

  const published   = posts.filter(p => p.published).length
  const drafts      = posts.length - published
  const blogCount   = posts.filter(p => p.type === 'blog').length
  const lessonCount = posts.filter(p => p.type === 'lesson').length
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.updatedAt ?? b.createdAt).getTime() - new Date(a.updatedAt ?? a.createdAt).getTime())
    .slice(0, 6)

  const stats = [
    { label: 'Total Posts',  value: posts.length,    sub: `${blogCount} blog · ${lessonCount} lessons`, color: 'text-violet-400' },
    { label: 'Published',    value: published,        sub: 'live on the site',                           color: 'text-emerald-400' },
    { label: 'Drafts',       value: drafts,           sub: 'not yet visible',                            color: 'text-amber-400' },
    { label: 'Series',       value: series.length,    sub: `${series.filter(s => s.published).length} published`, color: 'text-cyan-400' },
    { label: 'Chapters',     value: chapters.length,  sub: `across ${series.length} series`,             color: 'text-blue-400' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back, Peter. Here's what's happening.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-700"
          >
            + New Post
          </Link>
          <Link
            href="/admin/series/new"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5"
          >
            + New Series
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(({ label, value, sub, color }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`my-1 text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-600">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent posts */}
      <div className="rounded-xl border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold">Recent Posts</h2>
          <Link href="/admin/posts" className="text-xs text-violet-400 hover:text-violet-300">
            View all →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {recentPosts.map(post => (
              <tr key={post.id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-3 font-medium text-white">{post.title}</td>
                <td className="px-5 py-3">
                  <Badge variant={post.type === 'lesson' ? 'cyan' : 'violet'}>{post.type}</Badge>
                </td>
                <td className="px-5 py-3 text-slate-400">{post.category ?? '—'}</td>
                <td className="px-5 py-3">
                  <Badge variant={post.published ? 'green' : 'amber'}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Series overview */}
      <div className="mt-6 rounded-xl border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold">Series Overview</h2>
          <Link href="/admin/series" className="text-xs text-violet-400 hover:text-violet-300">
            Manage →
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {series.map(s => {
            const seriesChapters = chapters.filter(c => c.seriesId === s.id)
            const seriesLessons  = posts.filter(p => p.type === 'lesson' && seriesChapters.some(c => c.id === p.chapterId))
            return (
              <div key={s.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{s.title}</p>
                    <p className="text-xs text-slate-500">{seriesChapters.length} chapters · {seriesLessons.length} lessons</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={s.published ? 'green' : 'amber'}>{s.published ? 'Published' : 'Draft'}</Badge>
                  <Link
                    href={`/admin/series/${s.id}/edit`}
                    className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
