import { UserRepository } from '@/infra/database/repositories/user-repository'
import { CreateExamImcController } from '@/infra/domain/imc/application/controllers'
import { ExamImcRepository } from '../database/repositories/exam-imc-repository'

export function makeCreateExamImcController() {
  const userRepository = new UserRepository()
  const examImcRepository = new ExamImcRepository()

  const createExamImcController = new CreateExamImcController(examImcRepository, userRepository)

  return createExamImcController
}
