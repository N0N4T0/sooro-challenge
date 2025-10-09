import { api } from '@/lib/axios'
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types'
import { jwt } from '@/lib/jwt'

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<{ message: string; data: AuthResponse }>('/login', payload)
    return response.data.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async me(): Promise<AuthResponse['user']> {
    const userId = jwt.getUserId()
    if (!userId) {
      throw new Error('Token inválido ou não encontrado')
    }

    const response = await api.get<AuthResponse['user']>(`/auth/user/${userId}`)
    return response.data
  }
}
