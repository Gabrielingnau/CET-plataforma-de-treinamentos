import { useMemo, useContext } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthContext } from "@/contexts/auth-context"
import { getStructureData } from "@/services/trainings/get-training-structure"
import { toggleLessonProgress } from "@/services/progress/toggle-lesson-progress"

interface UseLessonPlayerProps {
  userId: string | undefined
  trainingId: number
  currentLessonId: number
}

export function useLessonPlayer({ userId, trainingId, currentLessonId }: UseLessonPlayerProps) {
  const queryClient = useQueryClient()
  const { user } = useContext(AuthContext)
  const isAdmin = user?.role === "admin"

  const { data, isLoading } = useQuery({
    queryKey: ["training-overview", trainingId, userId],
    queryFn: () => getStructureData(userId!, trainingId),
    enabled: !!userId,
  })

  // 1. Memoização dos cálculos de aula e módulo
  const lessonData = useMemo(() => {
    const allModules = data?.training?.modulos || []
    
    const currentModule = allModules.find((m: any) =>
      m.aulas?.some((a: any) => a.id === currentLessonId)
    )
    
    const lessonsInModule = currentModule?.aulas || []
    const currentLessonIndex = lessonsInModule.findIndex((a: any) => a.id === currentLessonId)
    
    const lesson = lessonsInModule[currentLessonIndex]
    const nextLesson = lessonsInModule[currentLessonIndex + 1]
    
    const completedLessons = data?.completedLessons || []
    const quizDone = data?.passedQuizzes?.includes(Number(currentModule?.id)) || false
    
    const lessonsFinishedCount = completedLessons.filter((id: number) =>
      lessonsInModule.some((a: any) => a.id === id)
    ).length
    
    // Se for admin, o módulo é considerado finalizado para liberar navegação
    const moduleFinished = isAdmin ? true : (lessonsFinishedCount >= lessonsInModule.length)

    return {
      lesson,
      nextLesson,
      currentModule,
      lessonsInModule,
      currentLessonIndex,
      completedLessons,
      quizDone,
      moduleFinished,
      isAdmin 
    }
  }, [data, currentLessonId, isAdmin])

  // 2. Mutação com tratamento de erro de tipo para Admin
  const mutation = useMutation({
    mutationFn: async () => {
      // Se for admin, resolvemos a Promise sem chamar o serviço de banco
      if (isAdmin) return null

      return toggleLessonProgress({
        userId: userId!,
        lessonId: currentLessonId,
        trainingId,
        completed: true,
      })
    },
    onMutate: async () => {
      // Se for admin, não altera o cache local (evita "checks" falsos na UI)
      if (isAdmin) return

      await queryClient.cancelQueries({ queryKey: ["training-overview", trainingId, userId] })
      const previousData = queryClient.getQueryData(["training-overview", trainingId, userId])

      queryClient.setQueryData(["training-overview", trainingId, userId], (old: any) => {
        if (!old) return old
        const alreadyCompleted = old.completedLessons?.includes(currentLessonId)
        return {
          ...old,
          completedLessons: alreadyCompleted 
            ? old.completedLessons 
            : [...(old.completedLessons || []), currentLessonId]
        }
      })

      return { previousData }
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["training-overview", trainingId, userId], context.previousData)
      }
    },
    onSettled: () => {
      if (!isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["training-overview", trainingId, userId] })
        queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] })
      }
    }
  })

  return {
    ...lessonData,
    isLoading,
    // Se for admin, passamos uma função vazia para evitar até o disparo da mutação
    markAsCompleted: isAdmin ? () => {} : mutation.mutate
  }
}