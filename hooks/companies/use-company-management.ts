import { useMemo, useState } from "react"

import { getCompanyDetails } from "@/services/companies/get-company-details"
import { useQuery } from "@tanstack/react-query"

export function useCompanyManagement(empresaId: string) {
  const [search, setSearch] = useState("")

  const { data: company, isLoading } = useQuery({
    queryKey: ["company-details"],
    queryFn: () => getCompanyDetails(empresaId),
    enabled: !!empresaId,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache "fresco"
  })

  // OTIMIZAÇÃO: Filtro memoizado e normalizado
  const filteredUsers = useMemo(() => {
    // Extraímos a lista aqui para garantir que a dependência seja clara
    const colaboradores = company?.colaboradores; 
    
    if (!colaboradores) return []
    
    const searchTerm = search.toLowerCase().trim()
    if (!searchTerm) return colaboradores

    return colaboradores.filter((user: any) => {
      const nameMatch = user.nome?.toLowerCase().includes(searchTerm)
      const cpfMatch = user.cpf?.replace(/\D/g, "").includes(searchTerm.replace(/\D/g, ""))
      return nameMatch || cpfMatch
    })
    // Adicionamos 'company' como dependência para satisfazer a inferência do compilador
  }, [company, search])

  const stats = {
    totalUsers: filteredUsers.length,
    companyName: company?.nome || "",
    cnpj: company?.cnpj || "N/A",
    gestor: company?.gestor,
    catalogo: company?.catalogo || []
  }

  return {
    company,
    filteredUsers,
    isLoading,
    search,
    setSearch,
    stats
  }
}