import { getPosts } from '@/lib/db'
import PostsTable from '@/components/admin/PostsTable'
import Link from 'next/link'

export default async function AdminPostsPage() {
  const posts = await getPosts()
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-700"
        >
          + New Post
        </Link>
      </div>
      <PostsTable posts={posts} />
    </div>
  )
}
