import { UserRepository } from '@/infra/database/repositories/user-repository'
import { RegisterUserController } from '@/infra/domain/imc/application/controllers'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'

export function makeRegisterUserController() {
  const userRepository = new UserRepository()
  const bcryptHash = new BcryptHasher()

  const registerUserController = new RegisterUserController(bcryptHash, userRepository)

  return registerUserController
}
