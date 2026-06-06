import { db } from '@/lib/database'
import { computeCheckInStreak } from '@/lib/streak'
import type { DB } from '@/types/database'
import type { Insertable, Selectable } from 'kysely'

export type MoodEntry = Selectable<DB['mood_entries']>
export type NewMoodEntry = Insertable<DB['mood_entries']>

export class MoodEntryRepository {
  static async findById(id: string) {
    return db
      .selectFrom('mood_entries')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  static async insert(data: NewMoodEntry) {
    await db.insertInto('mood_entries').values(data).execute()
    return MoodEntryRepository.findById(data.id)
  }

  static async listByUser(userId: string, limit = 30) {
    return db
      .selectFrom('mood_entries')
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .selectAll()
      .execute()
  }

  static async listByUserSince(userId: string, since: Date) {
    return db
      .selectFrom('mood_entries')
      .where('user_id', '=', userId)
      .where('created_at', '>=', since)
      .orderBy('created_at', 'asc')
      .selectAll()
      .execute()
  }

  static async hasEntryToday(userId: string) {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const entry = await db
      .selectFrom('mood_entries')
      .where('user_id', '=', userId)
      .where('created_at', '>=', startOfDay)
      .select('id')
      .executeTakeFirst()

    return Boolean(entry)
  }

  static async getStreak(userId: string) {
    const entries = await db
      .selectFrom('mood_entries')
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .select(['created_at'])
      .limit(60)
      .execute()

    return computeCheckInStreak(entries.map((entry) => entry.created_at))
  }
}
