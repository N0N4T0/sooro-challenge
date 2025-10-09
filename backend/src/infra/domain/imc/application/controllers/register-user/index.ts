import { Request, Response } from 'express'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { UserRepository } from '@/infra/database/repositories/user-repository'
import { User } from '@/infra/domain/imc'
import { UniqueEntityID } from '@/core/entities'
import { z, ZodError } from 'zod'
import {
  ErrorResponse,
  SuccessResponse,
  createValidationErrorResponse
} from '@/core/helpers'

const createUserBodySchema = z.object({
  name: z.string(),
  userName: z.string(),
  password: z.string(),
  perfil: z.enum(['admin', 'aluno', 'professor']),
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

type RegisterUserControllerRequest = Request<{}, {}, CreateUserBodySchema>

type RegisterUserControllerResponse = Response<ErrorResponse | SuccessResponse<User> | { message: string; user: any }>

export class RegisterUserController {
  constructor(
    private readonly hashGenerator: BcryptHasher,
    private readonly userRepository: UserRepository,
  ) { }

  async handle(req: RegisterUserControllerRequest, res: RegisterUserControllerResponse) {
    try {
      const validationResult = createUserBodySchema.safeParse(req.body)

      if (!validationResult.success) {
        return res.status(400).json(createValidationErrorResponse(validationResult.error))
      }

      const { name, userName, password, perfil } = validationResult.data

      const userExists = await this.userRepository.getByNameOrUserName(name, userName)

      if (userExists) {
        return res.status(400).json({
          error: `Usuário ${name} já existe`
        })
      }

      const uniqueId = new UniqueEntityID()
      const passwordHash = await this.hashGenerator.hash(password)

      const user = User.create({
        nome: name,
        usuario: userName,
        senha: passwordHash,
        perfil: perfil,
        situacao: 'ativo',
      }, uniqueId)
      this.userRepository.create(user)

      const newUser = await this.userRepository.getById(uniqueId.toString())

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: newUser
      })
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error)

      if (error instanceof ZodError) {
        return res.status(400).json(createValidationErrorResponse(error))
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      })
    }
  }
}