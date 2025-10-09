import { api } from '@/lib/axios'
import { Exam, UserInformations } from '@/types'
import { jwt } from '@/lib/jwt'

export const examImcService = {
  async getExamsByUser(): Promise<UserInformations['exams']> {
    const userId = jwt.getUserId()
    if (!userId) {
      throw new Error('Token inválido ou não encontrado')
    }

    const response = await api.get<{ message: string; data: UserInformations }>(`/auth/user/${userId}`)
    return response.data.data.exams ?? []
  },

  async searchExams(nameOrUsername: string): Promise<Exam[]> {
    const response = await api.get<Promise<Exam[]>>(
      `/auth/exam-imc/${encodeURIComponent(nameOrUsername)}`
    )

    return response.data
  },

  async createExam(data: Omit<Exam, 'id' | 'created_at' | 'updated_at' | 'imc' | 'classificacao'>): Promise<Exam> {
    const response = await api.post<Exam>('/auth/exam-imc', data)
    return response.data
  }
}
