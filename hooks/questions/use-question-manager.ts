"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// Importamos apenas a função genérica e as de exclusão
import { getQuestions } from "@/services/trainings/get-questions"
import { deleteQuizQuestion } from "@/services/quizzes/delete-quiz-question"
import { deleteExamQuestion } from "@/services/exams/delete-exam-question"

interface UseQuestionManagerProps {
  ownerId: number // ID do Módulo (se quiz) ou ID do Treinamento (se exam)
  type: "quiz" | "exam"
}

export function useQuestionManager({ ownerId, type }: UseQuestionManagerProps) {
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()

  // Chave de cache única por tipo e ID do dono
  const queryKey = ["questions", type, ownerId]

  // BUSCA ÚNICA E DINÂMICA
  const { data: questions, isLoading } = useQuery({
    queryKey,
    queryFn: () => getQuestions(ownerId, type), // Passa o ownerId como targetId
    enabled: !!ownerId, // Só executa se tiver um ID
  })

  // EXCLUSÃO DINÂMICA
  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      type === "quiz" ? deleteQuizQuestion(id) : deleteExamQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success("Pergunta removida com sucesso")
    },
    onError: () => toast.error("Erro ao remover pergunta")
  })

  const handleEdit = (question: any) => {
    setEditingQuestion(question)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingQuestion(null)
  }

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey })
    handleCloseForm()
  }

  return {
    questions: questions || [], // Retorna array vazio por padrão
    isLoading,
    showForm,
    setShowForm,
    editingQuestion,
    deleteMutation,
    handleEdit,
    handleCloseForm,
    handleSuccess,
    queryKey
  }
}