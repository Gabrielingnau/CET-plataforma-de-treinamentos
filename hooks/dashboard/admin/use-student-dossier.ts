"use client"

import { useEffect, useState, useCallback } from "react"
import { StudentDossier } from "@/types/dashboard/admin/student-dossier"
import { studentService } from "@/services/dashboard/admin/student-service"
import { toast } from "sonner"

export function useStudentDossier(userId: string) {
  const [data, setData] = useState<StudentDossier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Agora guardamos o ID do treinamento (ou módulo) que está sendo alterado
  const [isActionLoading, setIsActionLoading] = useState<number | string | null>(null)

  const loadDossier = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await studentService.getStudentDossier(userId)
      setData(result)
    } catch (error) {
      toast.error("Erro ao carregar dossiê do aluno")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) loadDossier()
  }, [userId, loadDossier])

  // --- ACTIONS DE OVERRIDE SELETIVAS ---

  const handleApproveProgress = async (trainingId: number) => {
    try {
      setIsActionLoading(trainingId) // Trava apenas este ID
      await studentService.overrideApproveProgress(userId, trainingId)
      toast.success("Caminho reconstruído!")
      await loadDossier()
    } catch (error) {
      toast.error("Falha ao reconstruir progresso")
    } finally {
      setIsActionLoading(null)
    }
  }

  const handlePassExam = async (trainingId: number) => {
    try {
      setIsActionLoading(trainingId)
      await studentService.overridePassExam(userId, trainingId)
      toast.success("Aprovação forçada com sucesso!")
      await loadDossier()
    } catch (error) {
      toast.error("Erro ao forçar aprovação")
    } finally {
      setIsActionLoading(null)
    }
  }

  const handleResetExams = async (trainingId: number) => {
    try {
      setIsActionLoading(trainingId)
      await studentService.overrideResetExams(userId, trainingId)
      toast.success("Histórico de provas limpo!")
      await loadDossier()
    } catch (error) {
      toast.error("Erro ao resetar exames")
    } finally {
      setIsActionLoading(null)
    }
  }

  const handleUnlockModule = async (moduleId: number) => {
    try {
      setIsActionLoading(`module-${moduleId}`) // Diferencia ID de módulo de ID de treino
      await studentService.overrideUnlockModule(userId, moduleId)
      toast.success("Módulo destravado!")
      await loadDossier()
    } catch (error) {
      toast.error("Erro ao destravar módulo")
    } finally {
      setIsActionLoading(null)
    }
  }

  return {
    data,
    isLoading,
    isActionLoading, // Agora retorna o ID ou null
    actions: {
      refresh: loadDossier,
      approveProgress: handleApproveProgress,
      passExam: handlePassExam,
      resetExams: handleResetExams,
      unlockModule: handleUnlockModule
    }
  }
}