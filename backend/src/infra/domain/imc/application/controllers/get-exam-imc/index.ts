import { ExamImcRepository } from "@/infra/database/repositories/exam-imc-repository"

export class GetExamImcController {
  constructor(
    private readonly examImcRepository: ExamImcRepository,
  ) { }

  async handle(req: any, res: any) {
    try {
      const { nameOrUsername } = req.params

      if (!nameOrUsername) {
        return res.status(400).json({ error: "Name or username é necessário para exclusão de IMC" })
      }

      const examImcExists = await this.examImcRepository.getExamImcByNameOrUsername(nameOrUsername)
      if (!examImcExists) {
        return res.status(404).json({ error: `Exame IMC ${nameOrUsername} não encontrado` })
      }

      return res.status(200).json(examImcExists)
    } catch (error: any) {
      console.error('Erro ao buscar exame IMC:', error)
      return res.status(500).json({
        error: 'Erro interno do servidor',
        details: error.message
      })
    }
  }
}