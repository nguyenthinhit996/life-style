'use client'
import { useState, useEffect } from 'react'
import type { Series, Chapter } from '@/types'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function AdminChaptersPage() {
  const [series, setSeries]         = useState<Series[]>([])
  const [seriesId, setSeriesId]     = useState('')
  const [chapters, setChapters]     = useState<Chapter[]>([])
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editTitle, setEditTitle]   = useState('')
  const [confirmId, setConfirmId]   = useState<string | null>(null)
  const [showAdd, setShowAdd]       = useState(false)
  const [newTitle, setNewTitle]     = useState('')
  const [newOrder, setNewOrder]     = useState(1)

  useEffect(() => {
    fetch('/api/series').then(r => r.json()).then(setSeries)
  }, [])

  useEffect(() => {
    if (!seriesId) { setChapters([]); return }
    fetch(`/api/chapters?seriesId=${seriesId}`).then(r => r.json()).then(data => {
      setChapters(data)
      setNewOrder((data.length ?? 0) + 1)
    })
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

  async function handleDelete(id: string) {
    await fetch(`/api/chapters/${id}`, { method: 'DELETE' })
    setConfirmId(null)
    setChapters(prev => prev.filter(c => c.id !== id))
  }

  async function handleAddChapter() {
    if (!newTitle.trim() || !seriesId) return
    const res = await fetch('/api/chapters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.trim(),
        seriesId,
        order: newOrder,
        totalLessons: 0,
      }),
    })
    const created = await res.json()
    setChapters(prev => [...prev, created].sort((a, b) => a.order - b.order))
    setNewTitle('')
    setNewOrder(prev => prev + 1)
    setShowAdd(false)
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

      {seriesId && (
        <>
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
                      <td className="px-4 py-3 text-slate-400">{ch.totalLessons ?? 0}</td>
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
                          <>
                            <button
                              onClick={() => startEdit(ch)}
                              className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setConfirmId(ch.id)}
                              className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Chapter */}
          {showAdd ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <input
                autoFocus
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddChapter()}
                placeholder="Chapter title…"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500"
              />
              <input
                type="number"
                value={newOrder}
                onChange={e => setNewOrder(Number(e.target.value))}
                className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                min={1}
              />
              <button
                onClick={handleAddChapter}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 rounded-lg border border-dashed border-white/15 px-5 py-2.5 text-sm text-slate-500 transition hover:border-violet-500/50 hover:text-violet-400"
            >
              + Add Chapter
            </button>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!confirmId}
        message="Delete this chapter? This cannot be undone."
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  )
}
