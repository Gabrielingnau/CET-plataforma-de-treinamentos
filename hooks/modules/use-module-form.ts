"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { moduleSchema, ModuleFormData } from "@/types/forms/module-form"
import { createModule } from "@/services/modules/create-module"
import { updateModule } from "@/services/modules/update-module"
import { deleteModule } from "@/services/modules/delete-module"

interface UseModuleFormProps {
  trainingId: string
  defaultValues?: any
  onCancel: () => void
  nextOrdem?: number
}

export function useModuleForm({ trainingId, defaultValues, onCancel, nextOrdem }: UseModuleFormProps) {
  const isEditing = !!defaultValues
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: yupResolver(moduleSchema),
    defaultValues: defaultValues || {
      titulo: "",
      descricao: "",
      training_id: trainingId,
      ordem: nextOrdem,
    },
  })

  // Mutação para Salvar (Create/Update)
  const saveMutation = useMutation({
    mutationFn: async (data: ModuleFormData) => {
      const payload = {
        ...data,
        ordem: Number(data.ordem),
      }
      return isEditing
        ? updateModule(defaultValues.id, payload)
        : createModule(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-structure", trainingId] })
      toast.success(isEditing ? "Módulo atualizado!" : "Módulo criado!")
      onCancel()
    },
    onError: (error: any) => toast.error(error.message || "Erro ao salvar módulo"),
  })

  // Mutação para Deletar
  const deleteMutation = useMutation({
    mutationFn: () => deleteModule(defaultValues.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-structure", trainingId] })
      toast.success("Módulo removido!")
      onCancel()
    },
    onError: () => toast.error("Remova as aulas deste módulo antes de excluí-lo."),
  })

  return {
    register,
    errors,
    control,
    isPending: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isEditing,
    handleDelete: () => deleteMutation.mutate(),
    onSubmit: handleSubmit((data) => saveMutation.mutate(data)),
  }
}