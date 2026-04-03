"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { toast } from "sonner"
import { yupResolver } from "@hookform/resolvers/yup"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { updateFullCompany } from "@/services/companies/update-company"
import {
  editCompanySchema,
  EditCompanyFormData,
} from "@/types/forms/edit-company-form"
import { getTrainingsList } from "@/services/trainings/get-training"

export function useEditCompany(empresa: any) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dados")
  const [isSaving, setIsSaving] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<EditCompanyFormData>({
    resolver: yupResolver(editCompanySchema) as any,
    mode: "onChange",
    defaultValues: {
      id: empresa.id,
      nome: empresa.nome || "",
      cnpj: empresa.cnpj || "",
      email: empresa.email || "",
      telefone: empresa.telefone || "",
      acesso_total: empresa.acesso_total || false,
      gestores: [],
      trainings_ids: [],
    },
  })

  const { control, watch, setValue, getValues, reset, handleSubmit, formState } = form
  const { errors, isSubmitting } = formState

  const { fields: gestoresFields } = useFieldArray({
    control,
    name: "gestores",
  })

  // Lógica de pular abas automática ao detectar erro no envio
  useEffect(() => {
    if (isSubmitting && Object.keys(errors).length > 0) {
      const firstError = Object.keys(errors)[0];

      if (["nome", "cnpj", "email", "telefone"].includes(firstError)) {
        setActiveTab("dados");
      } else if (firstError.startsWith("gestores")) {
        setActiveTab("responsavel");
      } else if (firstError === "trainings_ids") {
        setActiveTab("treinamentos");
      }
    }
  }, [errors, isSubmitting]);

  const { data: globalTrainings, isLoading: loadingTrainings } = useQuery({
    queryKey: ["trainings-list"],
    queryFn: getTrainingsList,
    enabled: open,
  })

  // Reset do formulário ao abrir o modal com os dados da empresa
  useEffect(() => {
    if (open && empresa) {
      setActiveTab("dados");
      
      reset({
        id: empresa.id,
        nome: empresa.nome || "",
        cnpj: empresa.cnpj || "",
        email: empresa.email || "",
        telefone: empresa.telefone || "",
        acesso_total: empresa.acesso_total || false,
        trainings_ids: empresa.treinamentos?.map((t: any) => Number(t.id)) || [],
        gestores: empresa.gestores?.map((g: any) => ({
          id: g.id,
          nome: g.nome || "",
          email: g.email || "",
          cpf: g.cpf || "",
          telefone: g.telefone || "", // Garante string para evitar erro de validação
        })) || [],
      })
    }
  }, [open, empresa, reset])

  const onSave = async (data: EditCompanyFormData) => {
    try {
      setIsSaving(true)
      await updateFullCompany(data)
      toast.success("Parceria atualizada com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["companies-list"] })
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar parceria.")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleTraining = useCallback((id: number) => {
    const current = getValues("trainings_ids") || []
    const newValue = current.includes(id) ? current.filter((i) => i !== id) : [...current, id]
    setValue("trainings_ids", newValue, { shouldValidate: true, shouldDirty: true })
  }, [getValues, setValue])

  return {
    open,
    setOpen,
    activeTab,
    setActiveTab,
    isSaving,
    form,
    gestoresFields,
    acessoTotal: watch("acesso_total"),
    selectedTrainings: watch("trainings_ids"),
    globalTrainings,
    loadingTrainings,
    toggleTraining,
    onSubmit: handleSubmit(onSave),
  }
}