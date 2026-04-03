"use client"

import { useEffect, useState, useCallback } from "react"
import { 
  CompanyDashboardData, 
  UserTrainingDetail, 
  UserCertificate 
} from "@/types/dashboard/company/company"
import { companyService } from "@/services/dashboard/company/company-service"
import { toast } from "sonner"
import { subDays, startOfDay, endOfDay } from "date-fns"

export function useCompanyDashboard(empresaId: number) {
  const [data, setData] = useState<CompanyDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Estado do Filtro de Data (Padrão: Últimos 7 dias)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfDay(subDays(new Date(), 6)),
    to: endOfDay(new Date())
  })

  // 1. Carga principal do Dashboard (KPIs, Gráfico e Tabela)
  const loadDashboard = useCallback(async (silent = false) => {
    if (!empresaId || isNaN(empresaId)) return

    try {
      if (!silent) setIsLoading(true)
      else setIsRefreshing(true)

      // Agora passamos o range de datas para o service
      const result = await companyService.getDashboardData(
        empresaId, 
        dateRange.from, 
        dateRange.to
      )
      setData(result)
    } catch (error) {
      console.error("Erro ao carregar dashboard da empresa:", error)
      toast.error("Não foi possível carregar os dados da unidade.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [empresaId, dateRange]) // Re-gera a função se a data mudar

  // 2. Ação para buscar detalhes de um colaborador (Usado no Drawer)
  const getCollaboratorDetails = async (userId: string): Promise<UserTrainingDetail[]> => {
    try {
      return await companyService.getCollaboratorDetails(userId)
    } catch (error) {
      toast.error("Erro ao buscar detalhes do aluno.")
      return []
    }
  }

  // 3. Ação para buscar certificados de um colaborador (Usado no Modal)
  const getCollaboratorCertificates = async (userId: string): Promise<UserCertificate[]> => {
    try {
      return await companyService.getCollaboratorCertificates(userId)
    } catch (error) {
      toast.error("Erro ao buscar certificados.")
      return []
    }
  }

  // Efeito que dispara a carga inicial e recarrega SEMPRE que o range de datas mudar
  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  return {
    data,
    isLoading,
    isRefreshing,
    // Estado das datas para o DatePicker no componente
    dateRange,
    setDateRange,
    
    // Atalhos para desestruturação direta
    stats: data?.stats || null,
    chartData: data?.chartData || [],
    collaborators: data?.collaborators || [],
    
    actions: {
      refresh: () => loadDashboard(true),
      getDetails: getCollaboratorDetails,
      getCertificates: getCollaboratorCertificates
    }
  }
}