import { UpdateExamImcController } from '@/infra/domain/imc/application/controllers'
import { ExamImcRepository } from '../database/repositories/exam-imc-repository'

export function makeUpdateExamImcController() {
  const examImcRepository = new ExamImcRepository()

  const updateExamImcController = new UpdateExamImcController(examImcRepository)

  return updateExamImcController
}
