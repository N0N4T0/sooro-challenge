import { DeleteExamImcController } from '@/infra/domain/imc/application/controllers'
import { ExamImcRepository } from '../database/repositories/exam-imc-repository'

export function makeDeleteExamImcController() {
  const examImcRepository = new ExamImcRepository()

  const deleteExamImcController = new DeleteExamImcController(examImcRepository)

  return deleteExamImcController
}
