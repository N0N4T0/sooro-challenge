import jwt from 'jsonwebtoken'
import { Encrypter } from '@/infra/domain/imc/application/cryptography'

export class JwtEncrypter implements Encrypter {
  constructor(private secret: string) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return jwt.sign(payload, this.secret, {
      expiresIn: '1h',
    })
  }

  async verify(token: string): Promise<Record<string, unknown>> {
    return jwt.verify(token, this.secret) as Record<string, unknown>
  }
}
