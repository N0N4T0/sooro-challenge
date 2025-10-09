import { AuthRepository } from "@/infra/database/repositories/auth-repository"
import { Request, Response } from 'express'
import { z, ZodError } from 'zod'
import {
  ErrorResponse,
  SuccessResponse,
  createValidationErrorResponse,
  createSuccessResponse
} from '@/core/helpers'
import { UserRepository } from "@/infra/database/repositories/user-repository"
import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher"
import { Encrypter } from "../../cryptography"
import { UserToken } from "../../../enterprise/entities"

const authenticateBodySchema = z.object({
  userName: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

type CreateSessionControllerRequest = Request<{}, {}, AuthenticateBodySchema>

type CreateSessionControllerResponse = Response<ErrorResponse | SuccessResponse<{
  token: string
  refreshToken: string
  user: {
    id: string
    nome: string
    usuario: string
    perfil: string
  }
}> | { message: string, token: string }>


export class CreateSessionController {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly hashComparer: BcryptHasher,
    private readonly encrypter: Encrypter,
  ) { }

  async handle(req: CreateSessionControllerRequest, res: CreateSessionControllerResponse) {
    try {
      const validation = authenticateBodySchema.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json(createValidationErrorResponse(validation.error))
      }

      const { userName, password } = validation.data

      const userExists = await this.userRepository.getByUsuario(userName)

      if (!userExists) {
        return res.status(400).json({
          error: 'Dados de login incorretos'
        })
      }

      if (userExists.situacao === 'inativo') {
        return res.status(400).json({
          error: 'Usuário está inativo'
        })
      }

      const isPasswordValid = await this.hashComparer.compare(
        password,
        userExists.senha,
      )

      if (!isPasswordValid) {
        return res.status(400).json({
          error: 'Dados de login incorretos'
        })
      }

      const token = await this.encrypter.encrypt({
        sub: userExists.id.toString(),
      })

      const refreshToken = await this.encrypter.encrypt({
        sub: userExists.id.toString(),
        type: 'refresh',
      })

      const tokenExpiresInMs = new Date(Date.now() + 60 * 60 * 1000)

      const userToken = UserToken.create({
        refresh_token: refreshToken,
        id_usuario: userExists.id,
        expiracao_token: tokenExpiresInMs,
      })

      await this.authRepository.createSession(userToken)
      return res.status(200).json(createSuccessResponse('Login realizado com sucesso', {
        token,
        refreshToken,
        user: {
          id: userExists.id.toString(),
          nome: userExists.nome,
          usuario: userExists.usuario,
          perfil: userExists.perfil
        }
      }))
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(createValidationErrorResponse(error))
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      })
    }
  }
}
