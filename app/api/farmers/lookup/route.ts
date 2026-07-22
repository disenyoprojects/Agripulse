import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone')?.trim()

  if (!phone) {
    return NextResponse.json({ found: false })
  }

  // Throttle to prevent phone-number enumeration / PII harvesting.
  const { allowed, retryAfterSec } = await checkRateLimit(clientKey(request, 'lookup'), 10, 60_000)
  if (!allowed) {
    return NextResponse.json(
      { found: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    )
  }

  try {
    const farmer = await db.farmer.findUnique({
      where: { contactNumber: phone },
      select: {
        fullName: true,
        municipality: true,
        barangay: true,
        status: true,
        _count: { select: { submissions: true } },
      },
    })

    if (!farmer) {
      return NextResponse.json({ found: false })
    }

    return NextResponse.json({
      found: true,
      fullName: farmer.fullName,
      municipality: farmer.municipality,
      barangay: farmer.barangay,
      status: farmer.status,
      submissionCount: farmer._count.submissions,
    })
  } catch (error) {
    console.error('Farmer lookup error:', error)
    return NextResponse.json({ found: false })
  }
}
