// _components/lesson-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { lessonSchema, LessonFormData } from "@/types/forms/lesson-form"
import { createLesson } from "@/services/lessons/create-lesson"
import { updateLesson } from "@/services/lessons/update-lesson"
import { deleteLesson } from "@/services/lessons/delete-lesson"
import { DeleteConfirmModal } from "./modal/delete-confirm-modal"

export function LessonForm({
  moduleId,
  trainingId,
  defaultValues,
  onCancel,
  nextOrdem,
}: any) {
  const isEditing = !!defaultValues
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LessonFormData>({
    resolver: yupResolver(lessonSchema),
    defaultValues: defaultValues || {
      module_id: moduleId,
      ordem: nextOrdem || 1,
      titulo: "",
      descricao: "",
      video_url: "",
      texto_video: "",
      duracao_min: 0,
    },
  })

  const saveMutation = useMutation({
    mutationFn: (data: LessonFormData) => {
      const payload = {
        ...data,
        module_id: moduleId, // Garante que o ID do módulo está presente
        duracao_min: Number(data.duracao_min), // Converte para número
        ordem: Number(isEditing ? defaultValues.ordem : nextOrdem),
      }
      return isEditing
        ? updateLesson(defaultValues.id, payload)
        : createLesson(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-structure", trainingId],
      })
      toast.success(isEditing ? "Aula atualizada" : "Aula criada")
      onCancel()
    },
    onError: (error: any) => {
      console.error(error)
      toast.error("Erro ao salvar aula. Verifique os dados.")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteLesson(defaultValues.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-structure", trainingId],
      })
      toast.success("Aula excluída")
      onCancel()
    },
  })

  return (
    <form
      onSubmit={handleSubmit((data) => saveMutation.mutate(data))}
      className="space-y-5"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold">
          {isEditing ? "Editar Aula" : "Nova Aula"}
        </h3>
        {isEditing && (
          <DeleteConfirmModal
            title={defaultValues.titulo}
            onConfirm={() => deleteMutation.mutate()}
          />
        )}
      </div>

      <div className="space-y-2">
        <Label>Título da Aula</Label>
        <Input
          {...register("titulo")}
          placeholder="Ex: Introdução ao sistema"
        />
        {errors.titulo && (
          <p className="text-xs text-destructive">{errors.titulo.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2 md:col-span-2">
          <Label>URL do Vídeo (YouTube/Vimeo)</Label>
          <Input {...register("video_url")} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label>Duração (min)</Label>
          <Input type="number" {...register("duracao_min")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descrição Curta</Label>
        <Input {...register("descricao")} />
      </div>

      <div className="space-y-2">
        <Label>Conteúdo da Aula (Texto)</Label>
        <Textarea {...register("texto_video")} className="min-h-[150px]" />
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : isEditing
              ? "Salvar Alterações"
              : "Criar Aula"}
        </Button>
      </div>
    </form>
  )
}
