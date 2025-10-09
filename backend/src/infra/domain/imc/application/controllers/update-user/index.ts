import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher"
import { UserRepository } from "@/infra/database/repositories/user-repository"

export class UpdateUserController {
  constructor(
    private readonly hashGenerator: BcryptHasher,
    private readonly userRepository: UserRepository,
  ) { }

  async handle(req: any, res: any) {
    try {
      const { id } = req.params
      const { name, userName, password, perfil } = req.body

      if (!id || !name || !userName || !password || !perfil) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" })
      }

      const userExists = await this.userRepository.getByIdWithExams(id)
      if (!userExists) {
        return res.status(404).json({ error: `Usuário ${id} não encontrado` })
      }

      if (!['admin', 'aluno', 'professor'].includes(perfil)) {
        return res.status(400).json({
          error: 'Perfil inválido.'
        })
      }

      const passwordHash = await this.hashGenerator.hash(password)
      await this.userRepository.update(id, name, userName, passwordHash, perfil)

      return res.status(204).json({
        message: '',
      })
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error)
      return res.status(500).json({
        error: 'Erro interno do servidor',
        details: error.message
      })
    }
  }
}