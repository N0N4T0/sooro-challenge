import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { examImcService } from '@/services/exam-imc'
import { jwt } from '@/lib/jwt'
import { storage } from '@/lib/storage'

export function useExamIMC() {
  const queryClient = useQueryClient()

  const useExamsByUser = () => {
    const userId = jwt.getUserId()
    return useQuery({
      queryKey: ['exams', 'user', userId],
      queryFn: examImcService.getExamsByUser,
      enabled: !!storage.getItem('token') && !!userId,
    })
  }

  const useSearchExams = (query: string) => {
    return useQuery({
      queryKey: ['exams', 'search', query],
      queryFn: () => examImcService.searchExams(query),
      enabled: !!query && query.length > 2 && !!storage.getItem('token'),
    })
  }

  const createExamMutation = useMutation({
    mutationFn: examImcService.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] })
    },
  })

  return {
    useExamsByUser,
    useSearchExams,
    createExam: createExamMutation.mutate,
    isCreatingExam: createExamMutation.isPending,
    createExamError: createExamMutation.error,
  }
}
