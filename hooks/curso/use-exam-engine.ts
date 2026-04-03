import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { getQuestions } from "@/services/trainings/get-questions"
import { getStructureData } from "@/services/trainings/get-training-structure"
import { submitExamAttempt } from "@/services/exams/submit-exam-attempt" // Import do service
import { toast } from "sonner"

interface UseExamEngineProps {
  userId: string | undefined
  trainingId: number
}

export function useExamEngine({ userId, trainingId }: UseExamEngineProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  // 1. Busca questões
  const { data: questions = [], isLoading: loadingExam } = useQuery({
    queryKey: ["exam-questions", trainingId],
    queryFn: () => getQuestions(trainingId, "exam"),
    enabled: !!trainingId,
  })

  // 2. Busca estrutura (nota de corte)
  const { data: playerData, isLoading: loadingPlayer } = useQuery({
    queryKey: ["training-overview", trainingId, userId],
    queryFn: () => getStructureData(userId!, trainingId),
    enabled: !!userId,
  })

  // 3. Mutação usando o novo Service
  const mutation = useMutation({
    mutationFn: (result: any) => submitExamAttempt({
      userId: userId!,
      trainingId,
      ...result
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-overview", trainingId] })
      router.push(`/colaborador/treinamentos/${trainingId}/prova/resultado`)
    },
    onError: (error: any) => {
      toast.error(error.message)
    }
  })

  // CÁLCULOS MEMOIZADOS (Performance)
  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1
  
  const progress = useMemo(() => {
    if (questions.length === 0) return 0
    return ((currentStep + 1) / questions.length) * 100
  }, [currentStep, questions.length])

  const canGoNext = !!answers[currentStep]

  // AÇÕES
  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: option }))
  }

  const submitExam = () => {
    if (mutation.isPending || !playerData || !userId) return

    let correctCount = 0
    questions.forEach((q: any, index: number) => {
      if (answers[index] === q.opcao_correta) correctCount++
    })

    const score = Math.round((correctCount / questions.length) * 100)
    const minScoreRequired = playerData?.training.pontuacao_aprovacao || 70
    const passed = score >= minScoreRequired

    mutation.mutate({
      score,
      passed,
      responses: answers,
    })
  }

  const handleNext = () => {
    if (isLastStep) {
      submitExam()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  return {
    questions,
    currentQuestion,
    currentStep,
    progress,
    answers,
    isLoading: loadingExam || loadingPlayer,
    isSubmitting: mutation.isPending,
    isLastStep,
    canGoNext,
    handleSelectOption,
    handleNext,
    handlePrevious,
  }
}