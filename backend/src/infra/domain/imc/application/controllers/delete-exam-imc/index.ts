import { Request, Response } from 'express'
import { ExamImcRepository } from "@/infra/database/repositories/exam-imc-repository"

export class DeleteExamImcController {
  constructor(
    private readonly examImcRepository: ExamImcRepository,
  ) { }

  async handle(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({ error: "Id é necessário para exclusão de IMC" })
      }

      const examImcExists = await this.examImcRepository.getExamImcById(id)
      if (!examImcExists) {
        return res.status(404).json({ error: `Exame IMC ${id} não encontrado` })
      }

      await this.examImcRepository.delete(id)

      return res.status(204).json({
        message: '',
      })
    } catch (error: any) {
      console.error('Erro ao deletar exame IMC:', error)
      return res.status(500).json({
        error: 'Erro interno do servidor',
        details: error.message
      })
    }
  }
}