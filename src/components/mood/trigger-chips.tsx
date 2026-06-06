'use client'

import { cn } from '@/lib/utils'
import { TRIGGER_LABELS } from '@/lib/rancho-copy'
import type { TriggerType } from '@/types/database'

const TRIGGERS: TriggerType[] = [
  'exam_pressure',
  'comparison',
  'sleep',
  'family',
  'time',
  'uncertainty',
  'other',
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
          key={trigger}
          type="button"
          onClick={() => toggle(trigger)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            selected.includes(trigger)
              ? 'bg-brand-text text-white'
              : 'bg-white text-brand-text/70 border border-brand-purple/10 hover:border-brand-purple/30',
          )}
        >
          {TRIGGER_LABELS[trigger]}
        </button>
      ))}
    </div>
  )
}
