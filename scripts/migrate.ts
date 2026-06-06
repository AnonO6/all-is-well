import { createPool } from 'mysql2/promise'

function getPoolOptions() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  const url = new URL(databaseUrl)
  return {
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    connectionLimit: 1,
    ssl: { rejectUnauthorized: false },
  }
}

async function migrate() {
  const pool = createPool(getPoolOptions())
  const connection = await pool.getConnection()

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NULL,
        exam_type ENUM('NEET','JEE','CUET','CAT','GATE','UPSC','BOARD','OTHER') NOT NULL DEFAULT 'OTHER',
        image VARCHAR(500) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        mood_score TINYINT NOT NULL,
        energy_level TINYINT NOT NULL,
        stress_level TINYINT NOT NULL,
        mood_label VARCHAR(50) NOT NULL,
        note TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_mood_user_created (user_id, created_at),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS stress_triggers (
        id VARCHAR(36) PRIMARY KEY,
        mood_entry_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        trigger_type ENUM('exam_pressure','comparison','sleep','family','time','uncertainty','other') NOT NULL,
        INDEX idx_trigger_user (user_id),
        FOREIGN KEY (mood_entry_id) REFERENCES mood_entries(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        mood_before TINYINT NULL,
        mood_after TINYINT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_journal_user_created (user_id, created_at),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS emotion_snapshots (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        source VARCHAR(50) NOT NULL DEFAULT 'rancho',
        emotions JSON NOT NULL,
        stress_signal TINYINT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_emotion_user_created (user_id, created_at),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    const [columns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'mood_entries' AND COLUMN_NAME = 'positive_highlights'`,
    )

    if (!Array.isArray(columns) || columns.length === 0) {
      await connection.query(`
        ALTER TABLE mood_entries
        ADD COLUMN positive_highlights JSON NULL AFTER mood_label
      `)
    }

    console.log('Migration completed successfully')
  } finally {
    connection.release()
    await pool.end()
  }
}

migrate().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
