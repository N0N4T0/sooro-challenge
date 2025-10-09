import { UsersRepository } from '@/infra/database/repositories/users-repository'
import {
  createValidationErrorResponse,
  createSuccessResponse
} from '@/core/helpers'
import { ZodError } from 'zod'
import { Request, Response } from 'express'

export class ListUsersController {
  constructor(
    private readonly userRepository: UsersRepository,
  ) { }
  async handle(req: Request, res: Response) {
    try {
      const users = await this.userRepository.getUsers()

      return res.status(200).json(createSuccessResponse('Usuários listados com sucesso', users))
    } catch (error: any) {
      console.error('Erro ao listar usuários:', error)

      if (error instanceof ZodError) {
        return res.status(400).json(createValidationErrorResponse(error))
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      })
    }
  }
}