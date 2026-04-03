import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createCollaboratorAction } from "@/services/collaborators/create-collaborator"
import { collaboratorSchema } from "@/types/forms/collaborator-form"

export function useCreateCollaborator(empresaId: string) {
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)

  const form = useForm({
    resolver: yupResolver(collaboratorSchema as any),
    defaultValues: { 
      nome: "", 
      cpf: "", 
      empresa_id: Number(empresaId) 
    }
  })

  const mutation = useMutation({
    mutationFn: (data: any) => createCollaboratorAction({ 
      ...data, 
      empresaId: parseInt(empresaId) 
    }),
    onSuccess: () => {
      toast.success("Acesso gerado com sucesso!")
      setIsAdding(false)
      form.reset()
      // Invalida a query da empresa para atualizar a listagem de colaboradores
      queryClient.invalidateQueries({ queryKey: ["company-details", empresaId] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar acesso")
    }
  })

  const toggleAdding = () => {
    if (isAdding) form.reset()
    setIsAdding(!isAdding)
  }

  return {
    form,
    isAdding,
    toggleAdding,
    isLoading: mutation.isPending,
    create: mutation.mutate
  }
}