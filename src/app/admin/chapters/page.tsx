'use client'
import { useState, useEffect } from 'react'
import type { Series, Chapter } from '@/types'

export default function AdminChaptersPage() {
  const [series, setSeries]     = useState<Series[]>([])
  const [seriesId, setSeriesId] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>([])

  useEffect(() => {
    fetch('/api/series').then(r => r.json()).then(setSeries)
  }, [])

  useEffect(() => {
    if (!seriesId) { setChapters([]); return }
    fetch(`/api/chapters?seriesId=${seriesId}`).then(r => r.json()).then(setChapters)
  }, [seriesId])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Chapters</h1>

      <select
        value={seriesId}
        onChange={e => setSeriesId(e.target.value)}
        className="mb-6 select-style max-w-xs"
      >
        <option value="">— Select a series —</option>
        {series.map(s => (
          <option key={s.id} value={s.id}>{s.icon} {s.title}</option>
        ))}
      </select>

      {chapters.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Lessons</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {chapters.map(ch => (
                <tr key={ch.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-slate-400">{ch.order}</td>
                  <td className="px-4 py-3 font-medium text-white">{ch.title}</td>
                  <td className="px-4 py-3 text-slate-400">{ch.totalLessons}</td>
                  <td className="px-4 py-3">
                    <button className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
