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

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS avaliacao_imc (
        id TEXT PRIMARY KEY,
        altura REAL NOT NULL,
        peso REAL NOT NULL,
        imc REAL,
        classificacao TEXT NOT NULL,
        id_usuario_avaliacao TEXT NOT NULL,
        id_usuario_aluno TEXT NOT NULL,
        dt_inclusao TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (id_usuario_avaliacao) REFERENCES usuario(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        FOREIGN KEY (id_usuario_aluno) REFERENCES usuario(id) ON DELETE RESTRICT ON UPDATE RESTRICT
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS usuario_token (
        id TEXT PRIMARY KEY,
        refresh_token TEXT NOT NULL,
        id_usuario TEXT NOT NULL,
        expiracao_token TEXT NOT NULL,
        dt_inclusao TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE RESTRICT ON UPDATE RESTRICT
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
