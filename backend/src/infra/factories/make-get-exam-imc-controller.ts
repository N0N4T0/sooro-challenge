import { GetExamImcController } from '@/infra/domain/imc/application/controllers'
import { ExamImcRepository } from '../database/repositories/exam-imc-repository'

export function makeGetExamImcController() {
  const examImcRepository = new ExamImcRepository()

  const getExamImcController = new GetExamImcController(examImcRepository)

  return getExamImcController
}
