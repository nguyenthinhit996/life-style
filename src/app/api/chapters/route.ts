import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getChaptersBySeries, createChapter } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const seriesId = searchParams.get('seriesId')
  if (!seriesId) return NextResponse.json({ error: 'seriesId required' }, { status: 400 })
  const chapters = await getChaptersBySeries(seriesId)
  return NextResponse.json(chapters)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const item = await createChapter(body)
  return NextResponse.json(item, { status: 201 })
}
