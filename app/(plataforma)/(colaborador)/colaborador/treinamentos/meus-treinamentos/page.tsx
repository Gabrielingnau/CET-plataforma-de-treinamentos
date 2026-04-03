"use client"

import React, { useContext, useState } from "react"
import { Search, Loader2, Inbox } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"
import { AuthContext } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { ColaboradorTrainingCard } from "./_components/colaborador-training-card"

export default function MeusTreinamentosPage() {
  const { user } = useContext(AuthContext)
  const [search, setSearch] = useState("")

  const { data: userTrainings, isLoading } = useQuery({
    queryKey: ["lista-meus-treinamentos", user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const { data, error } = await supabase
        .from("user_trainings")
        .select("training_id")
        .eq("user_id", user.id)
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })

  return (
    <main className="container mx-auto max-w-7xl sm:p-6 p-2 space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground lg:text-7xl">
          Meus Treinamentos
        </h1>
        <div className="flex items-center gap-2">
          <div className="h-4 w-1.5 rounded-full bg-orange-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            Área Técnica do Colaborador
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar treinamento..."
          className="pl-12 bg-card h-14 rounded-2xl border-border focus-visible:ring-orange-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : userTrainings && userTrainings.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {userTrainings.map((item) => (
            <ColaboradorTrainingCard 
              key={item.training_id} 
              trainingId={item.training_id} 
              userId={user?.id!} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-[40px] border-border">
          <Inbox size={48} className="mb-4 opacity-10" />
          <p className="text-[10px] font-black uppercase tracking-widest">Nenhum treinamento vinculado</p>
        </div>
      )}
    </main>
  )
}