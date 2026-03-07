import { getPosts, getSeries } from '@/lib/db'
import PostForm from '@/components/admin/PostForm'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [allPosts, allSeries] = await Promise.all([getPosts(), getSeries()])
  const post = allPosts.find(p => p.id === id)
  if (!post) notFound()

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Edit Post</h1>
      <PostForm initialData={post} allSeries={allSeries} />
    </div>
  )
}
