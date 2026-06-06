import { createPool, type PoolOptions } from 'mysql2'

export function parseDatabaseUrl(databaseUrl: string): PoolOptions {
  const url = new URL(databaseUrl)

  return {
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    connectionLimit: 10,
    ssl: { rejectUnauthorized: false },
  }
}

export function createMysqlPool(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  return createPool(parseDatabaseUrl(databaseUrl))
}
