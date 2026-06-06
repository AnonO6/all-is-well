import { createMysqlPool } from '../src/lib/mysql-pool'

async function migrate() {
  const pool = createMysqlPool()
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
