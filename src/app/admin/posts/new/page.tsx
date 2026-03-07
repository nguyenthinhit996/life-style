import { getSeries } from '@/lib/db'
import PostForm from '@/components/admin/PostForm'

export default async function NewPostPage() {
  const allSeries = await getSeries()
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">New Post</h1>
          <p className="mt-0.5 text-sm text-slate-600">Write and publish a new post or lesson</p>
        </div>
      </div>
      <PostForm allSeries={allSeries} />
    </div>
  )
}
