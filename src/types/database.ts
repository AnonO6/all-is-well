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
    note: string | null
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
