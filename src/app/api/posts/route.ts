import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPosts } from '@/lib/db'

export async function GET() {
  const posts = await getPosts()
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // TODO Phase 7: write to Firestore
  return NextResponse.json({ ...body, id: Date.now().toString() }, { status: 201 })
}
