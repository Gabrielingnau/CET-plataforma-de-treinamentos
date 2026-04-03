import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getStructureData } from "@/services/trainings/get-training-structure"
import { getQuestions } from "@/services/trainings/get-questions"
import { resetTrainingProgress } from "@/services/trainings/reset-training-progress"

interface UseExamIntroProps {
  userId: string | undefined
  trainingId: number
  userRole?: string
}

export function useExamIntro({ userId, trainingId, userRole }: UseExamIntroProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isAdmin = userRole === "admin"

  const { data: playerData, isLoading: loadingPlayer } = useQuery({
    queryKey: ["training-overview", trainingId, userId],
    queryFn: () => getStructureData(userId!, trainingId),
    enabled: !!userId,
  })

  const { data: examData, isLoading: loadingExam } = useQuery({
    queryKey: ["exam-questions", trainingId],
    queryFn: () => getQuestions(trainingId, "exam"),
    enabled: !!trainingId,
  })

  const { mutate: handleReset, isPending: isResetting } = useMutation({
    mutationFn: async () => {
      if (isAdmin) return // Admin não reseta progresso real
      
      if (!playerData?.training?.modulos || !userId) throw new Error("Dados ausentes")

      const modulos = playerData.training.modulos
      const allLessonIds = modulos
        .flatMap((m: any) => m.aulas?.map((a: any) => a.id) || [])
        .filter(Boolean)
      const moduleIds = modulos.map((m: any) => m.id).filter(Boolean)

      return resetTrainingProgress(userId, trainingId, allLessonIds, moduleIds)
    },
    onSuccess: () => {
      if (!isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["training-overview", trainingId] })
        queryClient.invalidateQueries({ queryKey: ["exam-questions", trainingId] })
        queryClient.removeQueries({ queryKey: ["exam-execution", trainingId] })
        toast.success("Progresso removido. Inicie sua revisão!")
        router.push(`/colaborador/treinamentos/${trainingId}/visualizar`)
      } else {
        toast.info("Modo Admin: Simulação de reset concluída.")
      }
    },
    onError: () => toast.error("Falha ao resetar. Tente novamente."),
  })

  // Admin está sempre elegível
  const totalModulos = playerData?.training.modulos?.length || 0
  const isEligible = isAdmin || (playerData?.passedQuizzes?.length || 0) >= totalModulos
  
  const status = {
    currentAttempts: playerData?.examAttempts?.length || 0,
    maxAttempts: playerData?.maxAttempts || 3,
    questionsCount: examData?.length || 0,
    hasPassed: playerData?.passedFinalExam ?? false,
    hasFailedDefinitively: !isAdmin && (playerData?.hasFailedDefinitively ?? false),
    minGrade: playerData?.training.pontuacao_aprovacao || 70,
    title: playerData?.training.titulo || ""
  }

  return {
    playerData,
    status,
    isEligible,
    isLoading: loadingPlayer || loadingExam,
    isResetting,
    handleReset,
    isAdmin
  }
}