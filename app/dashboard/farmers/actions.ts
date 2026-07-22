'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import type { FarmerStatus } from '@/app/generated/prisma/client'

async function setFarmerStatus(farmerId: string, status: FarmerStatus) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  await db.farmer.update({
    where: { id: farmerId },
    data: {
      status,
      verifiedAt: status === 'APPROVED' ? new Date() : null,
    },
  })

  revalidatePath('/dashboard/farmers')
  revalidatePath(`/dashboard/farmers/${farmerId}`)
}

export async function approveFarmer(farmerId: string) {
  await setFarmerStatus(farmerId, 'APPROVED')
}

export async function rejectFarmer(farmerId: string) {
  await setFarmerStatus(farmerId, 'REJECTED')
}

// Hard delete — cascades to the farmer's submissions and attachments
// (onDelete: Cascade in the schema). Irreversible.
export async function deleteFarmer(farmerId: string) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  await db.farmer.delete({ where: { id: farmerId } })

  revalidatePath('/dashboard/farmers')
}
