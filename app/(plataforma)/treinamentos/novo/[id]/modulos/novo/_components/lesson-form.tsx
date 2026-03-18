"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { lessonSchema } from "@/types/forms/lesson-form"
import { createLesson } from "@/services/lessons/create-lesson"
import { updateLesson } from "@/services/lessons/update-lesson"
import { deleteLesson } from "@/services/lessons/delete-lesson"
import { uploadFile } from "@/services/storage/upload-file"
import { getVideoDuration } from "@/lib/utils/video-helpers" // Recomendação de helper
import { DeleteConfirmModal } from "./modal/delete-confirm-modal"

export function LessonForm({
  moduleId,
  trainingId,
  defaultValues,
  onCancel,
  nextOrdem,
}: any) {
  const [isUploading, setIsUploading] = useState(false)
  const isEditing = !!defaultValues
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue, // Adicionado para setar a duração automaticamente
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: yupResolver(lessonSchema),
    defaultValues: defaultValues || {
      module_id: moduleId,
      ordem: nextOrdem || undefined,
      titulo: "",
      descricao: "",
      video_url: "",
      texto_video: "",
      duracao_min: 0,
    },
  })

  // Função para tratar a mudança do vídeo e capturar duração
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const durationInSeconds = await getVideoDuration(file)
      const durationInMinutes = Math.ceil(durationInSeconds / 60)
      
      // Seta o valor no formulário e dispara a validação
      setValue("duracao_min", durationInMinutes, { shouldValidate: true })
      toast.info(`Duração detectada: ${durationInMinutes} min`)
    } catch (err) {
      console.error("Erro ao processar vídeo:", err)
    }
  }

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      let finalVideoUrl = defaultValues?.video_url || ""

      if (data.video_url && data.video_url[0] instanceof File) {
        setIsUploading(true)
        try {
          finalVideoUrl = await uploadFile(data.video_url[0], "video")
        } catch (error) {
          throw new Error("Erro ao fazer upload do vídeo")
        } finally {
          setIsUploading(false)
        }
      }

      const payload = {
        ...data,
        video_url: finalVideoUrl,
        module_id: moduleId,
        duracao_min: Number(data.duracao_min),
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
      toast.error(error.message || "Erro ao salvar aula.")
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
        <Input {...register("titulo")} />
        {errors.titulo && <p className="text-xs font-medium text-destructive">{errors.titulo.message as string}</p>}
      </div>  

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2 md:col-span-2">
          <Label>Arquivo de Vídeo</Label>
          <Input 
            type="file" 
            accept="video/*" 
            {...register("video_url", { onChange: handleVideoChange })} 
          />
          {errors.video_url && <p className="text-xs font-medium text-destructive">{errors.video_url.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label>Duração (min)</Label>
          <Input type="number" {...register("duracao_min")} />
          {errors.duracao_min && <p className="text-xs font-medium text-destructive">{errors.duracao_min.message as string}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descrição Curta</Label>
        <Input {...register("descricao")} />
        {errors.descricao && <p className="text-xs font-medium text-destructive">{errors.descricao.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>Conteúdo da Aula (Texto)</Label>
        <Textarea {...register("texto_video")} className="min-h-[150px]" />
        {errors.texto_video && <p className="text-xs font-medium text-destructive">{errors.texto_video.message as string}</p>}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isUploading ? "Enviando Vídeo..." : isSubmitting ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
        </Button>
      </div>
    </form>
  )
}