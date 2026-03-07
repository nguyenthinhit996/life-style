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

// ── Post mutations (in-memory until Phase 7 Firestore) ────
export async function createPost(data: Omit<Post, 'id'>): Promise<Post> {
  const post: Post = { id: Date.now().toString(), ...data } as Post
  posts.push(post)
  return post
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) return null
  posts[idx] = { ...posts[idx], ...data, id }
  return posts[idx]
}

export async function deletePost(id: string): Promise<boolean> {
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) return false
  posts.splice(idx, 1)
  return true
}

export async function getPostById(id: string): Promise<Post | undefined> {
  return posts.find(p => p.id === id)
}

// ── Series mutations ─────────────────────────────────────
export async function createSeries(data: Omit<Series, 'id'>): Promise<Series> {
  const item: Series = { id: Date.now().toString(), ...data } as Series
  series.push(item)
  return item
}

export async function updateSeries(id: string, data: Partial<Series>): Promise<Series | null> {
  const idx = series.findIndex(s => s.id === id)
  if (idx === -1) return null
  series[idx] = { ...series[idx], ...data, id }
  return series[idx]
}

export async function deleteSeries(id: string): Promise<boolean> {
  const idx = series.findIndex(s => s.id === id)
  if (idx === -1) return false
  series.splice(idx, 1)
  return true
}

// ── Chapter mutations ─────────────────────────────────────
export async function createChapter(data: Omit<Chapter, 'id'>): Promise<Chapter> {
  const item: Chapter = { id: Date.now().toString(), ...data } as Chapter
  chapters.push(item)
  return item
}

export async function updateChapter(id: string, data: Partial<Chapter>): Promise<Chapter | null> {
  const idx = chapters.findIndex(c => c.id === id)
  if (idx === -1) return null
  chapters[idx] = { ...chapters[idx], ...data, id }
  return chapters[idx]
}

export async function deleteChapter(id: string): Promise<boolean> {
  const idx = chapters.findIndex(c => c.id === id)
  if (idx === -1) return false
  chapters.splice(idx, 1)
  return true
}

// ── Auth ──────────────────────────────────────────────────
export async function getUserByEmail(email: string): Promise<User | undefined> {
  return users.find(u => u.email === email)
}

// ── Chapters (all) ────────────────────────────────────────
export async function getChapters(): Promise<Chapter[]> {
  return chapters
}

// ── About (mutable in-memory store) ───────────────────────
let aboutStore = { ...aboutData }

export async function getAbout() {
  return aboutStore
}

export async function updateAbout(data: typeof aboutData) {
  aboutStore = { ...aboutStore, ...data }
  return aboutStore
}
