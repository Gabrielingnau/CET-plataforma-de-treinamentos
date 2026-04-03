import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getStructureData } from "@/services/trainings/get-training-structure"
import { resetTrainingProgress } from "@/services/trainings/reset-training-progress"

interface UseExamResultProps {
  userId: string | undefined
  trainingId: number
}

export function useExamResult({ userId, trainingId }: UseExamResultProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // 1. Busca os dados consolidados do treinamento
  const { data, isLoading } = useQuery({
    queryKey: ["training-overview", trainingId, userId],
    queryFn: () => getStructureData(userId!, trainingId),
    enabled: !!userId,
  })

  // 2. Mutação para Reciclagem (Reset total)
  const { mutate: handleReset, isPending: isResetting } = useMutation({
    mutationFn: async () => {
      if (!data?.training?.modulos || !userId) return

      const modulos = data.training.modulos
      const allLessonIds = modulos
        .flatMap((m: any) => m.aulas?.map((a: any) => a.id) || [])
        .filter(Boolean)
      const moduleIds = modulos.map((m: any) => m.id).filter(Boolean)

      return resetTrainingProgress(userId, trainingId, allLessonIds, moduleIds)
    },
    onSuccess: () => {
      // Limpa caches para refletir o estado "zerado"
      queryClient.invalidateQueries({ queryKey: ["training-overview", trainingId] })
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] })

      toast.success("Reciclagem iniciada! Seus dados foram resetados.")
      router.push(`/colaborador/treinamentos/${trainingId}/visualizar`)
    },
    onError: () => {
      toast.error("Erro ao resetar progresso.")
    }
  })

  // 3. Helpers de UI (Cálculos derivados)
  const result = (() => {
    if (!data) return null

    const lastAttempt = data.examAttempts?.[0]
    const maxAttempts = data.maxAttempts || 3
    const currentAttemptsCount = data.examAttempts?.length || 0

    return {
      passed: lastAttempt?.passou ?? false,
      score: lastAttempt?.pontuacao ?? 0,
      attemptsUsed: currentAttemptsCount,
      remainingAttempts: Math.max(0, maxAttempts - currentAttemptsCount),
      hasFailedDefinitively: data.hasFailedDefinitively,
      maxAttempts
    }
  })()

  return {
    data,
    result,
    isLoading,
    isResetting,
    handleReset
  }
}