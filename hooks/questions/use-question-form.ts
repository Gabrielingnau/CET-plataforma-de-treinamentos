"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "sonner"
import { questionSchema, QuestionFormData } from "@/types/forms/question-form"
import { createQuizQuestion } from "@/services/quizzes/create-quiz-question"
import { updateQuizQuestion } from "@/services/quizzes/update-quiz-question"
import { createExamQuestion } from "@/services/exams/create-exam-question"
import { updateExamQuestion } from "@/services/exams/update-exam-question"

export interface UseQuestionFormProps {
  ownerId: string
  type: "quiz" | "exam"
  defaultValues?: any
  onSuccess: () => void
}

export function useQuestionForm({
  ownerId,
  type,
  defaultValues,
  onSuccess,
}: UseQuestionFormProps) {
  const isEditing = !!defaultValues

  const form = useForm<QuestionFormData>({
    resolver: yupResolver(questionSchema) as any,
    defaultValues: (defaultValues || {
      pergunta: "",
      opcoes: ["", "", "", ""],
      opcao_correta: "",
      module_id: type === "quiz" ? Number(ownerId) : undefined,
      training_id: type === "exam" ? Number(ownerId) : undefined,
    }) as QuestionFormData,
  })

  const { watch, setValue, handleSubmit, formState: { errors, isSubmitting } } = form

  const watchOptions = watch("opcoes")
  const watchCorrect = watch("opcao_correta")

  const onSubmit = handleSubmit(async (data: QuestionFormData) => {
    try {
      if (type === "quiz") {
        isEditing
          ? await updateQuizQuestion(defaultValues.id, data)
          : await createQuizQuestion({ ...data, module_id: Number(ownerId) })
      } else {
        isEditing
          ? await updateExamQuestion(defaultValues.id, data)
          : await createExamQuestion({ ...data, training_id: Number(ownerId) })
      }
      toast.success("Pergunta salva com sucesso!")
      onSuccess()
    } catch (error) {
      toast.error("Erro ao salvar pergunta")
      console.error(error)
    }
  })

  return {
    form,
    register: form.register,
    errors,
    isSubmitting,
    watchOptions,
    watchCorrect,
    setValue,
    isEditing,
    onSubmit,
  }
}