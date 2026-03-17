// _components/question-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { yupResolver } from "@hookform/resolvers/yup"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { questionSchema, QuestionFormData } from "@/types/forms/question-form"
import { createQuizQuestion } from "@/services/quizzes/create-quiz-question"
import { updateQuizQuestion } from "@/services/quizzes/update-quiz-question"
import { createExamQuestion } from "@/services/exams/create-exam-question"
import { updateExamQuestion } from "@/services/exams/update-exam-question"

export function QuestionForm({
  ownerId,
  type,
  defaultValues,
  onCancel,
  onSuccess,
}: any) {
  const isEditing = !!defaultValues

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormData>({
    // Adicionamos 'as any' aqui porque o yupResolver e o React Hook Form
    // às vezes divergem na interpretação de campos opcionais/nulos.
    resolver: yupResolver(questionSchema) as any,
    defaultValues: (defaultValues || {
      pergunta: "",
      opcoes: ["", "", "", ""],
      opcao_correta: "",
      // Usamos 'as any' ou null para satisfazer a tipagem inicial
      module_id: type === "quiz" ? ownerId : undefined,
      training_id: type === "exam" ? ownerId : undefined,
    }) as QuestionFormData,
  })

  const watchOptions = watch("opcoes")
  const watchCorrect = watch("opcao_correta")

  const onSubmit = async (data: QuestionFormData) => {
    try {
      if (type === "quiz") {
        isEditing
          ? await updateQuizQuestion(defaultValues.id, data)
          : await createQuizQuestion({ ...data, module_id: ownerId })
      } else {
        isEditing
          ? await updateExamQuestion(defaultValues.id, data)
          : await createExamQuestion({ ...data, training_id: ownerId })
      }
      toast.success("Pergunta salva com sucesso!")
      onSuccess()
    } catch (error) {
      toast.error("Erro ao salvar pergunta")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-accent bg-accent/20 p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="pergunta">Enunciado da Pergunta</Label>
        <Input
          id="pergunta"
          {...register("pergunta")}
          placeholder="Ex: O que significa a sigla RLS?"
          className="bg-background"
        />
        {errors.pergunta && (
          <p className="text-xs text-destructive">{errors.pergunta.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label>Alternativas (Marque a correta)</Label>
        <RadioGroup
          value={watchCorrect}
          onValueChange={(val) => setValue("opcao_correta", val)}
          className="space-y-3"
        >
          {watchOptions.map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <RadioGroupItem
                value={watchOptions[index]}
                id={`opt-${index}`}
                disabled={!watchOptions[index]}
              />
              <Input
                {...register(`opcoes.${index}`)}
                placeholder={`Opção ${index + 1}`}
                className="bg-background"
                onChange={(e) => {
                  const val = e.target.value
                  // Se mudar a opção que era a correta, atualiza o valor da correta também
                  if (watchCorrect === watchOptions[index]) {
                    setValue("opcao_correta", val)
                  }
                  setValue(`opcoes.${index}`, val)
                }}
              />
            </div>
          ))}
        </RadioGroup>
        {errors.opcoes && (
          <p className="text-xs text-destructive">{errors.opcoes.message}</p>
        )}
        {errors.opcao_correta && (
          <p className="text-xs text-destructive">
            {errors.opcao_correta.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {isSubmitting
            ? "Salvando..."
            : isEditing
              ? "Atualizar Pergunta"
              : "Salvar Pergunta"}
        </Button>
      </div>
    </form>
  )
}
