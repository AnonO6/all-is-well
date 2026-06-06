const NEGATIVE_EMOTIONS = [
  'Anxiety',
  'Stress',
  'Distress',
  'Sadness',
  'Fear',
  'Anger',
  'Disappointment',
  'Embarrassment',
] as const

const POSITIVE_EMOTIONS = [
  'Joy',
  'Calmness',
  'Contentment',
  'Interest',
  'Excitement',
  'Amusement',
] as const

export function computeStressSignal(emotions: Record<string, number>): number {
  const negSum = NEGATIVE_EMOTIONS.reduce((sum, key) => sum + (emotions[key] ?? 0), 0)
  const posSum = POSITIVE_EMOTIONS.reduce((sum, key) => sum + (emotions[key] ?? 0), 0)
  const ratio = negSum / (negSum + posSum + 0.01)
  return Math.min(10, Math.max(1, Math.round(ratio * 10)))
}

export function extractProsodyScores(message: unknown): Record<string, number> | null {
  if (!message || typeof message !== 'object') return null

  const models = (message as { models?: { prosody?: { scores?: unknown } } }).models
  const scores = models?.prosody?.scores
  if (!scores || typeof scores !== 'object') return null

  const result: Record<string, number> = {}
  for (const [key, value] of Object.entries(scores)) {
    if (typeof value === 'number') result[key] = value
  }

  return Object.keys(result).length > 0 ? result : null
}
