import { sqliteConnection } from "@/infra/database/sqlite-connection"
import { User } from "@/infra/domain/imc"

export class UserRepository {
  private db = sqliteConnection.getDb()

  getById(id: string): Promise<User | null> {
    const stmt = this.db.prepare(`SELECT id, nome, usuario, perfil, situacao, dt_inclusao FROM usuario WHERE id = ?`)
    return stmt.get(id)
  }

  getByNameOrUserName(name: string, userName: string): Promise<User | null> {
    const stmt = this.db.prepare(`SELECT id, nome, usuario, perfil, situacao, dt_inclusao FROM usuario WHERE nome = ? OR usuario = ?`)
    return stmt.get(name, userName)
  }

  create(user: User): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO usuario (id, nome, usuario, senha, perfil, situacao, dt_inclusao)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `)
    stmt.run(
      user.id.toString(),
      user.nome,
      user.usuario,
      user.senha,
      user.perfil,
      user.situacao)
    return Promise.resolve()
  }

  update(id: string, name: string, userName: string, password: string, perfil: string): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE usuario 
      SET nome = ?, usuario = ?, senha = ?, perfil = ?
      WHERE id = ?
    `)
    stmt.run(name, userName, password, perfil, id)
    return Promise.resolve()
  }

  updateSituationById(id: string, situacao: string): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE usuario 
      SET situacao = ?
      WHERE id = ?
    `)
    stmt.run(situacao, id)
    return Promise.resolve()
  }

  delete(id: string): Promise<void> {
    const stmt = this.db.prepare(`
      DELETE FROM usuario 
      WHERE id = ?
    `)
    stmt.run(id)
    return Promise.resolve()
  }
}
