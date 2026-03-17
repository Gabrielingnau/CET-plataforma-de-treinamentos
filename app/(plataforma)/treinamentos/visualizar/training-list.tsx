"use client"

import { Search } from "lucide-react"
import { useState } from "react"

import { Training } from "@/types/database/trainings"
import { Input } from "@/components/ui/input"

import { TrainingCard } from "./_components/training-card"

interface Props {
  trainings: Training[]
}

export function TrainingList({ trainings }: Props) {
  const [search, setSearch] = useState("")

  const filtered = trainings.filter((training) =>
    training.titulo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar treinamento..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium">Nenhum treinamento encontrado</p>
          <p className="text-muted-foreground">
            Tente procurar por outro termo
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((training) => (
          <TrainingCard key={training.id} training={training} />
        ))}
      </div>
    </div>
  )
}
