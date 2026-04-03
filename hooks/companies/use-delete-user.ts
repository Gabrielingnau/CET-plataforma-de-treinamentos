import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCollaborator } from "@/services/collaborators/delete-collaborator"
import { toast } from "sonner"
import { useMemo } from "react"

interface UseDeleteUserProps {
  userId: string
  empresaId: number
  role?: string
}

export function useDeleteUser({ userId, empresaId, role }: UseDeleteUserProps) {
  const queryClient = useQueryClient()

  // Memoizamos a verificação de papel para evitar re-processamento de string
  const isGestor = useMemo(() => 
    role?.toLowerCase().trim() === "empresa", 
  [role])

  const mutation = useMutation({
    mutationFn: () => deleteCollaborator(userId),
    onSuccess: () => {
      // Feedback dinâmico baseado no cargo
      const message = isGestor ? "Gestor removido com sucesso!" : "Colaborador removido com sucesso!"
      toast.success(message)
      
      // Invalida a lista da empresa para refletir a exclusão na UI
      queryClient.invalidateQueries({
        queryKey: ["company-details", empresaId],
      })
    },
    onError: () => toast.error("Erro ao tentar remover o usuário da plataforma"),
  })

  return {
    isGestor,
    isLoading: mutation.isPending,
    confirmDelete: mutation.mutate,
  }
}