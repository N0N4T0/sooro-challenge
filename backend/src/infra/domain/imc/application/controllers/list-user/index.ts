import { UserRepository } from '@/infra/database/repositories/user-repository'

export class ListUserController {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async handle(req: any, res: any) {
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

      return res.status(200).json({
        user: userExists
      })
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error)
      return res.status(500).json({
        error: 'Erro interno do servidor',
        details: error.message
      })
    }
  }
}