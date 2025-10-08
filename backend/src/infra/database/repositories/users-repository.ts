import { sqliteConnection } from "../sqlite-connection"

export class UsersRepository {
  private db = sqliteConnection.getDb()

  getUsers() {
    const stmt = this.db.prepare(`
    SELECT id, nome, usuario, perfil, situacao, dt_inclusao 
    FROM usuario
    ORDER BY dt_inclusao DESC
  `)

    return stmt.all()
  }
}
