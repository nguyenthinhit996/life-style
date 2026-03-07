import { getPosts, getSeries } from '@/lib/db'
import PostForm from '@/components/admin/PostForm'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [allPosts, allSeries] = await Promise.all([getPosts(), getSeries()])
  const post = allPosts.find(p => p.id === id)
  if (!post) notFound()

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Edit Post</h1>
        <p className="mt-0.5 text-sm text-slate-600 truncate">{post.title}</p>
      </div>
      <PostForm initialData={post} allSeries={allSeries} />
    </div>
  )
}
