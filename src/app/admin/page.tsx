import { getPosts, getSeries, getChapters } from '@/lib/db'
import Link from 'next/link'
import Badge from '@/components/admin/Badge'

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, accentFrom,
}: {
  label: string
  value: number
  sub: string
  accentFrom: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0C1220]">
      <div className={`h-px bg-gradient-to-r ${accentFrom} to-transparent`} />
      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">{label}</p>
        <p className="mt-3 font-mono text-5xl font-medium tracking-tight text-white leading-none">{value}</p>
        <p className="mt-2.5 text-xs text-slate-600">{sub}</p>
      </div>
    </div>
  )
}

export default async function AdminDashboard() {
  const [posts, series, chapters] = await Promise.all([getPosts(), getSeries(), getChapters()])

  const published   = posts.filter(p => p.published).length
  const drafts      = posts.length - published
  const blogCount   = posts.filter(p => p.type === 'blog').length
  const lessonCount = posts.filter(p => p.type === 'lesson').length
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.updatedAt ?? b.createdAt).getTime() - new Date(a.updatedAt ?? a.createdAt).getTime())
    .slice(0, 6)

  const seriesWithStats = series.map(s => {
    const sc = chapters.filter(c => c.seriesId === s.id)
    const sl = posts.filter(p => p.type === 'lesson' && sc.some(c => c.id === p.chapterId))
    return { ...s, chapterCount: sc.length, lessonCount: sl.length }
  })

  return (
    <div className="space-y-7">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-[1.6rem] font-bold leading-tight tracking-tight text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">Welcome back, Peter. Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/series/new"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
          >
            + New Series
          </Link>
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow shadow-violet-900/40 transition hover:bg-violet-500"
          >
            + New Post
          </Link>
        </div>
      </div>

      {/* ── Stats bento ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total Posts" value={posts.length}    sub={`${blogCount} blog · ${lessonCount} lessons`} accentFrom="from-violet-500" />
        <StatCard label="Published"   value={published}       sub="live on the site"                             accentFrom="from-emerald-500" />
        <StatCard label="Drafts"      value={drafts}          sub="not yet visible"                              accentFrom="from-amber-500" />
        <StatCard label="Series"      value={series.length}   sub={`${series.filter(s => s.published).length} published`} accentFrom="from-cyan-500" />
        <StatCard label="Chapters"    value={chapters.length} sub={`across ${series.length} series`}            accentFrom="from-blue-500" />
      </div>

      {/* ── Recent Posts (card list, no table) ── */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0C1220]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Posts</h2>
            <p className="mt-0.5 text-[11px] text-slate-600">Most recently updated content</p>
          </div>
          <Link href="/admin/posts" className="text-xs font-medium text-violet-400 transition hover:text-violet-300">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {recentPosts.map(post => (
            <div
              key={post.id}
              className="flex items-center justify-between px-6 py-3.5 transition hover:bg-white/[0.025]"
            >
              <div className="min-w-0 flex-1 pr-4">
                <p className="truncate text-sm font-medium text-white">{post.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-600">{post.category ?? 'Uncategorized'}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <Badge variant={post.type === 'lesson' ? 'cyan' : 'violet'}>{post.type}</Badge>
                <Badge variant={post.published ? 'green' : 'amber'}>
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="ml-1 rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-white/[0.07] hover:text-white"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Series card grid ── */}
      <div>
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Series Overview</h2>
          <Link href="/admin/series" className="text-xs font-medium text-violet-400 transition hover:text-violet-300">
            Manage all →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {seriesWithStats.map(s => (
            <div
              key={s.id}
              className="group rounded-2xl border border-white/[0.06] bg-[#0C1220] p-5 transition hover:border-white/[0.1] hover:bg-[#0F1A2E]"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-3xl leading-none">{s.icon}</span>
                <Badge variant={s.published ? 'green' : 'amber'}>
                  {s.published ? 'Live' : 'Draft'}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold leading-snug text-white">{s.title}</h3>
              <p className="mt-1 text-[11px] text-slate-600">
                {s.chapterCount} chapters · {s.lessonCount} lessons
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${s.published ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="text-[11px] text-slate-600">{s.level}</span>
                </div>
                <Link
                  href={`/admin/series/${s.id}/edit`}
                  className="text-xs font-medium text-slate-600 transition group-hover:text-slate-400 hover:!text-white"
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
