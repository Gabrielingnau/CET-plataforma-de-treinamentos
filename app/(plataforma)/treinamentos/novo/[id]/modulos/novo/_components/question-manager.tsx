// _components/question-manager.tsx
"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Edit2, HelpCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuestionForm } from "./question-form"
import { DeleteConfirmModal } from "./modal/delete-confirm-modal"
import { toast } from "sonner"

// Imports dos services que criamos
import { getQuizQuestions } from "@/services/quizzes/get-quiz-questions"
import { deleteQuizQuestion } from "@/services/quizzes/delete-quiz-question"
import { getExamQuestions } from "@/services/exams/get-exam-questions"
import { deleteExamQuestion } from "@/services/exams/delete-exam-question"

interface QuestionManagerProps {
  ownerId: number
  type: "quiz" | "exam"
  title: string
}

export function QuestionManager({
  ownerId,
  type,
  title,
}: QuestionManagerProps) {
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()

  const queryKey = ["questions", type, ownerId]

  // 1. Busca as questões baseada no tipo
  const { data: questions, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      type === "quiz" ? getQuizQuestions(ownerId) : getExamQuestions(ownerId),
  })

  // 2. Mutação para deletar
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      type === "quiz" ? deleteQuizQuestion(id) : deleteExamQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success("Pergunta removida")
    },
  })

  if (isLoading)
    return (
      <div className="p-10 text-center text-muted-foreground">
        Carregando questões...
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <HelpCircle className="text-orange-500" size={20} />
            {type === "quiz" ? "Quiz do Módulo" : "Prova Final"}
          </h2>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 bg-orange-500 hover:bg-orange-600"
          >
            <Plus size={16} /> Adicionar Pergunta
          </Button>
        )}
      </div>

      {showForm ? (
        <QuestionForm
          ownerId={ownerId}
          type={type}
          defaultValues={editingQuestion}
          onCancel={() => {
            setShowForm(false)
            setEditingQuestion(null)
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey })
            setShowForm(false)
            setEditingQuestion(null)
          }}
        />
      ) : (
        <div className="space-y-4">
          {questions?.length === 0 && (
            <div className="rounded-xl border-2 border-dashed py-10 text-center">
              <p className="text-muted-foreground italic">
                Nenhuma pergunta cadastrada ainda.
              </p>
            </div>
          )}

          {questions?.map((q: any, index: number) => (
            <div
              key={q.id}
              className="group rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-orange-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-700">
                      {index + 1}
                    </span>
                    <p className="leading-tight font-semibold text-foreground">
                      {q.pergunta}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                    {q.opcoes.map((opt: string, i: number) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 rounded-md border p-2 text-xs ${
                          opt === q.opcao_correta
                            ? "border-green-200 bg-green-50 font-medium text-green-700"
                            : "border-transparent bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        {opt === q.opcao_correta && <CheckCircle size={12} />}
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ml-4 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingQuestion(q)
                      setShowForm(true)
                    }}
                  >
                    <Edit2
                      size={16}
                      className="text-muted-foreground group-hover:text-primary"
                    />
                  </Button>
                  <DeleteConfirmModal
                    title="esta pergunta"
                    onConfirm={() => deleteMutation.mutate(q.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
