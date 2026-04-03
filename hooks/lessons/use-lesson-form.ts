"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { lessonSchema, LessonFormData } from "@/types/forms/lesson-form"
import { Lesson, CreateLessonPayload, UpdateLessonPayload } from "@/types/database/lessons"
import { createLesson } from "@/services/lessons/create-lesson"
import { updateLesson } from "@/services/lessons/update-lesson"
import { deleteLesson } from "@/services/lessons/delete-lesson"
import { uploadFile } from "@/services/storage/upload-file"
import { getVideoDuration } from "@/lib/utils/video-helpers"

interface UseLessonFormProps {
  moduleId: string
  trainingId: string
  defaultValues?: Lesson
  onCancel: () => void
  nextOrdem?: number
}

export function useLessonForm({ 
  moduleId, 
  trainingId, 
  defaultValues, 
  onCancel, 
  nextOrdem 
}: UseLessonFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const isEditing = !!defaultValues
  const queryClient = useQueryClient()

  const form = useForm<LessonFormData>({
    resolver: yupResolver(lessonSchema) as any,
    defaultValues: {
      module_id: Number(moduleId),
      ordem: defaultValues?.ordem ?? nextOrdem ?? 1,
      titulo: defaultValues?.titulo ?? "",
      descricao: defaultValues?.descricao ?? "",
      video_url: defaultValues?.video_url ?? "", 
      texto_video: defaultValues?.texto_video ?? "",
      duracao_min: defaultValues?.duracao_min ?? 0,
    },
  })

  const { register, handleSubmit, setValue, formState: { errors } } = form

  // Manipula a seleção do vídeo e extrai metadados
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSelectedFile(file)
      
      const durationInSeconds = await getVideoDuration(file)
      const durationInMinutes = Math.ceil(durationInSeconds / 60)
      
      setValue("duracao_min", durationInMinutes, { shouldValidate: true })
      // Marcamos que há um novo arquivo para o Yup não barrar por falta de URL
      setValue("video_url", "new_upload", { shouldValidate: true }) 
      
      toast.info(`Duração detectada: ${durationInMinutes} min`)
    } catch (err) {
      console.error("Erro ao processar vídeo:", err)
      toast.error("Não foi possível processar o vídeo selecionado.")
    }
  }

  // Mutation para Criar ou Editar
  const saveMutation = useMutation({
    mutationFn: async (data: LessonFormData) => {
      let finalVideoUrl = defaultValues?.video_url || ""

      // Se um novo arquivo foi selecionado, fazemos o upload antes de salvar a aula
      if (selectedFile) {
        setIsUploading(true)
        try {
          finalVideoUrl = await uploadFile(selectedFile, "video")
        } catch (error) {
          throw new Error("Falha ao realizar upload do vídeo.")
        } finally {
          setIsUploading(false)
        }
      }

      const payload: CreateLessonPayload = {
        titulo: data.titulo,
        descricao: data.descricao,
        texto_video: data.texto_video,
        video_url: finalVideoUrl,
        module_id: Number(moduleId),
        duracao_min: Number(data.duracao_min),
        ordem: Number(data.ordem),
      }

      return isEditing
        ? updateLesson(defaultValues!.id, payload as UpdateLessonPayload)
        : createLesson(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-structure", trainingId] })
      toast.success(isEditing ? "Aula atualizada com sucesso!" : "Aula criada com sucesso!")
      onCancel()
    },
    onError: (error: any) => toast.error(error.message || "Erro ao salvar aula"),
  })

  // Mutation para Deletar
  const deleteMutation = useMutation({
    mutationFn: () => deleteLesson(defaultValues!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-structure", trainingId] })
      toast.success("Aula removida permanentemente.")
      onCancel()
    },
    onError: () => toast.error("Erro ao excluir a aula.")
  })

  return {
    register,
    errors,
    isPending: saveMutation.isPending || isUploading,
    isDeleting: deleteMutation.isPending,
    isEditing,
    handleVideoChange,
    handleDelete: () => deleteMutation.mutate(),
    onSubmit: handleSubmit((data) => saveMutation.mutate(data)),
  }
}