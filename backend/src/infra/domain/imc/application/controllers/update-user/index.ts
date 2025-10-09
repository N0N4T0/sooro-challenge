import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher"
import { UserRepository } from "@/infra/database/repositories/user-repository"
import { Request, Response } from 'express'
import { z, ZodError } from 'zod'
import {
  ErrorResponse,
  SuccessResponse,
  createValidationErrorResponse
} from '@/core/helpers'

const updateUserBodySchema = z.object({
  name: z.string(),
  userName: z.string(),
  password: z.string(),
  perfil: z.enum(['admin', 'aluno', 'professor']),
})

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>

type UpdateUserControllerRequest = Request<{ id: string }, {}, UpdateUserBodySchema>

type UpdateUserControllerResponse = Response<ErrorResponse | SuccessResponse | { message: string }>

export class UpdateUserController {
  constructor(
    private readonly hashGenerator: BcryptHasher,
    private readonly userRepository: UserRepository,
  ) { }

  async handle(req: UpdateUserControllerRequest, res: UpdateUserControllerResponse) {
    try {
      const { id } = req.params
      const { name, userName, password, perfil } = req.body

      const validationResult = updateUserBodySchema.safeParse(req.body)

      if (!validationResult.success) {
        return res.status(400).json(createValidationErrorResponse(validationResult.error))
      }

      const userExists = await this.userRepository.getByIdWithExams(id)
      if (!userExists) {
        return res.status(404).json({ error: `Usuário ${id} não encontrado` })
      }

      const passwordHash = await this.hashGenerator.hash(password)
      await this.userRepository.update(id, name, userName, passwordHash, perfil)

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