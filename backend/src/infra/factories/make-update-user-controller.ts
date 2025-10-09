import { UserRepository } from '@/infra/database/repositories/user-repository'
import { UpdateUserController } from '@/infra/domain/imc/application/controllers'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'

export function makeUpdateUserController() {
  const userRepository = new UserRepository()
  const bcryptHash = new BcryptHasher()

  const updateUserController = new UpdateUserController(bcryptHash, userRepository)

  return updateUserController
}
