import { UserRepository } from '@/infra/database/repositories/user-repository'
import { DeleteUserController } from '@/infra/domain/imc/application/controllers'

export function makeDeleteUserController() {
  const userRepository = new UserRepository()
  const deleteUserController = new DeleteUserController(userRepository)

  return deleteUserController
}
