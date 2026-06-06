import { v4 as uuidv4 } from 'uuid'
import { JournalEntryRepository } from '@/repositories/journal-entry.repository'
import { openai, OPENAI_MODEL } from '@/lib/openai'
import type { CreateJournalEntryInput } from '@/schemas/journal.schema'
import type { ExamType } from '@/types/database'

export class JournalService {
  static async createEntry(userId: string, input: CreateJournalEntryInput) {
    const entry = await JournalEntryRepository.insert({
      id: uuidv4(),
      user_id: userId,
      prompt: input.prompt,
      response: input.response,
      mood_before: input.moodBefore ?? null,
      mood_after: input.moodAfter ?? null,
      created_at: new Date(),
    })

    return { success: true as const, data: entry }
  }

  static async generatePrompt(options: {
    moodScore?: number
    examType?: ExamType
  }) {
    const moodContext = options.moodScore
      ? `The student rated their mood ${options.moodScore}/10 today.`
      : 'The student has not logged mood today.'

    const examContext = options.examType
      ? `They are preparing for ${options.examType}.`
      : 'They are a student preparing for competitive exams.'

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are Rancho from 3 Idiots — funny, chill, Hinglish, supportive. Generate one short journal reflection prompt for an Indian exam student (max 2 sentences). Witty but kind, anti-toxic-hustle, exam-aware. Return only the prompt text.',
        },
        {
          role: 'user',
          content: `${moodContext} ${examContext} Give me a reflection prompt.`,
        },
      ],
      max_tokens: 120,
    })

    const prompt = completion.choices[0]?.message?.content?.trim()
    if (!prompt) {
      return {
        success: false as const,
        error: 'Could not generate prompt',
        code: 'GENERATION_FAILED' as const,
      }
    }

    return { success: true as const, data: { prompt } }
  }
}
