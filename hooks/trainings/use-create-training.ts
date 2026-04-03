"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useAuth } from "@/hooks/auth/use-auth"
import { trainingSchema, TrainingFormData } from "@/types/forms/training-form"
import { uploadFile } from "@/services/storage/upload-file"
import { createTraining } from "@/services/trainings/create-training"
import { getActiveCertificateTemplates } from "@/services/certificates/get-active-templates"

export function useCreateTraining() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const router = useRouter()

  // 1. Busca os templates ativos para injetar no formulário
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
      pontuacao_aprovacao: 70,
      max_exam_tentativas: 3,
      template_id: "", // Inicializa vazio para o Select
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: TrainingFormData) => {
      if (!user?.id) throw new Error("Sessão expirada.")

      let finalCoverUrl = ""
      const coverValue = data.cover_url

      if (coverValue instanceof FileList && coverValue.length > 0) {
        finalCoverUrl = await uploadFile(coverValue[0], "imagem")
      } else if (typeof coverValue === "string") {
        finalCoverUrl = coverValue
      }

      const payload = {
        ...data,
        cover_url: finalCoverUrl,
        criado_por: user.id,
        // Conversão UI (string) -> DB (number)
        template_id: data.template_id ? Number(data.template_id) : null,
      }

      return await createTraining(payload)
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["trainings"] })
      toast.success("Treinamento base criado!")
      router.push(`/admin/treinamentos/novo/${result.id}/modulos/novo`)
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar treinamento.")
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
      
      setValue("cover_url", e.target.files as unknown as FileList, { shouldValidate: true })
    }
  }

  return {
    register,
    control,
    errors,
    previewImage,
    templates, // Retornando a lista de templates
    isLoadingTemplates,
    isPending,
    handleImageChange,
    onSubmit: handleSubmit((data) => mutate(data)),
  }
}