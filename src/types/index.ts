export type Series = {
  id: string
  title: string
  slug: string
  description: string
  category: 'IT' | 'ENGLISH' | 'LIFESTYLE'
  tags: string[]
  icon: string
  color: 'blue' | 'yellow' | 'green' | 'violet' | 'teal' | 'orange' | 'cyan'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  totalChapters: number
  totalLessons: number
  published: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export type Chapter = {
  id: string
  seriesId: string
  title: string
  description: string
  order: number
  totalLessons: number
}

export type Post = {
  id: string
  type: 'lesson' | 'blog'
  seriesId: string | null
  chapterId: string | null
  title: string
  slug: string
  excerpt: string
  content: string          // HTML from TipTap
  icon?: string
  coverImage?: string
  category?: 'IT' | 'ENGLISH' | 'LIFESTYLE'
  tags?: string[]
  order: number | null
  published: boolean
  readTime: number         // minutes
  createdAt: string
  updatedAt?: string
}

export type User = {
  id: string
  email: string
  password: string         // bcrypt hash
  name: string
  role: 'admin'
  createdAt: string
}

// Useful composite type for the tutorial tree view
export type SeriesWithChapters = Series & {
  chapters: (Chapter & { lessons: Post[] })[]
}
