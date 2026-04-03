import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { 
  getStructureData, 
  updateTrainingStatusToReady 
} from "@/services/trainings/get-training-structure"

interface UseTrainingStructureProps {
  userId: string | undefined
  trainingId: number
}

export function useTrainingStructure({ userId, trainingId }: UseTrainingStructureProps) {
  const queryClient = useQueryClient()

  // 1. Busca os dados (Query)
  const query = useQuery({
    queryKey: ["training-overview", trainingId, userId],
    queryFn: () => getStructureData(userId!, trainingId),
    enabled: !!userId,
  })

  const { data } = query

  // 2. Cálculos Memorizados (Evita re-processamento desnecessário)
  const stats = useMemo(() => {
    if (!data?.training) return { isEligible: false, totalLessons: 0, totalModules: 0 }

    const allModules = data.training.modulos || []
    const totalLessons = allModules.flatMap((m) => m.aulas || []).length
    const totalModules = allModules.length
    
    const isEligible = 
      (data.completedLessons?.length || 0) >= totalLessons && 
      (data.passedQuizzes?.length || 0) >= totalModules

    return { isEligible, totalLessons, totalModules }
  }, [data])

  // 3. Efeito de Sincronização (Side Effect)
  useEffect(() => {
    const syncStatus = async () => {
      if (!data || !userId || !stats.isEligible) return

      // Só dispara o update se o status atual não for "pronto_para_prova"
      if (data.status !== "pronto_para_prova" && !data.passedFinalExam) {
        try {
          await updateTrainingStatusToReady(userId, trainingId)
          
          // Invalida para atualizar o 'status' no objeto 'data'
          queryClient.invalidateQueries({ queryKey: ["training-overview", trainingId, userId] })
          queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] })
        } catch (err) {
          console.error("Erro na sincronização de status:", err)
        }
      }
    }

    syncStatus()
  }, [data, userId, trainingId, stats.isEligible, queryClient])

  // Retorna tudo o que a página precisa
  return {
    ...query, // isLoading, error, data, etc.
    ...stats, // isEligible, totalLessons, totalModules
  }
}