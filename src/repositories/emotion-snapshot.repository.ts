import { db } from '@/lib/database'

export class EmotionSnapshotRepository {
  static async create(input: {
    id: string
    userId: string
    source: string
    emotions: Record<string, number>
    stressSignal: number
  }) {
    await db
      .insertInto('emotion_snapshots')
      .values({
        id: input.id,
        user_id: input.userId,
        source: input.source,
        emotions: JSON.stringify(input.emotions),
        stress_signal: input.stressSignal,
        created_at: new Date(),
      })
      .execute()
  }

  static async listByUserSince(userId: string, since: Date) {
    return db
      .selectFrom('emotion_snapshots')
      .selectAll()
      .where('user_id', '=', userId)
      .where('created_at', '>=', since)
      .orderBy('created_at', 'asc')
      .execute()
  }
}
