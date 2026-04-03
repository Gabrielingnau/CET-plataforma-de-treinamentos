import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getCompanyDetails } from "@/services/companies/get-company-details"

export function useCompanyManagement(empresaId: string) {
  const [search, setSearch] = useState("")

  const { data: company, isLoading } = useQuery({
    queryKey: ["company-details", empresaId],
    queryFn: () => getCompanyDetails(empresaId),
    enabled: !!empresaId,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache "fresco"
  })

  // OTIMIZAÇÃO: Filtro memoizado e normalizado
  const filteredUsers = useMemo(() => {
    if (!company?.colaboradores) return []
    
    const searchTerm = search.toLowerCase().trim()
    if (!searchTerm) return company.colaboradores

    return company.colaboradores.filter((user: any) => {
      const nameMatch = user.nome?.toLowerCase().includes(searchTerm)
      const cpfMatch = user.cpf?.replace(/\D/g, "").includes(searchTerm.replace(/\D/g, ""))
      return nameMatch || cpfMatch
    })
  }, [company?.colaboradores, search])

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