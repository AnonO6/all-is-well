import { z } from 'zod'

export const CreateEmotionSnapshotSchema = z.object({
  source: z.enum(['rancho']).default('rancho'),
  emotions: z.record(z.string(), z.number().min(0).max(1)),
})
