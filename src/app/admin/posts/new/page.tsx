import { getSeries } from '@/lib/db'
import PostForm from '@/components/admin/PostForm'

export default async function NewPostPage() {
  const allSeries = await getSeries()
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">New Post</h1>
      <PostForm allSeries={allSeries} />
    </div>
  )
}
