"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/auth/use-auth"
import { getStructureData } from "@/services/trainings/get-training-structure"
import { FullTrainingStructure } from "@/types/database/trainings"

export function useCourseBuilder() {
  const { user } = useAuth()
  const params = useParams()
  
  // 1. Gerenciamento do ID
  const trainingId = Number(params.id)

  // 2. Estado do Editor e UI
  const [editor, setEditor] = useState<any>({ type: "idle" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // 3. Busca de Dados
  const { data: playerData, isLoading } = useQuery({
    queryKey: ["training-structure", trainingId],
    queryFn: () => getStructureData(user?.id as string, trainingId),
    enabled: !!user?.id && !isNaN(trainingId),
  })

  const training = playerData?.training as FullTrainingStructure | undefined
  const structure = training?.modulos || []

  // 4. Handlers
  const handleSetEditor = (config: any) => {
    setEditor(config)
    setIsSidebarOpen(false)
  }

  return {
    trainingId,
    training,
    structure,
    isLoading: isLoading || isNaN(trainingId),
    editor,
    setEditor,
    handleSetEditor,
    isSidebarOpen,
    setIsSidebarOpen
  }
}