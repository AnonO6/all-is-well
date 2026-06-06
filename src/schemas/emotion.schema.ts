import { z } from 'zod'

export const CreateEmotionSnapshotSchema = z.object({
  source: z.enum(['rancho']).default('rancho'),
  emotions: z
    .record(z.string().max(50), z.number().min(0).max(1))
    .refine((emotions) => Object.keys(emotions).length <= 30, {
      message: 'Too many emotion scores',
    }),
})
