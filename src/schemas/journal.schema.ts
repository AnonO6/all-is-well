import { z } from 'zod'

export const CreateJournalEntrySchema = z.object({
  prompt: z.string().min(1).max(1000),
  response: z.string().min(1).max(5000),
  moodBefore: z.number().int().min(1).max(10).optional(),
  moodAfter: z.number().int().min(1).max(10).optional(),
})

export const GeneratePromptSchema = z.object({
  moodScore: z.number().int().min(1).max(10).optional(),
  examType: z
    .enum(['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'BOARD', 'OTHER'])
    .optional(),
})

export type CreateJournalEntryInput = z.infer<typeof CreateJournalEntrySchema>
