import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@agripulse.gov.ph'
  const plain = process.env.SEED_ADMIN_PASSWORD
  if (!plain) {
    console.warn(
      '⚠️  SEED_ADMIN_PASSWORD not set — using an insecure default. Set it in your env for real deployments.'
    )
  }
  const password = await bcrypt.hash(plain ?? 'change-me-on-first-login', 12)
  await db.lguUser.upsert({
    where: { email },
    update: {},
    create: { email, name: 'LGU Admin', password },
  })
  console.log(`Seed complete — LGU admin: ${email}`)
}

main().finally(() => db.$disconnect())
