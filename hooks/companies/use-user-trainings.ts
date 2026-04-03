import { useState, useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleTrainingService } from "@/services/collaborators/toggle-training"
import { toast } from "sonner"

interface UseUserTrainingsProps {
  userData: any
  empresaId: number
}

export function useUserTrainings({ userData, empresaId }: UseUserTrainingsProps) {
  const queryClient = useQueryClient()
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const isGestor = useMemo(() => 
    userData.role?.toLowerCase().trim() === 'empresa', 
  [userData.role])

  const mutation = useMutation({
    mutationFn: (trainingId: number) => {
      const hasCourse = userData.user_trainings?.some((ut: any) => ut.training_id === trainingId)
      return toggleTrainingService({
        colabId: userData.id,
        trainingId,
        active: !!hasCourse,
        empresaId
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-details", String(empresaId)] })
    },
    onError: () => {
      toast.error("Erro ao atualizar catálogo do usuário.")
    },
    onSettled: () => setUpdatingId(null)
  })

  const handleToggle = (trainingId: number) => {
    setUpdatingId(trainingId)
    mutation.mutate(trainingId)
  }

  return {
    isGestor,
    updatingId,
    handleToggle,
    isLoading: mutation.isPending
  }
}