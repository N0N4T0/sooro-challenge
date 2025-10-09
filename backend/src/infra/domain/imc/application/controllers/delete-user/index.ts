import { UserRepository } from "@/infra/database/repositories/user-repository"

export class DeleteUserController {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async handle(req: any, res: any) {
    try {
      const { id } = req.params

      const userExists = await this.userRepository.getByIdWithExams(id)
      if (!userExists) {
        return res.status(404).json({ error: `Usuário não encontrado` })
      }

      const hasExams = !!userExists.exams

      if (hasExams) {
        return res.status(400).json({ error: `Usuário possui exames` })
      }

      await this.userRepository.delete(id)

      return res.status(204).json({
        message: '',
      })
    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error)
      return res.status(500).json({
        error: 'Erro interno do servidor',
        details: error.message
      })
    }
  }
}