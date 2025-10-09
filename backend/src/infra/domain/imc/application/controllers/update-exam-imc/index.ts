import {
  ErrorResponse,
  SuccessResponse,
  createValidationErrorResponse
} from '@/core/helpers'
import { ExamImcRepository } from "@/infra/database/repositories/exam-imc-repository"
import { Request, Response } from 'express'
import { z, ZodError } from 'zod'

const updateExamImcBodySchema = z.object({
  altura: z.number(),
  peso: z.number(),
  imc: z.number(),
  classificacao: z.string(),
})

type UpdateExamImcBodySchema = z.infer<typeof updateExamImcBodySchema>

type UpdateExamImcControllerRequest = Request<{ id: string }, {}, UpdateExamImcBodySchema>

type UpdateExamImcControllerResponse = Response<ErrorResponse | SuccessResponse | { message: string; examImc: any }>

export class UpdateExamImcController {
  constructor(
    private readonly examImcRepository: ExamImcRepository,
  ) { }

  async handle(req: UpdateExamImcControllerRequest, res: UpdateExamImcControllerResponse) {
    try {
      const { id } = req.params
      const { altura, peso, imc, classificacao } = req.body

      const validationResult = updateExamImcBodySchema.safeParse(req.body)

      if (!validationResult.success) {
        return res.status(400).json(createValidationErrorResponse(validationResult.error))
      }

      const examImcExists = await this.examImcRepository.getExamImcById(id)
      if (!examImcExists) {
        return res.status(404).json({ error: `Exame IMC ${id} não encontrado` })
      }

      await this.examImcRepository.update(id, { altura, peso, imc, classificacao })

      return res.status(204).json({
        message: '',
      })
    } catch (error: any) {
      console.error('Erro ao atualizar exame IMC:', error)

      if (error instanceof ZodError) {
        return res.status(400).json(createValidationErrorResponse(error))
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      })
    }
  }
}