import { db } from '@/lib/db'

export async function getFarmerCount(): Promise<number> {
  return db.farmer.count()
}

export async function getBarangayBreakdown(limit = 8) {
  return db.farmer.groupBy({
    by: ['barangay'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: limit,
  })
}

export async function getTopFarmersByPoints(limit = 10) {
  const farmers = await db.farmer.findMany({
    take: limit,
    include: {
      submissions: {
        select: {
          pointsEarned: true,
          cropName: true,
          farmSizeHectares: true,
          submittedAt: true,
        },
        orderBy: { submittedAt: 'desc' },
      },
    },
  })

  return farmers
    .map((f) => ({
      ...f,
      totalPoints: f.submissions.reduce((sum, s) => sum + s.pointsEarned, 0),
      submissionCount: f.submissions.length,
      latestCrop: f.submissions[0]?.cropName ?? null,
      totalHectares: f.submissions.reduce(
        (sum, s) => sum + Number(s.farmSizeHectares ?? 0),
        0
      ),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, limit)
}
