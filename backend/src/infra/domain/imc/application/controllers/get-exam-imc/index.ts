import { ExamImcRepository } from "@/infra/database/repositories/exam-imc-repository"
import { ZodError } from 'zod'
import {
  ErrorResponse,
  SuccessResponse,
  createValidationErrorResponse,
  createSuccessResponse
} from '@/core/helpers'
import { Request, Response } from 'express'
import { ExamIMC } from '@/infra/domain/imc'

type GetExamImcControllerRequest = Request<{ nameOrUsername: string }>
type GetExamImcControllerResponse = Response<ErrorResponse | SuccessResponse<ExamIMC[]> | { message: string }>

export class GetExamImcController {
  constructor(
    private readonly examImcRepository: ExamImcRepository,
  ) { }

  async handle(req: GetExamImcControllerRequest, res: GetExamImcControllerResponse) {
    try {
      const { nameOrUsername } = req.params

      if (!nameOrUsername) {
        return res.status(400).json({ error: "Name or username é necessário para exclusão de IMC" })
      }

      const result = await this.examImcRepository.getExamImcByNameOrUsername(nameOrUsername)
      const hasExamImc = result.length > 0

      if (!hasExamImc) {
        return res.status(404).json({ error: `Exame IMC de ${nameOrUsername} não encontrado` })
      }

      return res.status(200).json(createSuccessResponse('Exames IMC encontrados com sucesso', result))
    } catch (error: any) {
      console.error('Erro ao buscar exame IMC:', error)

      if (error instanceof ZodError) {
        return res.status(400).json(createValidationErrorResponse(error))
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      })
    }
  }
}