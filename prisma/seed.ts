import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('change-me-on-first-login', 12)
  await db.lguUser.upsert({
    where: { email: 'admin@agripulse.gov.ph' },
    update: {},
    create: {
      email: 'admin@agripulse.gov.ph',
      name: 'LGU Admin',
      password,
    },
  })
  console.log('Seed complete — LGU admin: admin@agripulse.gov.ph')
}

main().finally(() => db.$disconnect())
