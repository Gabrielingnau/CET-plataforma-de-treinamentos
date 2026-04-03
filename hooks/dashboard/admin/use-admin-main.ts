"use client"

import { useEffect, useState, useCallback } from "react"
import { AdminDashboardData } from "@/types/dashboard/admin/admin-dashboard"
import { adminMainService } from "@/services/dashboard/admin/admin-service"
import { toast } from "sonner"

export function useAdminMain() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadDashboard = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true)
      else setIsRefreshing(true)
      
      const result = await adminMainService.getGlobalOverview()
      setData(result)
    } catch (error) {
      toast.error("Erro ao carregar visão geral do sistema")
      console.error(error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  return {
    data,
    isLoading,
    isRefreshing,
    refresh: () => loadDashboard(true)
  }
}