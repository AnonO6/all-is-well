'use client'

import { cn, getMoodEmoji, getMoodLabel } from '@/lib/utils'

type MoodPickerProps = {
  value: number
  onChange: (score: number) => void
}

const moodScores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div
      className="grid grid-cols-5 gap-3"
      role="radiogroup"
      aria-label="Select your mood score"
    >
      {moodScores.map((score) => (
        <button
          key={score}
          type="button"
          role="radio"
          aria-checked={value === score}
          aria-label={`Mood ${score}, ${getMoodLabel(score)}`}
          onClick={() => onChange(score)}
          className={cn(
            'flex flex-col items-center gap-1 rounded-2xl border p-3 transition-all',
            value === score
              ? 'border-brand-orange bg-brand-orange/10 shadow-sm'
              : 'border-brand-purple/10 bg-white hover:border-brand-purple/30',
          )}
        >
          <span className="text-2xl">{getMoodEmoji(score)}</span>
          <span className="text-xs font-medium text-brand-text/70">{score}</span>
        </button>
      ))}
    </div>
  )
}
