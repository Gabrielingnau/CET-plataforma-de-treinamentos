"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { updateTemplate } from "@/services/certificates/templates/update-template"
import { validateTemplatePDF } from "@/lib/utils/pdf-validator"
import { CertificateTemplate } from "@/types/database/template"

export function useUpdateTemplate(template: CertificateTemplate | null, onSuccess: () => void) {
  const [isUploading, setIsUploading] = useState(false)
  const [validation, setValidation] = useState<{ isValid: boolean; missingFields: string[] } | null>(null)
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      titulo: "",
      descricao: "",
      capa_imagem: null as FileList | null,
      arquivo_pdf: null as FileList | null,
    },
  })

  // Sincroniza campos de texto ao abrir
  useEffect(() => {
    if (template) {
      form.reset({
        titulo: template.titulo,
        descricao: template.descricao || "",
        capa_imagem: null,
        arquivo_pdf: null,
      })
      setValidation(null)
    }
  }, [template, form])

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return setValidation(null)
    const res = await validateTemplatePDF(file)
    setValidation(res)
  }

  const onSubmit = async (data: any) => {
    if (!template) return
    
    try {
      setIsUploading(true)

      // Preparamos os arquivos (se houver novos)
      const novoPdf = data.arquivo_pdf?.[0] || null
      const novaCapa = data.capa_imagem?.[0] || null

      // Chamamos o serviço passando o ID e os novos arquivos opcionais
      await updateTemplate(
        template.id, 
        { titulo: data.titulo, descricao: data.descricao },
        novoPdf,
        novaCapa
      )

      toast.success("Template atualizado com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["templates-list"] })
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar template.")
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