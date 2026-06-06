import 'server-only'
import { Kysely, MysqlDialect } from 'kysely'
import type { DB } from '@/types/database'
import { createMysqlPool } from '@/lib/mysql-pool'

const pool = createMysqlPool()

export const db = new Kysely<DB>({
  dialect: new MysqlDialect({ pool }),
})
