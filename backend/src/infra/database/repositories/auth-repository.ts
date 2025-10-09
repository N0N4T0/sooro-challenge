import { UserToken } from "@/infra/domain/imc";
import { sqliteConnection } from "../sqlite-connection";

export class AuthRepository {
  private db = sqliteConnection.getDb()

  createSession(userToken: UserToken) {
    const stmt = this.db.prepare(`
      INSERT INTO usuario_token (id, refresh_token, id_usuario, expiracao_token)
      VALUES (?, ?, ?, ?)
    `)
    stmt.run(
      userToken.id.toString(),
      userToken.refresh_token,
      userToken.id_usuario.toString(),
      userToken.expiracao_token.toISOString()
    )
  }
}
