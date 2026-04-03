"use client"

import { useEffect, useState, useCallback } from "react"
import { CompanyDashboardData } from "@/types/dashboard/admin/company-details"
import { companyDetailsService } from "@/services/dashboard/admin/company-service"
import { toast } from "sonner"

export function useCompanyDetails(companyId: string) {
  const [data, setData] = useState<CompanyDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true)
      else setIsRefreshing(true)
      
      const result = await companyDetailsService.getCompanyOverview(companyId)
      setData(result)
    } catch (error) {
      toast.error("Erro ao carregar detalhes da unidade")
      console.error(error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [companyId])

  useEffect(() => {
    if (companyId) loadData()
  }, [companyId, loadData])

  return {
    data,
    isLoading,
    isRefreshing,
    refresh: () => loadData(true)
  }
}