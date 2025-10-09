import { ExamIMCResponse, UserWithExamImcResponse } from "@/core/types"
import { sqliteConnection } from "@/infra/database/sqlite-connection"
import { User } from "@/infra/domain/imc"

export class UserRepository {
  private db = sqliteConnection.getDb()

  getById(id: string): Promise<User | null> {
    const stmt = this.db.prepare(`SELECT id, nome, usuario, perfil, situacao, dt_inclusao FROM usuario WHERE id = ?`)
    return stmt.get(id)
  }

  getByIdWithExams(id: string): Promise<UserWithExamImcResponse | null> {
    const stmt = this.db.prepare(`
      SELECT 
        u.id, u.nome, u.usuario, u.perfil, u.situacao, u.dt_inclusao,
        ai.id as exam_id, ai.altura, ai.peso, ai.imc, ai.classificacao, 
        ai.id_usuario_avaliacao, ai.dt_inclusao as exam_dt_inclusao
      FROM usuario u
      LEFT JOIN avaliacao_imc ai ON u.id = ai.id_usuario_aluno
      WHERE u.id = ?
      ORDER BY ai.dt_inclusao DESC
    `)

    const rows = stmt.all(id)

    const user: UserWithExamImcResponse = {
      id: rows[0].id,
      nome: rows[0].nome,
      usuario: rows[0].usuario,
      perfil: rows[0].perfil,
      situacao: rows[0].situacao,
      dt_inclusao: rows[0].dt_inclusao,
      exams: [] as ExamIMCResponse[]
    }

    rows.forEach(row => {
      if (row.exam_id) {
        user.exams?.push({
          id: row.exam_id,
          altura: row.altura,
          peso: row.peso,
          imc: row.imc,
          classificacao: row.classificacao,
          id_usuario_avaliacao: row.id_usuario_avaliacao,
          id_usuario_aluno: row.id_usuario_aluno,
          dt_inclusao: row.exam_dt_inclusao,
        })
      }
    })

    return Promise.resolve(user)
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
