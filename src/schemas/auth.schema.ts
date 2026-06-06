import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(6).max(100),
  examType: z
    .enum(['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'BOARD', 'OTHER'])
    .default('OTHER'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
