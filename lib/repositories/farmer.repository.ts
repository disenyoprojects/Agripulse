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

export async function getAllFarmersWithStats() {
  const farmers = await db.farmer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      submissions: {
        select: { pointsEarned: true, status: true },
      },
    },
  })

  return farmers.map((f) => ({
    ...f,
    totalSubmissions: f.submissions.length,
    pending: f.submissions.filter((s) => s.status === 'PENDING').length,
    verified: f.submissions.filter((s) => s.status === 'VERIFIED').length,
    totalPoints: f.submissions.reduce((sum, s) => sum + s.pointsEarned, 0),
  }))
}

export async function getFarmerWithSubmissions(id: string) {
  return db.farmer.findUnique({
    where: { id },
    include: {
      submissions: {
        orderBy: { submittedAt: 'desc' },
        select: {
          id: true,
          referenceNumber: true,
          cropName: true,
          cropCategory: true,
          plantingDate: true,
          harvestDate: true,
          farmSizeHectares: true,
          pointsEarned: true,
          status: true,
          submittedAt: true,
          photoMime: true,
        },
      },
      attachments: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fileName: true,
          mimeType: true,
          size: true,
          createdAt: true,
        },
      },
    },
  })
}

export async function getTopFarmersByPoints(limit = 10) {
  const farmers = await db.farmer.findMany({
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
