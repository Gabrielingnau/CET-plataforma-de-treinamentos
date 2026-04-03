"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { trainingSchema, TrainingFormData } from "@/types/forms/training-form"
import { uploadFile } from "@/services/storage/upload-file"
import { updateTraining } from "@/services/trainings/update-training"
import { getActiveCertificateTemplates } from "@/services/certificates/get-active-templates"

export function useEditTraining(training: any) {
  const [open, setOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(training.cover_url || null)
  const queryClient = useQueryClient()

  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["templates-ativos"],
    queryFn: getActiveCertificateTemplates,
  })

  const { 
    register, 
    handleSubmit, 
    control, 
    setValue, 
    formState: { errors } 
  } = useForm<TrainingFormData>({
    resolver: yupResolver(trainingSchema),
    defaultValues: {
      titulo: training.titulo ?? "",
      descricao: training.descricao ?? "",
      carga_horaria: training.carga_horaria ?? 0,
      pontuacao_aprovacao: Number(training.pontuacao_aprovacao) || 0,
      max_exam_tentativas: Number(training.max_exam_tentativas) || 1,
      template_id: training.template_id ? String(training.template_id) : "",
      cover_url: training.cover_url ?? "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: TrainingFormData) => {
      let finalCoverUrl: string = training.cover_url

      if (data.cover_url instanceof FileList && data.cover_url.length > 0) {
        finalCoverUrl = await uploadFile(data.cover_url[0], "imagem")
      }

      // Criamos o objeto de update respeitando o que o SERVICE espera (Partial)
      // Fazemos o cast apenas para garantir que a transformação de string -> number bata com o banco
      const payload = { 
        titulo: data.titulo,
        descricao: data.descricao,
        carga_horaria: data.carga_horaria,
        pontuacao_aprovacao: data.pontuacao_aprovacao,
        max_exam_tentativas: data.max_exam_tentativas,
        cover_url: finalCoverUrl, 
        // Conversão crucial: String da UI -> Number do Banco
        template_id: data.template_id ? Number(data.template_id) : null 
      }

      // Se o seu updateTraining usa Partial do tipo do banco, 
      // passamos o payload que agora tem o template_id como number | null
      return updateTraining(training.id, payload as any) 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-structure", training.id] })
      queryClient.invalidateQueries({ queryKey: ["trainings"] })
      toast.success("Treinamento atualizado!")
      setOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar")
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
      setValue("cover_url", e.target.files!, { shouldValidate: true });
    }
  };

  return {
    open,
    setOpen,
    register,
    control,
    errors,
    previewImage,
    templates,
    isLoadingTemplates,
    isPending,
    handleImageChange,
    onSubmit: handleSubmit((data) => mutate(data)),
  }
}