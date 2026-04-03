"use client"

import { useQuery } from "@tanstack/react-query"
import { getCompanyCatalogue, getTrainingUsers } from "@/services/companies/catalogue-service"

/**
 * Hook principal para buscar o catálogo de treinamentos de uma empresa.
 * Retorna os dados da empresa e a lista de treinamentos com contagem de aulas/módulos.
 */
export function useCompanyCatalogue(empresaId: number | null) {
  const catalogueQuery = useQuery({
    // Incluímos o empresaId na queryKey para invalidar o cache se a empresa mudar
    queryKey: ["company-catalogue", empresaId],
    queryFn: () => getCompanyCatalogue(empresaId),
    // Só executa se o ID for válido
    enabled: !!empresaId,
    // Mantém os dados anteriores enquanto carrega os novos (evita flickering)
    placeholderData: (previousData) => previousData,
  })

  return {
    empresa: catalogueQuery.data?.empresa,
    trainings: catalogueQuery.data?.trainings || [],
    isLoading: catalogueQuery.isLoading,
    isError: catalogueQuery.isError,
    refetch: catalogueQuery.refetch,
  }
}

/**
 * Hook para buscar os colaboradores vinculados a um treinamento específico.
 * Geralmente acionado ao abrir o modal do CatalogueCard.
 */
export function useTrainingUsers(
  trainingId: number, 
  empresaId: number | null, 
  enabled: boolean
) {
  return useQuery({
    queryKey: ["training-users", trainingId, empresaId],
    queryFn: () => getTrainingUsers(trainingId, empresaId),
    // Só dispara a requisição se o modal estiver aberto E tivermos os IDs necessários
    enabled: enabled && !!trainingId && !!empresaId,
    // Opcional: define um tempo de cache menor para dados de progresso em tempo real
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}