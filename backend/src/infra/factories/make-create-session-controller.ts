import { AuthRepository } from '@/infra/database/repositories/auth-repository'
import { UserRepository } from '@/infra/database/repositories/user-repository'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { CreateSessionController } from '@/infra/domain/imc/application/controllers/create-session'

export function makeCreateSessionController() {
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key'
  
  const authRepository = new AuthRepository()
  const userRepository = new UserRepository()
  const bcryptHasher = new BcryptHasher()
  const jwtEncrypter = new JwtEncrypter(jwtSecret)
  
  const createSessionController = new CreateSessionController(
    authRepository,
    userRepository,
    bcryptHasher,
    jwtEncrypter
  )
  
  return createSessionController
}
