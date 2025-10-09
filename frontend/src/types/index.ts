export interface User {
  id: string
  nome: string
  email: string
  created_at: string
  updated_at: string
}

export interface Exam {
  id: string
  altura: number
  peso: number
  imc: number
  classificacao: string
  id_usuario_avaliacao: string
  dt_inclusao: string
}

export interface UserInformations {
  id: string
  nome: string
  usuario: string
  perfil: string
  situacao: string
  dt_inclusao: string
  exams: Exam[]
}

export interface ExamIMC {
  id: string
  id_usuario_avaliacao: string
  id_usuario_aluno: string
  peso: number
  altura: number
  imc: number
  classificacao: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  userName: string
  password: string
}

export interface RegisterRequest {
  nome: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: {
    id: string
    nome: string
    usuario: string
    perfil: string
  }
}

export interface ApiError {
  message: string
  status: number
}
