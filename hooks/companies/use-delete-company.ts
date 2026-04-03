"use client"

import { useState, useMemo } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { deleteFullCompanyStructure } from "@/services/companies/delete-company"
import { toast } from "sonner"

export function useDeleteCompany(empresaId: string, empresaNome: string) {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteFullCompanyStructure(empresaId),
    onSuccess: () => {
      toast.success("Empresa e gestores removidos com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["companies-list"] })
      setOpen(false)
      setConfirmText("")
    },
    onError: (error: any) => {
      toast.error("Erro ao excluir: " + error.message)
    }
  })

  const canDelete = useMemo(() => {
    return confirmText.trim() === empresaNome.trim()
  }, [confirmText, empresaNome])

  const handleCopy = () => {
    navigator.clipboard.writeText(empresaNome)
    toast.info("Nome copiado!")
  }

  return {
    open,
    setOpen,
    confirmText,
    setConfirmText,
    mutation,
    canDelete,
    handleCopy
  }
}