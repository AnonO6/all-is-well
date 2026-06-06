import { MoodEntryRepository } from '@/repositories/mood-entry.repository'
import { StressTriggerRepository } from '@/repositories/stress-trigger.repository'
import { UserRepository } from '@/repositories/user.repository'
import { openai, OPENAI_MODEL } from '@/lib/openai'
import type { TriggerType } from '@/types/database'

const TRIGGER_LABELS: Record<TriggerType, string> = {
  exam_pressure: 'Exam pressure',
  comparison: 'Comparing with others',
  sleep: 'Poor sleep',
  family: 'Family expectations',
  time: 'Time management',
  uncertainty: 'Uncertainty about results',
  other: 'Other stressors',
}

export class AiInsightsService {
  static async getInsights(userId: string, days: 7 | 30 = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const [user, moodEntries, triggerCounts] = await Promise.all([
      UserRepository.findById(userId),
      MoodEntryRepository.listByUserSince(userId, since),
      StressTriggerRepository.countByType(userId, since),
    ])

    const triggerBreakdown = Array.from(triggerCounts.entries()).map(([type, count]) => ({
      type,
      label: TRIGGER_LABELS[type],
      count,
    }))

    const averageMood =
      moodEntries.length > 0
        ? moodEntries.reduce((sum, e) => sum + e.mood_score, 0) / moodEntries.length
        : null

    const averageStress =
      moodEntries.length > 0
        ? moodEntries.reduce((sum, e) => sum + e.stress_level, 0) / moodEntries.length
        : null

    let summary = null
    if (moodEntries.length >= 2) {
      const moodSummary = moodEntries
        .map((e) => `${e.created_at.toISOString().slice(0, 10)}: mood ${e.mood_score}/10, stress ${e.stress_level}/10`)
        .join('\n')

      const triggerSummary = triggerBreakdown
        .map((t) => `${t.label}: ${t.count}`)
        .join(', ')

      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a supportive wellness coach for Indian exam students. Summarize their emotional week in 3-4 warm, encouraging sentences. Mention patterns gently, offer one practical micro-tip. Never be clinical or alarming.',
          },
          {
            role: 'user',
            content: `Exam: ${user?.exam_type ?? 'OTHER'}\nMood logs:\n${moodSummary}\nTriggers: ${triggerSummary || 'none logged'}`,
          },
        ],
        max_tokens: 250,
      })

      summary = completion.choices[0]?.message?.content?.trim() ?? null
    }

    return {
      days,
      moodEntries: moodEntries.map((e) => ({
        date: e.created_at.toISOString().slice(0, 10),
        moodScore: e.mood_score,
        energyLevel: e.energy_level,
        stressLevel: e.stress_level,
        moodLabel: e.mood_label,
      })),
      triggerBreakdown,
      averageMood,
      averageStress,
      summary,
      examType: user?.exam_type ?? 'OTHER',
    }
  }
}
