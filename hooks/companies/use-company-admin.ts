import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { 
  companyAdminSchema, 
  CompanyAdminFormData 
} from "@/types/forms/company-admin-form"
import { createCompanyAdmin } from "@/services/companies/create-company-admin-action"
import { getAllCompaniesWithStatus } from "@/services/companies/get-available-companies"

export function useCompanyAdmin() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<CompanyAdminFormData>({
    resolver: yupResolver(companyAdminSchema),
    defaultValues: {
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
    },
  })

  const { watch, setValue, handleSubmit } = form
  const selectedEmpresaId = watch("empresa_id")

  // Busca empresas com status (Passamos o searchTerm para o service)
  const { data: allCompanies, isLoading: loadingCompanies } = useQuery({
    queryKey: ["companies-search", searchTerm],
    queryFn: () => getAllCompaniesWithStatus(searchTerm),
    placeholderData: (previousData) => previousData, // Evita flickering ao digitar
  })

  /**
   * Lógica de exibição:
   * 1. Se não pesquisou nada: mostra apenas quem não tem gestor (hasAdmin === false)
   * 2. Se pesquisou: mostra tudo o que o banco trouxe (independente de ter gestor)
   */
  const displayedCompanies = useMemo(() => {
    if (!allCompanies) return [];
    
    if (searchTerm.trim() === "") {
      return allCompanies.filter(c => !c.hasAdmin);
    }
    
    return allCompanies;
  }, [allCompanies, searchTerm]);

  const mutation = useMutation({
    mutationFn: createCompanyAdmin,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Responsável vinculado com sucesso!")
        // Limpa os caches para refletir o novo gestor na lista
        queryClient.invalidateQueries({ queryKey: ["companies-search"] })
        queryClient.invalidateQueries({ queryKey: ["companies-list"] })
        router.push("/admin/empresas/gerenciar")
      } else {
        toast.error(res.error)
      }
    },
    onError: (err: any) => {
      toast.error("Erro inesperado: " + err.message)
    }
  })

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })

  const handleSelectCompany = (id: number) => {
    setValue("empresa_id", id, { shouldValidate: true })
  }

  return {
    form,
    searchTerm,
    setSearchTerm,
    companies: displayedCompanies,
    loadingCompanies,
    mutation,
    selectedEmpresaId,
    onSubmit,
    handleSelectCompany
  }
}