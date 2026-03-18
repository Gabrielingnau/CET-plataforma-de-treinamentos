"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { moduleSchema, ModuleFormData } from "@/types/forms/module-form"
import { createModule } from "@/services/modules/create-module"
import { updateModule } from "@/services/modules/update-module"
import { deleteModule } from "@/services/modules/delete-module" // Importe o serviço de delete
import { DeleteConfirmModal } from "./modal/delete-confirm-modal" // Importe o seu modal

export function ModuleForm({
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
  } = useForm<ModuleFormData>({
    resolver: yupResolver(moduleSchema),
    defaultValues: defaultValues || {
      titulo: "",
      descricao: "",
      training_id: trainingId,
      ordem: nextOrdem,
    },
  })

  // Mutation para Salvar (Criar ou Editar)
  const saveMutation = useMutation({
    mutationFn: (data: ModuleFormData) => {
      const { ...cleanData } = data as any
      return isEditing
        ? updateModule(defaultValues.id, cleanData)
        : createModule(cleanData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-structure", trainingId],
      })
      toast.success(isEditing ? "Módulo atualizado" : "Módulo criado")
      onCancel()
    },
    onError: () => toast.error("Erro ao salvar módulo")
  })

  // Mutation para Excluir
  const deleteMutation = useMutation({
    mutationFn: () => deleteModule(defaultValues.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-structure", trainingId],
      })
      toast.success("Módulo excluído com sucesso")
      onCancel()
    },
    onError: () => toast.error("Erro ao excluir módulo. Verifique se existem aulas vinculadas.")
  })

  return (
    <form
      onSubmit={handleSubmit((data) => saveMutation.mutate(data))}
      className="space-y-5"
    >
      {/* Cabeçalho com Título e Botão de Excluir */}
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold">
          {isEditing ? "Editar Módulo" : "Novo Módulo"}
        </h3>
        
        {isEditing && (
          <DeleteConfirmModal
            title={defaultValues.titulo}
            onConfirm={() => deleteMutation.mutate()}
          />
        )}
      </div>

      <div className="space-y-2">
        <Label>Título do Módulo</Label>
        <Input {...register("titulo")} placeholder="Ex: Introdução ao curso" />
        {errors.titulo && (
          <p className="text-xs font-medium text-destructive">{errors.titulo.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Descrição</Label>
        <Input {...register("descricao")} placeholder="Breve resumo do conteúdo do módulo" />
        {errors.descricao && (
          <p className="text-xs font-medium text-destructive">{errors.descricao.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || deleteMutation.isPending}
        >
          {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Módulo"}
        </Button>
      </div>
    </form>
  )
}