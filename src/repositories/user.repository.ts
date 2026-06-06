import { db } from '@/lib/database'
import type { DB, ExamType } from '@/types/database'
import type { Insertable, Selectable, Updateable } from 'kysely'

export type User = Selectable<DB['users']>
export type NewUser = Insertable<DB['users']>
export type UserUpdate = Updateable<DB['users']>

export class UserRepository {
  static async findById(id: string) {
    return db.selectFrom('users').where('id', '=', id).selectAll().executeTakeFirst()
  }

  static async findByEmail(email: string) {
    return db.selectFrom('users').where('email', '=', email).selectAll().executeTakeFirst()
  }

  static async insert(data: NewUser) {
    await db.insertInto('users').values(data).execute()
    return UserRepository.findById(data.id)
  }

  static async update(id: string, data: UserUpdate) {
    await db.updateTable('users').set(data).where('id', '=', id).execute()
    return UserRepository.findById(id)
  }

  static async upsertFromOAuth(input: {
    id: string
    name: string
    email: string
    image?: string | null
    examType?: ExamType
  }) {
    const existing = await UserRepository.findByEmail(input.email)
    if (existing) {
      return UserRepository.update(existing.id, {
        name: input.name,
        image: input.image ?? existing.image,
        updated_at: new Date(),
      })
    }

    return UserRepository.insert({
      id: input.id,
      name: input.name,
      email: input.email,
      password_hash: null,
      exam_type: input.examType ?? 'OTHER',
      image: input.image ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    })
  }
}
