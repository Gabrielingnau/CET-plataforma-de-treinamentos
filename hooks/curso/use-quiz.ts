import { useState, useContext } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthContext } from "@/contexts/auth-context"
import { getQuestions } from "@/services/trainings/get-questions"
import { submitAttempt } from "@/services/progress/submit-attempt"

interface UseQuizProps {
  userId: string | undefined
  trainingId: number
  moduleId: number
}

export function useQuiz({ userId, trainingId, moduleId }: UseQuizProps) {
  const queryClient = useQueryClient()
  const { user } = useContext(AuthContext)
  const isAdmin = user?.role === "admin"
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isFinished, setIsFinished] = useState(false)

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions", moduleId],
    queryFn: () => getQuestions(moduleId, "quiz"),
  })

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      // BYPASS ADMIN: Se for admin, simula o retorno do servidor
      if (isAdmin) {
        return {
          pontuacao: payload.pontuacao,
          passou: payload.passou,
          respostas_corretas: Object.values(payload.respostas).length, // Simulação simples
          total_questoes: questions?.length
        }
      }
      return submitAttempt(payload)
    },
    onSuccess: () => {
      if (!isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["training-overview", trainingId, userId] })
        queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] })
      }
      setIsFinished(true)
    },
  })

  const currentQuestion = questions?.[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === (questions?.length || 0) - 1
  const hasSelectedOption = !!currentQuestion && !!answers[currentQuestion.id]
  const progress = ((currentQuestionIndex + 1) / (questions?.length || 1)) * 100

  const handleNext = () => {
    if (isLastQuestion) {
      handleFinish()
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleFinish = () => {
    if (!questions || !userId) return

    let correctCount = 0
    questions.forEach((q: any) => {
      if (answers[q.id] === q.opcao_correta) correctCount++
    })
    
    const score = Math.round((correctCount / questions.length) * 100)

    mutation.mutate({
      user_id: userId,
      module_id: moduleId,
      respostas: answers,
      pontuacao: score,
      passou: score >= 70,
      type: "quiz",
    })
  }

  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }))
  }

  const resetQuiz = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setIsFinished(false)
    mutation.reset()
  }

  return {
    questions,
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    isFinished,
    isLastQuestion,
    hasSelectedOption,
    progress,
    mutationData: mutation.data,
    isSubmitting: mutation.isPending,
    handleNext,
    handleSelectOption,
    resetQuiz,
    answers,
    isAdmin
  }
}