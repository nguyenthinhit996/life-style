'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/types'
import Badge from '@/components/admin/Badge'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function PostsTable({ posts }: { posts: Post[] }) {
  const router = useRouter()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    setConfirmId(null)
    router.refresh()
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-white">{post.title}</td>
                <td className="px-4 py-3">
                  <Badge variant={post.type === 'lesson' ? 'cyan' : 'violet'}>
                    {post.type}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-400">{post.category ?? '—'}</td>
                <td className="px-4 py-3">
                  <Badge variant={post.published ? 'green' : 'amber'}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="flex gap-2 px-4 py-3">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmId(post.id)}
                    className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirmId}
        message="Delete this post? This cannot be undone."
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </>
  )
}
