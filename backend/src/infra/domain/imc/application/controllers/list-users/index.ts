import { UsersRepository } from '@/infra/database/repositories/users-repository'

export class ListUsersController {
  constructor(
    private readonly userRepository: UsersRepository,
  ) { }
  async handle(req: any, res: any) {
    try {
      const users = await this.userRepository.getUsers()

      return res.status(200).json({
        message: 'Usuários listados com sucesso',
        users: users,
        total: users.length
      })
    } catch (error: any) {
      console.error('Erro ao listar usuários:', error)
      return res.status(500).json({
        error: 'Erro interno do servidor',
        details: error.message
      })
    }
  }
}