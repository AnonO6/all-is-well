export type ExamType =
  | 'NEET'
  | 'JEE'
  | 'CUET'
  | 'CAT'
  | 'GATE'
  | 'UPSC'
  | 'BOARD'
  | 'OTHER'

export type TriggerType =
  | 'exam_pressure'
  | 'comparison'
  | 'sleep'
  | 'family'
  | 'time'
  | 'uncertainty'
  | 'other'

export type PositiveHighlightType =
  | 'good_sleep'
  | 'study_win'
  | 'took_break'
  | 'talked_friend'
  | 'went_outside'
  | 'ate_well'
  | 'family_time'
  | 'other_win'

export interface DB {
  users: {
    id: string
    name: string
    email: string
    password_hash: string | null
    exam_type: ExamType
    image: string | null
    created_at: Date
    updated_at: Date
  }
  mood_entries: {
    id: string
    user_id: string
    mood_score: number
    energy_level: number
    stress_level: number
    mood_label: string
    positive_highlights: string | null
    note: string | null
    created_at: Date
  }
  emotion_snapshots: {
    id: string
    user_id: string
    source: string
    emotions: string
    stress_signal: number
    created_at: Date
  }
  stress_triggers: {
    id: string
    mood_entry_id: string
    user_id: string
    trigger_type: TriggerType
  }
  journal_entries: {
    id: string
    user_id: string
    prompt: string
    response: string
    mood_before: number | null
    mood_after: number | null
    created_at: Date
  }
}
