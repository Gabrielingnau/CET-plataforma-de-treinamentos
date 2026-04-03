"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteTraining } from "@/services/trainings/delete-training"
import { FullTrainingStructure } from "@/types/database/trainings"

export function useTrainingHeader(training: FullTrainingStructure) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => deleteTraining(training.id),
    onSuccess: () => {
      toast.success("Treinamento removido com sucesso!")
      // Invalida a lista de treinamentos para refletir a exclusão
      queryClient.invalidateQueries({ queryKey: ["trainings"] })
      router.push("/admin/treinamentos/gerenciar") 
    },
    onError: (error: any) => {
      toast.error("Não foi possível excluir", {
        description: error.message || "Verifique se existem alunos matriculados ou dependências."
      })
    }
  })

  return {
    deleteMutation,
    isDeleting: deleteMutation.isPending,
    handleDelete: () => deleteMutation.mutate()
  }
}