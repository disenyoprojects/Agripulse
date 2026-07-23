import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissionSchema } from '@/lib/validators/submission.schema'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'
import { assertAllowedFile } from '@/lib/file-validation'
import {
  generateReferenceNumber,
  resolveFarmerAction,
  isUniqueViolation,
} from '@/lib/submission-helpers'

const MAX_REFERENCE_ATTEMPTS = 3

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

    // Only dedupe by the unique contact number — never by name+barangay, which
    // would merge two different farmers who share a name. Without a contact
    // number we always create a fresh record. On reuse we leave the existing
    // farmer's identity fields untouched (an anonymous submission shouldn't
    // silently rewrite someone else's stored name/location).
    const existing = contactNumber
      ? await db.farmer.findUnique({ where: { contactNumber }, select: { id: true } })
      : null

    const decision = resolveFarmerAction({ contactNumber, existing })
    const farmerId =
      decision.action === 'reuse'
        ? decision.id
        : (
            await db.farmer.create({
              data: { fullName: farmerName, municipality, barangay, contactNumber },
              select: { id: true },
            })
          ).id

    // `referenceNumber` is unique; a same-millisecond collision throws P2002.
    // Retry with a fresh number a few times rather than failing a submission
    // that would succeed on the next attempt.
    let referenceNumber = ''
    for (let attempt = 1; ; attempt++) {
      referenceNumber = generateReferenceNumber()
      try {
        await db.submission.create({
          data: {
            ...submissionData,
            farmerId,
            referenceNumber,
            pointsEarned: 0,
            plantingDate: new Date(submissionData.plantingDate),
            harvestDate: new Date(submissionData.harvestDate),
            photoData,
            photoMime,
          },
        })
        break
      } catch (error) {
        if (isUniqueViolation(error, 'referenceNumber') && attempt < MAX_REFERENCE_ATTEMPTS) {
          continue
        }
        throw error
      }
    }

    return NextResponse.json({ success: true, referenceNumber })
  } catch (error) {
    console.error('Farmer submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Submission failed. Please try again.' },
      { status: 500 }
    )
  }
}
