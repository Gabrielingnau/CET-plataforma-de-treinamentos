"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getTrainingsList } from "@/services/trainings/get-training"

export function useTrainingsView() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")

  const { data: trainings, isLoading, isError } = useQuery({
    queryKey: ["trainings-list"],
    queryFn: getTrainingsList,
    staleTime: 1000 * 60 * 5,
  })

  const filtered = useMemo(() => {
    if (!trainings) return []
    return trainings.filter((t) => {
      const matchesName = t.titulo.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        filterStatus === "todos" ? true :
        filterStatus === "curtos" ? t.carga_horaria <= 20 :
        t.carga_horaria > 20
      return matchesName && matchesStatus
    })
  }, [trainings, search, filterStatus])

  const clearFilters = () => {
    setSearch("")
    setFilterStatus("todos")
  }

  return {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    trainings,
    filtered,
    isLoading,
    isError,
    clearFilters
  }
}