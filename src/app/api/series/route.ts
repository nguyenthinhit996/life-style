import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSeries, createSeries } from '@/lib/db'

export async function GET() {
  const series = await getSeries()
  return NextResponse.json(series)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const item = await createSeries(body)
  return NextResponse.json(item, { status: 201 })
}
