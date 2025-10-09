import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import { jwt } from '@/lib/jwt'

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const token = storage.getItem('token')
  const userId = jwt.getUserId()

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
    retry: false,
    enabled: !!token, 
    staleTime: 5 * 60 * 1000, 
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.token) {
        storage.setItem('token', data.token)
        queryClient.setQueryData(['auth', 'me'], data.user)
        router.push('/dashboard')
      } else {
        console.error('No token received from login')
      }
    },
    onError: (error) => {
      console.error('Login error:', error)
    }
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      storage.setItem('token', data.token)
      queryClient.setQueryData(['auth', 'me'], data.user)
      router.push('/dashboard')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      storage.removeItem('token')
      queryClient.clear()
      router.push('/login')
    },
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}
