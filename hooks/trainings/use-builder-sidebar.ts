"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"
import { seedCurrentTraining } from "@/services/trainings/seed-trainings"
import { FullTrainingStructure } from "@/types/database/trainings" // Ajuste o caminho conforme seu projeto

interface UseBuilderSidebarProps {
  structure: FullTrainingStructure["modulos"] // Pega a tipagem dos módulos da estrutura completa
  trainingId: number
}

export function useBuilderSidebar({ structure, trainingId }: UseBuilderSidebarProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSeeding, setIsSeeding] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)

  const handleFinalize = async () => {
    setIsFinalizing(true)
    try {
      // Ajustado para 'aulas' conforme a interface FullTrainingStructure
      const hasLessons = structure.some((m) => m.aulas && m.aulas.length > 0)
      
      if (structure.length === 0 || !hasLessons) {
        toast.error("Estrutura Incompleta", {
          description: "Adicione ao menos um módulo e uma aula para continuar."
        })
        return
      }

      toast.success("Treinamento publicado!")
      router.push("/admin/treinamentos/gerenciar")
    } catch (err) {
      toast.error("Erro ao publicar treinamento")
    } finally {
      setIsFinalizing(false)
    }
  }

  const handleMagicSeed = async () => {
    setIsSeeding(true)
    try {
      await seedCurrentTraining(trainingId)
      
      // Invalida a query para forçar o refetch e atualizar a sidebar com os novos dados
      await queryClient.invalidateQueries({
        queryKey: ["training-structure", trainingId],
      })
      
      toast.success("Dados de teste gerados!")
    } catch (err) {
      toast.error("Erro ao gerar dados.")
    } finally {
      setIsSeeding(false)
    }
  }

  const handleExit = () => {
    router.push("/admin/treinamentos/gerenciar")
  }

  return {
    isSeeding,
    isFinalizing,
    handleFinalize,
    handleMagicSeed,
    handleExit
  }
}