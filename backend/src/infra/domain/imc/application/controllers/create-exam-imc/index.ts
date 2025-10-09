import { ExamImcRepository } from '@/infra/database/repositories/exam-imc-repository'
import { ExamIMC } from '../../../enterprise/entities'
import { UserRepository } from '@/infra/database/repositories/user-repository'
import { Request, Response } from 'express'
import { z, ZodError } from 'zod'
import {
  ErrorResponse,
  SuccessResponse,
  createValidationErrorResponse
} from '@/core/helpers'
import { UniqueEntityID } from '@/core'

const createExamImcBodySchema = z.object({
  altura: z.number(),
  peso: z.number(),
  imc: z.number(),
  classificacao: z.string(),
  userId: z.string(),
  professionalId: z.string(),
})

type CreateExamImcBodySchema = z.infer<typeof createExamImcBodySchema>

type CreateExamImcControllerRequest = Request<{}, {}, CreateExamImcBodySchema>

type CreateExamImcControllerResponse = Response<ErrorResponse | SuccessResponse | { message: string }>

export class CreateExamImcController {
  constructor(
    private readonly examImcRepository: ExamImcRepository,
    private readonly userRepository: UserRepository,
  ) { }

  async handle(req: CreateExamImcControllerRequest, res: CreateExamImcControllerResponse) {
    try {
      const { altura, peso, imc, classificacao, professionalId, userId } = req.body
      const validationResult = createExamImcBodySchema.safeParse(req.body)

      if (!validationResult.success) {
        return res.status(400).json(createValidationErrorResponse(validationResult.error))
      }

      const userExists = await this.userRepository.getById(userId)
      const professionalExists = await this.userRepository.getById(professionalId)

      if (!userExists || !professionalExists) {
        return res.status(400).json({
          error: `Usuário não encontrado`
        })
      }

      if (userExists.situacao === 'inativo') {
        return res.status(400).json({
          error: 'Usuário está inativo'
        })
      }

      const examImc = ExamIMC.create({
        altura,
        peso,
        imc,
        classificacao,
        id_usuario_avaliacao: new UniqueEntityID(professionalId),
        id_usuario_aluno: new UniqueEntityID(userId),
        dt_inclusao: new Date(),
      })

      await this.examImcRepository.create(examImc)

      return res.status(204).json({
        message: '',
      })
    } catch (error) {
      console.error('Erro ao criar exame IMC:', error)

      if (error instanceof ZodError) {
        return res.status(400).json(createValidationErrorResponse(error))
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      })
    }
  }
}