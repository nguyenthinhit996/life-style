/**
 * Firestore data layer — same function signatures as mock.ts.
 * Switch active provider in src/lib/db/index.ts.
 *
 * Prerequisites:
 *  1. Create a Firebase project at https://console.firebase.google.com
 *  2. Enable Firestore (Native mode)
 *  3. Fill in all NEXT_PUBLIC_FIREBASE_* vars in .env.local
 *  4. Run the seed script:  node scripts/seed-firestore.mjs
 *  5. In src/lib/db/index.ts change the export to './firebase'
 */

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore'
import type { Series, Chapter, Post, User } from '@/types'

// ── Firebase init (singleton) ─────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db  = getFirestore(app)

// ── Helpers ───────────────────────────────────────────────
function toDoc<T>(snap: QueryDocumentSnapshot<DocumentData>): T {
  return { id: snap.id, ...snap.data() } as T
}

// ── Series ────────────────────────────────────────────────
export async function getSeries(): Promise<Series[]> {
  const snap = await getDocs(collection(db, 'series'))
  return snap.docs.map(d => toDoc<Series>(d))
}

export async function getPublishedSeries(): Promise<Series[]> {
  const q = query(
    collection(db, 'series'),
    where('published', '==', true),
    orderBy('order', 'asc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => toDoc<Series>(d))
}

export async function getSeriesById(id: string): Promise<Series | undefined> {
  const snap = await getDoc(doc(db, 'series', id))
  if (!snap.exists()) return undefined
  return { id: snap.id, ...snap.data() } as Series
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
  const ref = await addDoc(collection(db, 'series'), doc_data)
  return { id: ref.id, ...doc_data }
}

export async function updateSeries(id: string, data: Partial<Series>): Promise<Series | null> {
  const ref = doc(db, 'series', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  await updateDoc(ref, data as DocumentData)
  return { id, ...snap.data(), ...data } as Series
}

export async function deleteSeries(id: string): Promise<boolean> {
  const ref = doc(db, 'series', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return false
  await deleteDoc(ref)
  return true
}

// ── Chapters ──────────────────────────────────────────────
export async function getChapters(): Promise<Chapter[]> {
  const snap = await getDocs(collection(db, 'chapters'))
  return snap.docs.map(d => toDoc<Chapter>(d))
}

export async function getChaptersBySeries(seriesId: string): Promise<Chapter[]> {
  const q = query(
    collection(db, 'chapters'),
    where('seriesId', '==', seriesId),
    orderBy('order', 'asc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => toDoc<Chapter>(d))
}

export async function createChapter(data: Omit<Chapter, 'id'>): Promise<Chapter> {
  const doc_data = {
    ...data,
    order: data.order ?? 0,
    totalLessons: data.totalLessons ?? 0,
  }
  const ref = await addDoc(collection(db, 'chapters'), doc_data)
  return { id: ref.id, ...doc_data }
}

export async function updateChapter(id: string, data: Partial<Chapter>): Promise<Chapter | null> {
  const ref = doc(db, 'chapters', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  await updateDoc(ref, data as DocumentData)
  return { id, ...snap.data(), ...data } as Chapter
}

export async function deleteChapter(id: string): Promise<boolean> {
  const ref = doc(db, 'chapters', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return false
  await deleteDoc(ref)
  return true
}

// ── Posts / Lessons ───────────────────────────────────────
export async function getPosts(): Promise<Post[]> {
  const snap = await getDocs(collection(db, 'posts'))
  return snap.docs.map(d => toDoc<Post>(d))
}

export async function getPublishedPosts(): Promise<Post[]> {
  const q = query(collection(db, 'posts'), where('published', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => toDoc<Post>(d))
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const q = query(collection(db, 'posts'), where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return undefined
  return toDoc<Post>(snap.docs[0])
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const snap = await getDoc(doc(db, 'posts', id))
  if (!snap.exists()) return undefined
  return { id: snap.id, ...snap.data() } as Post
}

export async function getLessonsByChapter(chapterId: string): Promise<Post[]> {
  const q = query(
    collection(db, 'posts'),
    where('chapterId', '==', chapterId),
    where('type', '==', 'lesson'),
    orderBy('order', 'asc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => toDoc<Post>(d))
}

export async function getBlogPosts(): Promise<Post[]> {
  const q = query(
    collection(db, 'posts'),
    where('type', '==', 'blog'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => toDoc<Post>(d))
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const q = query(
    collection(db, 'posts'),
    where('category', '==', category),
    where('published', '==', true),
  )
  const snap = await getDocs(q)
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
  const ref = await addDoc(collection(db, 'posts'), doc_data)
  return { id: ref.id, ...doc_data }
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
  const ref = doc(db, 'posts', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  await updateDoc(ref, data as DocumentData)
  return { id, ...snap.data(), ...data } as Post
}

export async function deletePost(id: string): Promise<boolean> {
  const ref = doc(db, 'posts', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return false
  await deleteDoc(ref)
  return true
}

// ── Auth ──────────────────────────────────────────────────
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const q = query(collection(db, 'users'), where('email', '==', email))
  const snap = await getDocs(q)
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
  const snap = await getDoc(doc(db, 'about', 'main'))
  if (!snap.exists()) {
    return { bio: '', skills: [], social: { github: '', linkedin: '', twitter: '' } }
  }
  return snap.data() as About
}

export async function updateAbout(data: About): Promise<void> {
  await setDoc(doc(db, 'about', 'main'), data, { merge: true })
}
