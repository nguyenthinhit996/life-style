import { getSeries } from '@/lib/db'
import Link from 'next/link'
import Badge from '@/components/admin/Badge'

export default async function AdminSeriesPage() {
  const series = await getSeries()
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Series</h1>
        <Link
          href="/admin/series/new"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-700"
        >
          + New Series
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Icon + Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Chapters</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {series.map(s => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-white">{s.icon} {s.title}</td>
                <td className="px-4 py-3 text-slate-400">{s.category}</td>
                <td className="px-4 py-3 text-slate-400">{s.level}</td>
                <td className="px-4 py-3 text-slate-400">{s.totalChapters}</td>
                <td className="px-4 py-3">
                  <Badge variant={s.published ? 'green' : 'amber'}>
                    {s.published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/series/${s.id}/edit`}
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
    </div>
  )
}
