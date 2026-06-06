import { z } from 'zod'

export const PositiveHighlightSchema = z.enum([
  'good_sleep',
  'study_win',
  'took_break',
  'talked_friend',
  'went_outside',
  'ate_well',
  'family_time',
  'other_win',
])

export const CreateMoodEntrySchema = z
  .object({
    moodScore: z.number().int().min(1).max(10),
    energyLevel: z.number().int().min(1).max(10),
    positiveHighlights: z.array(PositiveHighlightSchema).max(10).default([]),
    note: z.string().max(500).optional(),
  })
  .strict()

export type CreateMoodEntryInput = z.infer<typeof CreateMoodEntrySchema>
