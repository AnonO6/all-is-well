'use client'

import { cn } from '@/lib/utils'
import { POSITIVE_HIGHLIGHT_LABELS } from '@/lib/rancho-copy'
import type { PositiveHighlightType } from '@/types/database'

const HIGHLIGHTS: PositiveHighlightType[] = [
  'good_sleep',
  'study_win',
  'took_break',
  'talked_friend',
  'went_outside',
  'ate_well',
  'family_time',
  'other_win',
]

type PositiveHighlightChipsProps = {
  selected: PositiveHighlightType[]
  onChange: (highlights: PositiveHighlightType[]) => void
}

export function PositiveHighlightChips({
  selected,
  onChange,
}: PositiveHighlightChipsProps) {
  const toggle = (highlight: PositiveHighlightType) => {
    if (selected.includes(highlight)) {
      onChange(selected.filter((h) => h !== highlight))
      return
    }
    onChange([...selected, highlight])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {HIGHLIGHTS.map((highlight) => (
        <button
          key={highlight}
          type="button"
          onClick={() => toggle(highlight)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            selected.includes(highlight)
              ? 'bg-brand-orange text-white'
              : 'border border-brand-purple/10 bg-white text-brand-text/70 hover:border-brand-purple/30',
          )}
        >
          {POSITIVE_HIGHLIGHT_LABELS[highlight]}
        </button>
      ))}
    </div>
  )
}
