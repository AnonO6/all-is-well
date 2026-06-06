import { v4 as uuidv4 } from 'uuid'
import { MoodEntryRepository } from '@/repositories/mood-entry.repository'
import type { CreateMoodEntryInput } from '@/schemas/mood.schema'
import { computeInternalStressLevel } from '@/lib/mood-metrics'
import { getMoodLabel } from '@/lib/utils'

export class MoodService {
  static async createEntry(userId: string, input: CreateMoodEntryInput) {
    const entryId = uuidv4()
    const moodLabel = getMoodLabel(input.moodScore)
    const stressLevel = computeInternalStressLevel(input.moodScore, input.energyLevel)

    const entry = await MoodEntryRepository.insert({
      id: entryId,
      user_id: userId,
      mood_score: input.moodScore,
      energy_level: input.energyLevel,
      stress_level: stressLevel,
      mood_label: moodLabel,
      positive_highlights:
        input.positiveHighlights.length > 0
          ? JSON.stringify(input.positiveHighlights)
          : null,
      note: input.note ?? null,
      created_at: new Date(),
    })

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
