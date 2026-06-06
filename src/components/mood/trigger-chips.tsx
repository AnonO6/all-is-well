'use client'

import { cn } from '@/lib/utils'
import type { TriggerType } from '@/types/database'

const TRIGGERS: { type: TriggerType; label: string }[] = [
  { type: 'exam_pressure', label: 'Exam pressure' },
  { type: 'comparison', label: 'Comparing with others' },
  { type: 'sleep', label: 'Poor sleep' },
  { type: 'family', label: 'Family expectations' },
  { type: 'time', label: 'Time crunch' },
  { type: 'uncertainty', label: 'Result uncertainty' },
  { type: 'other', label: 'Something else' },
]

type TriggerChipsProps = {
  selected: TriggerType[]
  onChange: (triggers: TriggerType[]) => void
}

export function TriggerChips({ selected, onChange }: TriggerChipsProps) {
  const toggle = (trigger: TriggerType) => {
    if (selected.includes(trigger)) {
      onChange(selected.filter((t) => t !== trigger))
      return
    }
    onChange([...selected, trigger])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {TRIGGERS.map((trigger) => (
        <button
          key={trigger.type}
          type="button"
          onClick={() => toggle(trigger.type)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            selected.includes(trigger.type)
              ? 'bg-brand-text text-white'
              : 'bg-white text-brand-text/70 border border-brand-purple/10 hover:border-brand-purple/30',
          )}
        >
          {trigger.label}
        </button>
      ))}
    </div>
  )
}
