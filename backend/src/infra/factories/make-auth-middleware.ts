import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { AuthMiddleware } from '@/infra/middleware/auth-middleware'

export function makeAuthMiddleware() {
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key'
  const jwtEncrypter = new JwtEncrypter(jwtSecret)
  const authMiddleware = new AuthMiddleware(jwtEncrypter)
  
  return authMiddleware
}
