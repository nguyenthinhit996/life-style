'use client'
import { useState, useEffect } from 'react'
import type { Series, Chapter } from '@/types'

export default function AdminChaptersPage() {
  const [series, setSeries]     = useState<Series[]>([])
  const [seriesId, setSeriesId] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    fetch('/api/series').then(r => r.json()).then(setSeries)
  }, [])

  useEffect(() => {
    if (!seriesId) { setChapters([]); return }
    fetch(`/api/chapters?seriesId=${seriesId}`).then(r => r.json()).then(setChapters)
  }, [seriesId])

  function startEdit(ch: Chapter) {
    setEditingId(ch.id)
    setEditTitle(ch.title)
  }

  async function saveEdit(ch: Chapter) {
    await fetch(`/api/chapters/${ch.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ch, title: editTitle }),
    })
    setChapters(prev => prev.map(c => c.id === ch.id ? { ...c, title: editTitle } : c))
    setEditingId(null)
  }

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
                  <td className="px-4 py-3 font-medium text-white">
                    {editingId === ch.id ? (
                      <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveEdit(ch)}
                        className="w-full rounded border border-violet-500 bg-white/5 px-2 py-1 text-sm text-white outline-none"
                        autoFocus
                      />
                    ) : (
                      ch.title
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{ch.totalLessons}</td>
                  <td className="flex gap-2 px-4 py-3">
                    {editingId === ch.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(ch)}
                          className="rounded px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(ch)}
                        className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
                      >
                        Edit
                      </button>
                    )}
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
