import seriesData   from '../../../db/series.json'
import chaptersData from '../../../db/chapters.json'
import postsData    from '../../../db/posts.json'
import usersData    from '../../../db/users.json'
import aboutData    from '../../../db/about.json'
import type { Series, Chapter, Post, User } from '@/types'
import fs   from 'fs'
import path from 'path'

// ── DB file paths ─────────────────────────────────────────
const DB = {
  posts:    path.resolve(process.cwd(), 'db/posts.json'),
  series:   path.resolve(process.cwd(), 'db/series.json'),
  chapters: path.resolve(process.cwd(), 'db/chapters.json'),
  about:    path.resolve(process.cwd(), 'db/about.json'),
}

function persist(file: string, data: unknown) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

// ── Shared in-memory store via globalThis ─────────────────
// Next.js runs Server Components and API Routes in separate module registries
// in development. Using globalThis ensures all contexts share the same arrays.
declare global {
  // eslint-disable-next-line no-var
  var _mockSeries:   Series[]   | undefined
  // eslint-disable-next-line no-var
  var _mockChapters: Chapter[]  | undefined
  // eslint-disable-next-line no-var
  var _mockPosts:    Post[]     | undefined
  // eslint-disable-next-line no-var
  var _mockAbout:    typeof aboutData | undefined
}

if (!globalThis._mockSeries)   globalThis._mockSeries   = seriesData   as Series[]
if (!globalThis._mockChapters) globalThis._mockChapters = chaptersData as Chapter[]
if (!globalThis._mockPosts)    globalThis._mockPosts    = postsData    as Post[]
if (!globalThis._mockAbout)    globalThis._mockAbout    = { ...aboutData }

const series   = globalThis._mockSeries
const chapters = globalThis._mockChapters
const posts    = globalThis._mockPosts
const users: User[] = usersData as User[]

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
  persist(DB.posts, posts)
  return post
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) return null
  posts[idx] = { ...posts[idx], ...data, id }
  persist(DB.posts, posts)
  return posts[idx]
}

export async function deletePost(id: string): Promise<boolean> {
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) return false
  posts.splice(idx, 1)
  persist(DB.posts, posts)
  return true
}

export async function getPostById(id: string): Promise<Post | undefined> {
  return posts.find(p => p.id === id)
}

// ── Series mutations ─────────────────────────────────────
export async function createSeries(data: Omit<Series, 'id'>): Promise<Series> {
  const item: Series = { id: Date.now().toString(), ...data } as Series
  series.push(item)
  persist(DB.series, series)
  return item
}

export async function updateSeries(id: string, data: Partial<Series>): Promise<Series | null> {
  const idx = series.findIndex(s => s.id === id)
  if (idx === -1) return null
  series[idx] = { ...series[idx], ...data, id }
  persist(DB.series, series)
  return series[idx]
}

export async function deleteSeries(id: string): Promise<boolean> {
  const idx = series.findIndex(s => s.id === id)
  if (idx === -1) return false
  series.splice(idx, 1)
  persist(DB.series, series)
  return true
}

// ── Chapter mutations ─────────────────────────────────────
export async function createChapter(data: Omit<Chapter, 'id'>): Promise<Chapter> {
  const item: Chapter = { id: Date.now().toString(), ...data } as Chapter
  chapters.push(item)
  persist(DB.chapters, chapters)
  return item
}

export async function updateChapter(id: string, data: Partial<Chapter>): Promise<Chapter | null> {
  const idx = chapters.findIndex(c => c.id === id)
  if (idx === -1) return null
  chapters[idx] = { ...chapters[idx], ...data, id }
  persist(DB.chapters, chapters)
  return chapters[idx]
}

export async function deleteChapter(id: string): Promise<boolean> {
  const idx = chapters.findIndex(c => c.id === id)
  if (idx === -1) return false
  chapters.splice(idx, 1)
  persist(DB.chapters, chapters)
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
export async function getAbout() {
  return globalThis._mockAbout!
}

export async function updateAbout(data: typeof aboutData) {
  globalThis._mockAbout = { ...globalThis._mockAbout!, ...data }
  persist(DB.about, globalThis._mockAbout)
  return globalThis._mockAbout
}
