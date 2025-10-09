import { ExamIMC } from "@/infra/domain/imc";
import { sqliteConnection } from "../sqlite-connection";

export class ExamImcRepository {
  private db = sqliteConnection.getDb()

  getExamImcById(id: string): Promise<any | null> {
    const stmt = this.db.prepare(`
      SELECT 
        id, 
        altura, 
        peso, 
        imc, 
        classificacao, 
        id_usuario_avaliacao, 
        id_usuario_aluno, 
        dt_inclusao
      FROM avaliacao_imc WHERE id = ?
    `)
    return Promise.resolve(stmt.get(id))
  }

  getExamImcByNameOrUsername(nameOrUsername: string): Promise<ExamIMC[]> {
    const stmt = this.db.prepare(`
      SELECT 
        ai.id, 
        ai.altura, 
        ai.peso, 
        ai.imc, 
        ai.classificacao, 
        ai.id_usuario_avaliacao, 
        ai.id_usuario_aluno, 
        ai.dt_inclusao,
        u.nome,
        u.usuario
      FROM avaliacao_imc ai
      INNER JOIN usuario u ON ai.id_usuario_aluno = u.id
      WHERE LOWER(u.nome) LIKE LOWER(?) OR LOWER(u.usuario) LIKE LOWER(?)
    `)
    const searchPattern = `%${nameOrUsername}%`
    const exams = stmt.all(searchPattern, searchPattern) as ExamIMC[]
    return Promise.resolve(exams)
  }

  create(examImc: ExamIMC): Promise<void> {
    const stmt = this.db.prepare(`
            INSERT INTO avaliacao_imc (id, altura, peso, imc, classificacao, id_usuario_avaliacao, id_usuario_aluno, dt_inclusao)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `)
    stmt.run(
      examImc.id.toString(),
      examImc.altura,
      examImc.peso,
      examImc.imc,
      examImc.classificacao,
      examImc.id_usuario_avaliacao.toString(),
      examImc.id_usuario_aluno.toString()
    )
    return Promise.resolve()
  }

  update(id: string, examImc: any): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE avaliacao_imc 
      SET altura = ?, peso = ?, imc = ?, classificacao = ?
      WHERE id = ?
    `)
    stmt.run(
      examImc.altura,
      examImc.peso,
      examImc.imc,
      examImc.classificacao,
      id
    )
    return Promise.resolve()
  }

  delete(id: string): Promise<void> {
    const stmt = this.db.prepare(`
      DELETE FROM avaliacao_imc 
      WHERE id = ?
    `)
    stmt.run(id)
    return Promise.resolve()
  }
}
