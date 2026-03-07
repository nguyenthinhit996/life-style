import { getSeries } from '@/lib/db'
import SeriesForm from '@/components/admin/SeriesForm'
import { notFound } from 'next/navigation'

export default async function EditSeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const series = await getSeries()
  const item = series.find(s => s.id === id)
  if (!item) notFound()

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Edit Series</h1>
      <SeriesForm initialData={item} />
    </div>
  )
}
