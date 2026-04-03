"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { templateSchema } from "@/types/forms/template-form"
import { validateTemplatePDF } from "@/lib/utils/pdf-validator"
import { createTemplate as createTemplateService } from "@/services/certificates/templates/create-template"

export function useCreateTemplate(onSuccess: () => void) {
  const [isUploading, setIsUploading] = useState(false)
  const [validation, setValidation] = useState<{
    isValid: boolean
    missingFields: string[]
  } | null>(null)
  
  const queryClient = useQueryClient()

  const form = useForm<any>({
    resolver: yupResolver(templateSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
    }
  })

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setValidation(null)
      return
    }
    const res = await validateTemplatePDF(file)
    setValidation(res)
  }

  const onSubmit = async (data: any) => {
    try {
      setIsUploading(true)
      
      await createTemplateService(
        { titulo: data.titulo, descricao: data.descricao },
        data.arquivo_pdf[0],
        data.capa_imagem[0]
      )

      toast.success("Template cadastrado com sucesso!")
      
      // Invalida a query para atualizar a lista automaticamente
      queryClient.invalidateQueries({ queryKey: ["templates-list"] })
      
      form.reset()
      setValidation(null)
      onSuccess() // Fecha o modal
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar template.")
    } finally {
      setIsUploading(false)
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isUploading,
    validation,
    handlePdfChange,
    selectedCapa: form.watch("capa_imagem"),
    selectedPdf: form.watch("arquivo_pdf"),
    errors: form.formState.errors,
  }
}