import type { PositiveHighlightType } from '@/types/database'

export function parsePositiveHighlights(raw: string | null): PositiveHighlightType[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PositiveHighlightType[]) : []
  } catch {
    return []
  }
}
