import { db } from '@/lib/db'

export async function getSubmissionCount(): Promise<number> {
  return db.submission.count()
}

export async function getCropBreakdown(limit = 8) {
  return db.submission.groupBy({
    by: ['cropName'],
    _count: { cropName: true },
    _sum: { farmSizeHectares: true },
    _max: { harvestDate: true },
    orderBy: { _count: { cropName: 'desc' } },
    take: limit,
  })
}

export async function getTotalHectares(): Promise<number> {
  const result = await db.submission.aggregate({
    _sum: { farmSizeHectares: true },
  })
  return Number(result._sum.farmSizeHectares ?? 0)
}

export async function getWeeklySubmissions() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return db.submission.findMany({
    where: { submittedAt: { gte: sevenDaysAgo } },
    select: { submittedAt: true },
    orderBy: { submittedAt: 'asc' },
  })
}

export async function getHarvestSubmissions() {
  return db.submission.findMany({
    select: { harvestDate: true, farmSizeHectares: true },
  })
}

export function buildWeeklyChartData(
  weeklySubmissions: Array<{ submittedAt: Date }>
) {
  const labels: string[] = []
  const values: number[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }))
    values.push(
      weeklySubmissions.filter((s) => {
        const sd = new Date(s.submittedAt)
        return (
          sd.getFullYear() === d.getFullYear() &&
          sd.getMonth() === d.getMonth() &&
          sd.getDate() === d.getDate()
        )
      }).length
    )
  }

  return { labels, values }
}

export function buildHarvestTimeline(
  harvestSubmissions: Array<{ harvestDate: Date; farmSizeHectares: unknown }>
) {
  const today = new Date()
  const byMonth = new Map<string, number>()

  for (let i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
    byMonth.set(d.toLocaleDateString('en-US', { month: 'short' }), 0)
  }

  for (const s of harvestSubmissions) {
    const label = new Date(s.harvestDate).toLocaleDateString('en-US', {
      month: 'short',
    })
    if (byMonth.has(label)) {
      byMonth.set(
        label,
        (byMonth.get(label) ?? 0) + Number(s.farmSizeHectares ?? 0)
      )
    }
  }

  return {
    labels: [...byMonth.keys()],
    values: [...byMonth.values()].map((v) => Math.round(v * 10) / 10),
  }
}
