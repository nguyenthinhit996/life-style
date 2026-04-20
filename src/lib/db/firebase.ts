/**
 * Firestore data layer — Firebase Admin SDK (server-side only).
 * Runs exclusively in Next.js Server Components / Route Handlers.
 * Uses a service account to bypass Firestore security rules.
 *
 * Prerequisites:
 *  1. Create a Firebase project at https://console.firebase.google.com
 *  2. Enable Firestore (Native mode)
 *  3. Go to Project Settings → Service Accounts → Generate new private key
 *  4. Add these vars to .env.local (never expose to the client):
 *       FIREBASE_PROJECT_ID=your-project-id
 *       FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
 *       FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *  5. Run the seed script:  node scripts/seed-firestore.mjs
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import type { Series, Chapter, Post, User } from '@/types'

// ── Firebase Admin init (singleton) ──────────────────────
function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0]
  return initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Newlines in the private key are escaped in env vars
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore(getAdminApp())

// ── Helpers ───────────────────────────────────────────────
function toDoc<T>(snap: DocumentSnapshot | QueryDocumentSnapshot): T {
  return { id: snap.id, ...snap.data() } as T
}

// ── Series ────────────────────────────────────────────────
export async function getSeries(): Promise<Series[]> {
  const snap = await db.collection('series').get()
  return snap.docs.map(d => toDoc<Series>(d))
}

export async function getPublishedSeries(): Promise<Series[]> {
  const snap = await db.collection('series')
    .where('published', '==', true)
    .orderBy('order', 'asc')
    .get()
  return snap.docs.map(d => toDoc<Series>(d))
}

export async function getSeriesById(id: string): Promise<Series | undefined> {
  const snap = await db.collection('series').doc(id).get()
  if (!snap.exists) return undefined
  return toDoc<Series>(snap)
}

export async function createSeries(data: Omit<Series, 'id'>): Promise<Series> {
  const now = new Date().toISOString()
  const doc_data = {
    ...data,
    order: data.order ?? 0,
    totalChapters: data.totalChapters ?? 0,
    totalLessons: data.totalLessons ?? 0,
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
  }
  const ref = await db.collection('series').add(doc_data)
  return { id: ref.id, ...doc_data }
}

export async function updateSeries(id: string, data: Partial<Series>): Promise<Series | null> {
  const ref = db.collection('series').doc(id)
  const snap = await ref.get()
  if (!snap.exists) return null
  await ref.update(data)
  return { id, ...snap.data(), ...data } as Series
}

export async function deleteSeries(id: string): Promise<boolean> {
  const ref = db.collection('series').doc(id)
  const snap = await ref.get()
  if (!snap.exists) return false
  await ref.delete()
  return true
}

// ── Chapters ──────────────────────────────────────────────
export async function getChapters(): Promise<Chapter[]> {
  const snap = await db.collection('chapters').get()
  return snap.docs.map(d => toDoc<Chapter>(d))
}

export async function getChaptersBySeries(seriesId: string): Promise<Chapter[]> {
  const snap = await db.collection('chapters')
    .where('seriesId', '==', seriesId)
    .orderBy('order', 'asc')
    .get()
  return snap.docs.map(d => toDoc<Chapter>(d))
}

export async function createChapter(data: Omit<Chapter, 'id'>): Promise<Chapter> {
  const doc_data = {
    ...data,
    order: data.order ?? 0,
    totalLessons: data.totalLessons ?? 0,
  }
  const ref = await db.collection('chapters').add(doc_data)
  return { id: ref.id, ...doc_data }
}

export async function updateChapter(id: string, data: Partial<Chapter>): Promise<Chapter | null> {
  const ref = db.collection('chapters').doc(id)
  const snap = await ref.get()
  if (!snap.exists) return null
  await ref.update(data)
  return { id, ...snap.data(), ...data } as Chapter
}

export async function deleteChapter(id: string): Promise<boolean> {
  const ref = db.collection('chapters').doc(id)
  const snap = await ref.get()
  if (!snap.exists) return false
  await ref.delete()
  return true
}

// ── Posts / Lessons ───────────────────────────────────────
export async function getPosts(): Promise<Post[]> {
  const snap = await db.collection('posts').get()
  return snap.docs.map(d => toDoc<Post>(d))
}

export async function getPublishedPosts(): Promise<Post[]> {
  const snap = await db.collection('posts').where('published', '==', true).get()
  return snap.docs.map(d => toDoc<Post>(d))
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const snap = await db.collection('posts').where('slug', '==', slug).get()
  if (snap.empty) return undefined
  return toDoc<Post>(snap.docs[0])
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const snap = await db.collection('posts').doc(id).get()
  if (!snap.exists) return undefined
  return toDoc<Post>(snap)
}

export async function getLessonsByChapter(chapterId: string): Promise<Post[]> {
  const snap = await db.collection('posts')
    .where('chapterId', '==', chapterId)
    .where('type', '==', 'lesson')
    .get()
  return snap.docs
    .map(d => toDoc<Post>(d))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export async function getBlogPosts(): Promise<Post[]> {
  const snap = await db.collection('posts')
    .where('type', '==', 'blog')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .get()
  return snap.docs.map(d => toDoc<Post>(d))
}

export async function getLatestPosts(limit = 6): Promise<Post[]> {
  const snap = await db.collection('posts').where('published', '==', true).get()
  return snap.docs
    .map(d => toDoc<Post>(d))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const snap = await db.collection('posts')
    .where('category', '==', category)
    .where('published', '==', true)
    .get()
  return snap.docs.map(d => toDoc<Post>(d))
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

export async function createPost(data: Omit<Post, 'id'>): Promise<Post> {
  const now = new Date().toISOString()
  const doc_data = {
    ...data,
    order: data.order ?? 0,
    tags: data.tags ?? [],
    published: data.published ?? false,
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
  }
  const ref = await db.collection('posts').add(doc_data)
  return { id: ref.id, ...doc_data }
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
  const ref = db.collection('posts').doc(id)
  const snap = await ref.get()
  if (!snap.exists) return null
  await ref.update(data)
  return { id, ...snap.data(), ...data } as Post
}

export async function deletePost(id: string): Promise<boolean> {
  const ref = db.collection('posts').doc(id)
  const snap = await ref.get()
  if (!snap.exists) return false
  await ref.delete()
  return true
}

// ── Auth ──────────────────────────────────────────────────
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const snap = await db.collection('users').where('email', '==', email).get()
  if (snap.empty) return undefined
  return toDoc<User>(snap.docs[0])
}

// ── About ─────────────────────────────────────────────────
type About = {
  bio: string
  skills: string[]
  social: { github: string; linkedin: string; twitter: string }
}

export async function getAbout(): Promise<About> {
  const snap = await db.collection('about').doc('main').get()
  if (!snap.exists) {
    return { bio: '', skills: [], social: { github: '', linkedin: '', twitter: '' } }
  }
  return snap.data() as About
}

export async function updateAbout(data: About): Promise<void> {
  await db.collection('about').doc('main').set(data, { merge: true })
}
