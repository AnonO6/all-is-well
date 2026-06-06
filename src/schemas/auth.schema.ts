import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Za-z]/, 'Password must include a letter')
    .regex(/[0-9]/, 'Password must include a number'),
  examType: z
    .enum(['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'BOARD', 'OTHER'])
    .default('OTHER'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
