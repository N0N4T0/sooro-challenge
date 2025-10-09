import { ExamImcRepository } from "@/infra/database/repositories/exam-imc-repository"

export class UpdateExamImcController {
  constructor(
    private readonly examImcRepository: ExamImcRepository,
  ) { }

  async handle(req: any, res: any) {
    try {
      const { id } = req.params
      const { altura, peso, imc, classificacao } = req.body

      if (!id || !altura || !peso || !imc || !classificacao) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" })
      }

      const examImcExists = await this.examImcRepository.getExamImcById(id)
      if (!examImcExists) {
        return res.status(404).json({ error: `Exame IMC ${id} não encontrado` })
      }

      await this.examImcRepository.update(id, { altura, peso, imc, classificacao })

      return res.status(204).json({
        message: '',
      })
    } catch (error: any) {
      console.error('Erro ao atualizar exame IMC:', error)
      return res.status(500).json({
        error: 'Erro interno do servidor',
        details: error.message
      })
    }
  }
}