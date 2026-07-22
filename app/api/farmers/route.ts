import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissionSchema } from '@/lib/validators/submission.schema'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'
import { assertAllowedFile } from '@/lib/file-validation'

const MAX_PHOTO_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(request: Request) {
  try {
    const rate = await checkRateLimit(clientKey(request, 'submit'), 5, 60_000)
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Sobra ang bilang ng request. Subukan muli mamaya.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
      )
    }

    // The wizard now sends multipart/form-data: a JSON `payload` field + an optional `photo` file.
    const formData = await request.formData()
    const rawPayload = formData.get('payload')
    if (typeof rawPayload !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing payload.' }, { status: 400 })
    }

    const parsed = submissionSchema.safeParse(JSON.parse(rawPayload))
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Optional crop photo — validate real bytes, not the client-declared type.
    let photoData: Uint8Array<ArrayBuffer> | null = null
    let photoMime: string | null = null
    const photo = formData.get('photo')
    if (photo instanceof File && photo.size > 0) {
      if (photo.size > MAX_PHOTO_BYTES) {
        return NextResponse.json(
          { success: false, error: 'Ang larawan ay dapat 5 MB o mas maliit.' },
          { status: 400 }
        )
      }
      const bytes = new Uint8Array(await photo.arrayBuffer())
      const check = assertAllowedFile(bytes, ['image'])
      if (!check.ok) {
        return NextResponse.json(
          { success: false, error: 'Hindi wastong larawan. Gumamit ng JPG/PNG/WEBP.' },
          { status: 400 }
        )
      }
      photoData = bytes
      photoMime = check.mime
    }

    const { farmerName, municipality, barangay, contactNumber, ...submissionData } = parsed.data

    const referenceNumber = `AP${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`

    let farmer = contactNumber
      ? await db.farmer.findUnique({ where: { contactNumber } })
      : await db.farmer.findFirst({ where: { fullName: farmerName, barangay } })

    if (!farmer) {
      farmer = await db.farmer.create({
        data: { fullName: farmerName, municipality, barangay, contactNumber },
      })
    } else {
      farmer = await db.farmer.update({
        where: { id: farmer.id },
        data: { fullName: farmerName, municipality, barangay },
      })
    }

    await db.submission.create({
      data: {
        ...submissionData,
        farmerId: farmer.id,
        referenceNumber,
        pointsEarned: 0,
        plantingDate: new Date(submissionData.plantingDate),
        harvestDate: new Date(submissionData.harvestDate),
        photoData,
        photoMime,
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
