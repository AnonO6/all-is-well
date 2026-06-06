import { z } from 'zod'

export const TriggerTypeSchema = z.enum([
  'exam_pressure',
  'comparison',
  'sleep',
  'family',
  'time',
  'uncertainty',
  'other',
])

export const CreateMoodEntrySchema = z.object({
  moodScore: z.number().int().min(1).max(10),
  energyLevel: z.number().int().min(1).max(10),
  stressLevel: z.number().int().min(1).max(10),
  note: z.string().max(500).optional(),
  triggers: z.array(TriggerTypeSchema).max(10).default([]),
})

export type CreateMoodEntryInput = z.infer<typeof CreateMoodEntrySchema>
