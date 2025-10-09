import { UserRepository } from '@/infra/database/repositories/user-repository'
import { ListUserController } from '@/infra/domain/imc/application/controllers'

export function makeListUserController() {
  const userRepository = new UserRepository()
  const listUserController = new ListUserController(userRepository)
  
  return listUserController
}
