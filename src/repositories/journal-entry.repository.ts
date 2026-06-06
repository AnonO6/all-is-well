import { db } from '@/lib/database'
import type { DB } from '@/types/database'
import type { Insertable, Selectable } from 'kysely'

export type JournalEntry = Selectable<DB['journal_entries']>
export type NewJournalEntry = Insertable<DB['journal_entries']>

export class JournalEntryRepository {
  static async findById(id: string) {
    return db
      .selectFrom('journal_entries')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  static async insert(data: NewJournalEntry) {
    await db.insertInto('journal_entries').values(data).execute()
    return JournalEntryRepository.findById(data.id)
  }

  static async listByUser(userId: string, limit = 20) {
    return db
      .selectFrom('journal_entries')
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .selectAll()
      .execute()
  }
}
