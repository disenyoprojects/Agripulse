'use server'

import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import { changePasswordSchema } from '@/lib/validators/password.schema'

type ChangePasswordResult = { success: boolean; error?: string }

export async function changePassword(input: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<ChangePasswordResult> {
  try {
    const session = await auth()
    const email = session?.user?.email
    if (!email) return { success: false, error: 'Hindi awtorisado. Mag-login muli.' }

    const parsed = changePasswordSchema.safeParse(input)
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return { success: false, error: first?.message ?? 'Hindi wastong input.' }
    }

    const user = await db.lguUser.findUnique({ where: { email } })
    if (!user) return { success: false, error: 'Hindi mahanap ang account.' }

    const valid = await bcrypt.compare(parsed.data.currentPassword, user.password)
    if (!valid) return { success: false, error: 'Mali ang kasalukuyang password.' }

    const hashed = await bcrypt.hash(parsed.data.newPassword, 10)
    await db.lguUser.update({ where: { id: user.id }, data: { password: hashed } })

    return { success: true }
  } catch (error) {
    console.error('Change password error:', error)
    return { success: false, error: 'May nangyaring mali. Subukan muli.' }
  }
}
