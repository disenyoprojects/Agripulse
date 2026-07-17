import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissionSchema } from '@/lib/validators/submission.schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = submissionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const {
      farmerName,
      municipality,
      barangay,
      contactNumber,
      ...submissionData
    } = parsed.data

    const referenceNumber = `AP${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`

    let farmer = contactNumber
      ? await db.farmer.findUnique({ where: { contactNumber } })
      : await db.farmer.findFirst({ where: { fullName: farmerName, barangay } })

    if (!farmer) {
      farmer = await db.farmer.create({
        data: { fullName: farmerName, municipality, barangay, contactNumber },
      })
    }

    await db.submission.create({
      data: {
        ...submissionData,
        farmerId: farmer.id,
        referenceNumber,
        pointsEarned: 10,
        plantingDate: new Date(submissionData.plantingDate),
        harvestDate: new Date(submissionData.harvestDate),
      },
    })

    return NextResponse.json({ success: true, referenceNumber })
  } catch (error) {
    console.error('Farmer submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Submission failed. Please try again.' },
      { status: 500 }
    )
  }
}
