import { createSuccessResponse, createValidationErrorResponse, ErrorResponse, SuccessResponse } from '@/core/helpers'
import { UserRepository } from '@/infra/database/repositories/user-repository'
import { ZodError } from 'zod'
import { Request, Response } from 'express'
import { UserWithExamImcResponse } from '@/core/types'

type ListUserControllerRequest = Request<{ id: string }, {}>

type ListUserControllerResponse = Response<ErrorResponse | SuccessResponse<UserWithExamImcResponse> | { message: string }>

export class ListUserController {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async handle(req: ListUserControllerRequest, res: ListUserControllerResponse) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          error: 'Id é necessário para busca'
        })
      }

      const userExists = await this.userRepository.getByIdWithExams(id)

      if (!userExists) {
        return res.status(400).json({
          error: `Usuário não encontrado`
        })
      }

      return res.status(200).json(createSuccessResponse('', userExists))
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error)

      if (error instanceof ZodError) {
        return res.status(400).json(createValidationErrorResponse(error))
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      })
    }
  }
}