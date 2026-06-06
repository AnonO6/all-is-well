import { unstable_cache } from 'next/cache'
import { MoodEntryRepository } from '@/repositories/mood-entry.repository'
import { UserRepository } from '@/repositories/user.repository'
import { openai, OPENAI_MODEL } from '@/lib/openai'
import { POSITIVE_HIGHLIGHT_LABELS } from '@/lib/rancho-copy'
import type { PositiveHighlightType } from '@/types/database'

function parseHighlights(raw: string | null): PositiveHighlightType[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PositiveHighlightType[]) : []
  } catch {
    return []
  }
}

async function generateSummary(
  moodSummary: string,
  winsSummary: string,
  examType: string,
) {
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are Rancho from 3 Idiots — funny, chill, Hinglish, caring. Summarize this student week using ONLY positive framing. Celebrate wins, mood trends, energy. Light humor OK. One practical micro-tip. End with "all is well" energy. Never mention stress, anxiety, triggers, or negative labels — showing those would make exam anxiety worse.',
      },
      {
        role: 'user',
        content: `Exam: ${examType}\nMood logs:\n${moodSummary}\nPositive wins: ${winsSummary || 'still building the habit'}`,
      },
    ],
    max_tokens: 250,
  })

  return completion.choices[0]?.message?.content?.trim() ?? null
}

export class AiInsightsService {
  static async getInsights(userId: string, days: 7 | 30 = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const [user, moodEntries] = await Promise.all([
      UserRepository.findById(userId),
      MoodEntryRepository.listByUserSince(userId, since),
    ])

    const highlightCounts = new Map<PositiveHighlightType, number>()
    for (const entry of moodEntries) {
      for (const highlight of parseHighlights(entry.positive_highlights)) {
        highlightCounts.set(highlight, (highlightCounts.get(highlight) ?? 0) + 1)
      }
    }

    const positiveBreakdown = Array.from(highlightCounts.entries())
      .map(([type, count]) => ({
        type,
        label: POSITIVE_HIGHLIGHT_LABELS[type],
        count,
      }))
      .sort((a, b) => b.count - a.count)

    const averageMood =
      moodEntries.length > 0
        ? moodEntries.reduce((sum, e) => sum + e.mood_score, 0) / moodEntries.length
        : null

    const averageEnergy =
      moodEntries.length > 0
        ? moodEntries.reduce((sum, e) => sum + e.energy_level, 0) / moodEntries.length
        : null

    let summary = null
    if (moodEntries.length >= 2) {
      const moodSummary = moodEntries
        .map(
          (e) =>
            `${e.created_at.toISOString().slice(0, 10)}: mood ${e.mood_score}/10, energy ${e.energy_level}/10`,
        )
        .join('\n')

      const winsSummary = positiveBreakdown
        .map((w) => `${w.label}: ${w.count}`)
        .join(', ')

      const fingerprint = moodEntries.map((e) => e.id).join(',')
      const cachedSummary = unstable_cache(
        () =>
          generateSummary(
            moodSummary,
            winsSummary,
            user?.exam_type ?? 'OTHER',
          ),
        ['insights-summary', userId, String(days), fingerprint],
        { revalidate: 86_400 },
      )
      summary = await cachedSummary()
    }

    return {
      days,
      moodEntries: moodEntries.map((e) => ({
        date: e.created_at.toISOString().slice(0, 10),
        moodScore: e.mood_score,
        energyLevel: e.energy_level,
        moodLabel: e.mood_label,
      })),
      positiveBreakdown,
      averageMood,
      averageEnergy,
      summary,
      examType: user?.exam_type ?? 'OTHER',
    }
  }
}
