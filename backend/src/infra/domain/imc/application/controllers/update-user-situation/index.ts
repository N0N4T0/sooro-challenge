import { UserRepository } from "@/infra/database/repositories/user-repository"
import { Request, Response } from 'express'
import { z, ZodError } from 'zod'
import {
  ErrorResponse,
  SuccessResponse,
  createValidationErrorResponse
} from '@/core/helpers'

const updateUserBodySchema = z.object({
  id: z.string().min(1, 'ID do usuário é obrigatório'),
  situation: z.string().min(1, 'Situação do usuário é obrigatória'),
})

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>

type UpdateUserSituationControllerRequest = Request<{}, {}, UpdateUserBodySchema>
type UpdateUserSituationControllerResponse = Response<ErrorResponse | SuccessResponse | { message: string }>

export class UpdateUserSituationController {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async handle(req: UpdateUserSituationControllerRequest, res: UpdateUserSituationControllerResponse) {
    try {
      const { id, situation } = req.body

      const validationResult = updateUserBodySchema.safeParse(req.body)

      if (!validationResult.success) {
        return res.status(400).json(createValidationErrorResponse(validationResult.error))
      }

      const userExists = await this.userRepository.getByIdWithExams(id)
      if (!userExists) {
        return res.status(404).json({ error: `Usuário ${id} não encontrado` })
      }

      await this.userRepository.updateSituationById(id, situation)

      return res.status(204).json({
        message: '',
      })
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error)

      if (error instanceof ZodError) {
        return res.status(400).json(createValidationErrorResponse(error))
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      })
    }
  }
}
