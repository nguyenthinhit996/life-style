import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAbout } from '@/lib/db'

export async function GET() {
  const about = await getAbout()
  return NextResponse.json(about)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // TODO Phase 7: persist to Firestore
  return NextResponse.json(body)
}
