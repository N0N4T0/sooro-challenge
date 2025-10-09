import { ExamIMCResponse } from "./exam-imc-response"

export interface UserWithExamImcResponse {
  id: string,
  nome: string,
  usuario: string,
  perfil: string,
  situacao: string,
  dt_inclusao: Date,
  exams?: ExamIMCResponse[]
}