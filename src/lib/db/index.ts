/**
 * Auto-selects the DB provider at runtime:
 *   - Firebase Firestore (Admin SDK) → when FIREBASE_PROJECT_ID is set
 *   - Mock JSON files                → fallback (local dev with no Firebase config)
 *
 * No manual switching needed. Add service account vars to .env.local and restart.
 */
import type * as DBType from './mock'

const useFirebase = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
)

// eslint-disable-next-line @typescript-eslint/no-require-imports
const db: typeof DBType = useFirebase ? require('./firebase') : require('./mock')

export const getSeries           = db.getSeries
export const getPublishedSeries  = db.getPublishedSeries
export const getSeriesById       = db.getSeriesById
export const createSeries        = db.createSeries
export const updateSeries        = db.updateSeries
export const deleteSeries        = db.deleteSeries

export const getChapters         = db.getChapters
export const getChaptersBySeries = db.getChaptersBySeries
export const createChapter       = db.createChapter
export const updateChapter       = db.updateChapter
export const deleteChapter       = db.deleteChapter

export const getPosts            = db.getPosts
export const getPublishedPosts   = db.getPublishedPosts
export const getLatestPosts      = db.getLatestPosts
export const getPostBySlug       = db.getPostBySlug
export const getPostById         = db.getPostById
export const getLessonsByChapter = db.getLessonsByChapter
export const getBlogPosts        = db.getBlogPosts
export const getPostsByCategory  = db.getPostsByCategory
export const getSeriesTree       = db.getSeriesTree
export const createPost          = db.createPost
export const updatePost          = db.updatePost
export const deletePost          = db.deletePost

export const getUserByEmail      = db.getUserByEmail

export const getAbout            = db.getAbout
export const updateAbout         = db.updateAbout
