import { v4 as uuidv4 } from 'uuid'
import { MoodEntryRepository } from '@/repositories/mood-entry.repository'
import type { CreateMoodEntryInput } from '@/schemas/mood.schema'
import { getMoodLabel } from '@/lib/utils'
import { db } from '@/lib/database'

export class MoodService {
  static async createEntry(userId: string, input: CreateMoodEntryInput) {
    const entryId = uuidv4()
    const moodLabel = getMoodLabel(input.moodScore)

    await db.transaction().execute(async (trx) => {
      await trx
        .insertInto('mood_entries')
        .values({
          id: entryId,
          user_id: userId,
          mood_score: input.moodScore,
          energy_level: input.energyLevel,
          stress_level: input.stressLevel,
          mood_label: moodLabel,
          note: input.note ?? null,
          created_at: new Date(),
        })
        .execute()

      if (input.triggers.length > 0) {
        await trx
          .insertInto('stress_triggers')
          .values(
            input.triggers.map((trigger) => ({
              id: uuidv4(),
              mood_entry_id: entryId,
              user_id: userId,
              trigger_type: trigger,
            })),
          )
          .execute()
      }
    })

    const entry = await MoodEntryRepository.findById(entryId)
    return { success: true as const, data: entry }
  }

  static async getDashboardStats(userId: string) {
    const [entries, streak, checkedInToday] = await Promise.all([
      MoodEntryRepository.listByUserSince(
        userId,
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      ),
      MoodEntryRepository.getStreak(userId),
      MoodEntryRepository.hasEntryToday(userId),
    ])

    return {
      weeklyEntries: entries,
      streak,
      checkedInToday,
      averageMood:
        entries.length > 0
          ? entries.reduce((sum, e) => sum + e.mood_score, 0) / entries.length
          : null,
    }
  }
}
