import { db } from '@/lib/database'
import type { DB, TriggerType } from '@/types/database'
import type { Insertable, Selectable } from 'kysely'

export type StressTrigger = Selectable<DB['stress_triggers']>
export type NewStressTrigger = Insertable<DB['stress_triggers']>

export class StressTriggerRepository {
  static async insertBatch(triggers: NewStressTrigger[]) {
    if (triggers.length === 0) return []
    await db.insertInto('stress_triggers').values(triggers).execute()
    return triggers
  }

  static async listByUserSince(userId: string, since: Date) {
    return db
      .selectFrom('stress_triggers')
      .innerJoin('mood_entries', 'mood_entries.id', 'stress_triggers.mood_entry_id')
      .where('stress_triggers.user_id', '=', userId)
      .where('mood_entries.created_at', '>=', since)
      .select(['stress_triggers.trigger_type', 'mood_entries.created_at'])
      .execute()
  }

  static async countByType(userId: string, since: Date) {
    const rows = await db
      .selectFrom('stress_triggers')
      .innerJoin('mood_entries', 'mood_entries.id', 'stress_triggers.mood_entry_id')
      .where('stress_triggers.user_id', '=', userId)
      .where('mood_entries.created_at', '>=', since)
      .select(['stress_triggers.trigger_type'])
      .execute()

    const counts = new Map<TriggerType, number>()
    for (const row of rows) {
      counts.set(row.trigger_type, (counts.get(row.trigger_type) ?? 0) + 1)
    }
    return counts
  }
}
