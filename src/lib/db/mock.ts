import seriesData   from '../../../db/series.json'
import chaptersData from '../../../db/chapters.json'
import postsData    from '../../../db/posts.json'
import usersData    from '../../../db/users.json'
import aboutData    from '../../../db/about.json'
import type { Series, Chapter, Post, User } from '@/types'

const series: Series[]    = seriesData   as Series[]
const chapters: Chapter[] = chaptersData as Chapter[]
const posts: Post[]       = postsData    as Post[]
const users: User[]       = usersData    as User[]

// ── Series ────────────────────────────────────────────────
export async function getSeries(): Promise<Series[]> {
  return series
}

export async function getPublishedSeries(): Promise<Series[]> {
  return series.filter(s => s.published).sort((a, b) => a.order - b.order)
}

export async function getSeriesById(id: string): Promise<Series | undefined> {
  return series.find(s => s.id === id)
}

// ── Chapters ──────────────────────────────────────────────
export async function getChaptersBySeries(seriesId: string): Promise<Chapter[]> {
  return chapters.filter(c => c.seriesId === seriesId).sort((a, b) => a.order - b.order)
}

// ── Posts / Lessons ───────────────────────────────────────
export async function getPosts(): Promise<Post[]> {
  return posts
}

export async function getPublishedPosts(): Promise<Post[]> {
  return posts.filter(p => p.published)
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return posts.find(p => p.slug === slug)
}

export async function getLessonsByChapter(chapterId: string): Promise<Post[]> {
  return posts
    .filter(p => p.chapterId === chapterId && p.type === 'lesson')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function getBlogPosts(): Promise<Post[]> {
  return posts
    .filter(p => p.type === 'blog' && p.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  return posts.filter(p => p.category === category && p.published)
}

// Full series tree — series + chapters + lessons in one call
export async function getSeriesTree(seriesId: string) {
  const s = await getSeriesById(seriesId)
  if (!s) return null
  const chs = await getChaptersBySeries(seriesId)
  const chaptersWithLessons = await Promise.all(
    chs.map(async ch => ({
      ...ch,
      lessons: await getLessonsByChapter(ch.id),
    }))
  )
  return { ...s, chapters: chaptersWithLessons }
}

// ── Auth ──────────────────────────────────────────────────
export async function getUserByEmail(email: string): Promise<User | undefined> {
  return users.find(u => u.email === email)
}

// ── Chapters (all) ────────────────────────────────────────
export async function getChapters(): Promise<Chapter[]> {
  return chapters
}

// ── About ─────────────────────────────────────────────────
export async function getAbout() {
  return aboutData
}
