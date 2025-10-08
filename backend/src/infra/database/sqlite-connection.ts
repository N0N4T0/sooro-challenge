import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

class SqliteConnection {
  private db: Database.Database | null = null

  connect(dbPath?: string): void {
    if (this.db) {
      return
    }

    const databasePath = dbPath || path.resolve(__dirname, '../../../database/database.db')

    const dir = path.dirname(databasePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    this.db = new Database(databasePath)

    this.initializeTables()

    console.log('✅ SQLite database connected:', databasePath)
  }

  private initializeTables(): void {
    if (!this.db) return

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS usuario (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        usuario TEXT NOT NULL,
        senha TEXT NOT NULL,
        perfil TEXT NOT NULL CHECK (perfil IN ('admin','aluno','professor')),
        situacao TEXT NOT NULL CHECK (situacao IN ('ativo','inativo')),
        dt_inclusao TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)

    console.log('✅ Database tables initialized')
  }

  getDb(): Database.Database {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db
  }

  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
      console.log('❌ SQLite database disconnected')
    }
  }
}

export const sqliteConnection = new SqliteConnection()
