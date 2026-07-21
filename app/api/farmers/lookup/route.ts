import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone')?.trim()

  if (!phone) {
    return NextResponse.json({ found: false })
  }

  try {
    const farmer = await db.farmer.findUnique({
      where: { contactNumber: phone },
      select: { fullName: true, municipality: true, barangay: true },
    })

    if (!farmer) {
      return NextResponse.json({ found: false })
    }

    return NextResponse.json({
      found: true,
      fullName: farmer.fullName,
      municipality: farmer.municipality,
      barangay: farmer.barangay,
    })
  } catch (error) {
    console.error('Farmer lookup error:', error)
    return NextResponse.json({ found: false })
  }
}
