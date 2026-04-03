"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

// Importando os services que você já tem
import { deleteTemplate } from "@/services/certificates/templates/delete-template"
import { toggleTemplateStatus } from "@/services/certificates/templates/update-template"
import { CertificateTemplate } from "@/types/database/template"

export function useTemplates() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const queryClient = useQueryClient()

  // 1. Busca de Dados
  const {
    data: templates = [] as CertificateTemplate[],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["templates-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificate_templates")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as CertificateTemplate[]
    },
  })

  // 2. Mutação para Alternar Status (Ativar/Desativar)
  const toggleMutation = useMutation({
    mutationFn: ({ id, currentStatus }: { id: number; currentStatus: boolean }) => 
      toggleTemplateStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates-list"] })
      toast.success("Status atualizado!")
    },
    onError: () => toast.error("Erro ao alterar status."),
  })

  // 3. Mutação para Excluir
  const deleteMutation = useMutation({
    mutationFn: ({ id, pdfUrl, capaUrl }: { id: number; pdfUrl: string; capaUrl: string | null }) => 
      deleteTemplate(id, pdfUrl, capaUrl),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["templates-list"] })
      toast.info(data.message)
    },
    onError: (error: any) => toast.error("Erro na operação: " + error.message),
  })

  // 4. Lógica de Filtro
  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesName = t.titulo.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        filterStatus === "todos"
          ? true
          : filterStatus === "ativos"
            ? t.ativo
            : !t.ativo
      return matchesName && matchesStatus
    })
  }, [templates, search, filterStatus])

  return {
    // Estados e Filtros
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filtered,
    isLoading,
    isError,
    
    // Ações (que a View e Grid esperam)
    toggleStatus: toggleMutation.mutate,
    remove: deleteMutation.mutate,
    
    // Estado de processamento global para as mutações
    isProcessing: toggleMutation.isPending || deleteMutation.isPending,
  }
}