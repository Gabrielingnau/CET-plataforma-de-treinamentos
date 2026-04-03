"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getCompaniesList } from "@/services/companies/get-companies"

export function useCompanyTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const { data: companies = [], isLoading, refetch } = useQuery({
    queryKey: ["companies-list"],
    queryFn: getCompaniesList,
    // Opcional: manter os dados anteriores enquanto carrega os novos para evitar flickers
    placeholderData: (previousData) => previousData,
  })

  // Filtro inteligente: Busca por Nome da Empresa, CNPJ ou Nome de qualquer Gestor
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return companies

    return companies.filter((c: any) => {
      const matchEmpresa = 
        (c.nome && c.nome.toLowerCase().includes(term)) || 
        (c.cnpj && c.cnpj.includes(term))
      
      // Verifica se o termo de busca bate com o nome de ALGUM gestor
      // Isso garante que se você buscar por "João", e o João for um dos 3 gestores, a empresa aparece.
      const matchGestor = c.gestores?.some((gestor: any) => 
        gestor.nome?.toLowerCase().includes(term) ||
        gestor.email?.toLowerCase().includes(term)
      )

      return matchEmpresa || matchGestor
    })
  }, [companies, searchTerm])

  // Cálculo de paginação
  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  
  // Sincroniza a página atual caso o filtro diminua a lista drasticamente
  const safeCurrentPage = currentPage > totalPages ? totalPages : currentPage

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, safeCurrentPage])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) 
  }

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages))
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1))

  return {
    searchTerm,
    setSearchTerm: handleSearch,
    currentPage: safeCurrentPage,
    totalPages,
    paginatedData,
    isLoading,
    refetch,
    nextPage,
    prevPage,
    totalItems
  }
}