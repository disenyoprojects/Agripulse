import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ilagay ang kasalukuyang password.'),
    newPassword: z.string().min(8, 'Dapat 8 karakter o higit ang bagong password.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Hindi magkatugma ang bagong password.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'Dapat iba ang bagong password sa luma.',
    path: ['newPassword'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
