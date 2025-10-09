import { ExamImcRepository } from '@/infra/database/repositories/exam-imc-repository'
import { ExamIMC } from '../../../enterprise/entities'
import { UserRepository } from '@/infra/database/repositories/user-repository'

export class CreateExamImcController {
  constructor(
    private readonly examImcRepository: ExamImcRepository,
    private readonly userRepository: UserRepository,
  ) { }

  async handle(req: any, res: any) {
    try {
      const { id: userId, professionalId } = req.params
      const { altura, peso, imc, classificacao } = req.body

      if (!userId || !professionalId) {
        return res.status(400).json({
          error: 'Id é necessário para cadastro de IMC'
        })
      }

      const userExists = await this.userRepository.getById(userId)
      const professionalExists = await this.userRepository.getById(professionalId)

      if (!userExists || !professionalExists) {
        return res.status(400).json({
          error: `Usuário não encontrado`
        })
      }

      if (!altura || !peso || !imc || !classificacao) {
        return res.status(400).json({
          error: 'Todos os campos são obrigatórios: altura, peso, imc, classificacao'
        })
      }

      if (userExists.situacao === 'inativo') {
        return res.status(400).json({
          error: 'Usuário está inativo'
        })
      }

      const examImc = ExamIMC.create({
        altura,
        peso,
        imc,
        classificacao,
        id_usuario_avaliacao: professionalId,
        id_usuario_aluno: userId,
        dt_inclusao: new Date(),
      })

      await this.examImcRepository.create(examImc)

      return res.status(201).json({
        message: 'Exame IMC criado com sucesso',
        examImc
      })
    } catch (error) {
      console.error('Erro ao criar exame IMC:', error)
      return res.status(500).json({
        error: 'Erro ao criar exame IMC'
      })
    }
  }
}