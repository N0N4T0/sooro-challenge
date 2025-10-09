import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { UserRepository } from '@/infra/database/repositories/user-repository'
import { User } from '@/infra/domain/imc'
import { UniqueEntityID } from '@/core/entities'

export class RegisterUserController {
  constructor(
    private readonly hashGenerator: BcryptHasher,
    private readonly userRepository: UserRepository,
  ) { }

  async handle(req: any, res: any) {
    try {
      const { name, userName, password, perfil } = req.body

      if (!name || !userName || !password || !perfil) {
        return res.status(400).json({
          error: 'Todos os campos são obrigatórios: name, userName, password, perfil'
        })
      }

      if (!['admin', 'aluno', 'professor'].includes(perfil)) {
        return res.status(400).json({
          error: 'Perfil inválido.'
        })
      }

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
      return res.status(500).json({
        error: 'Erro interno do servidor',
        details: error.message
      })
    }
  }
}