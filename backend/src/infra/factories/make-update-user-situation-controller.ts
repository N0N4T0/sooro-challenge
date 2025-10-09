import { UserRepository } from '@/infra/database/repositories/user-repository'
import { UpdateUserSituationController } from '@/infra/domain/imc/application/controllers'

export function makeUpdateUserSituationController() {
  const userRepository = new UserRepository()
  const updatesituationUserController = new UpdateUserSituationController(userRepository)

  return updatesituationUserController
}
