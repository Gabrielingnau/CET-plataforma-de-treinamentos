"use client"

import { LayoutGrid, Loader2, BookOpen, AlertCircle } from "lucide-react"
import { useCompanyCatalogue } from "@/hooks/trainings/companie/use-company-catalogue"
import { CatalogueCard } from "./_components/catalogue-card"
import { useAuth } from "@/hooks/auth/use-auth"

export default function CataloguePage() {
  const { user } = useAuth()

  // Converte explicitamente para number para evitar o erro de 'string' vs 'number'
  // No seu SQL o ID é bigint, então tratamos como number no Front
  const empresaId = user?.empresa_id ? Number(user.empresa_id) : null

  const { trainings, empresa, isLoading } = useCompanyCatalogue(empresaId)

  // 1. Estado de Carregamento
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase italic tracking-[0.2em] text-muted-foreground">
          Sincronizando Catálogo...
        </p>
      </div>
    )
  }

  // 2. Estado Sem Empresa Vinculada
  if (!empresaId) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-destructive/10 p-4 text-destructive">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-black uppercase italic tracking-tighter">Acesso Restrito</h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Seu usuário não possui uma unidade vinculada.
        </p>
      </div>
    )
  }

  return (
    <div className="sm:p-6 p-2 space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="flex items-center gap-4 text-3xl font-black uppercase italic tracking-tighter text-foreground md:text-5xl">
            <div className="rounded-[20px] bg-primary/10 p-3 text-primary shadow-2xl shadow-primary/10">
              <LayoutGrid size={36} strokeWidth={2.5} />
            </div>
            Catálogo <span className="text-primary">Disponível</span>
          </h1>
          
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-muted px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border/50">
              Unidade: {empresa?.nome || "Carregando..."}
            </span>
            {empresa?.acesso_total && (
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 shadow-sm">
                Acesso Master Liberado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* GRID DE TREINAMENTOS */}
      {trainings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-border bg-muted/5 py-32 text-center">
          <div className="mb-6 rounded-full bg-muted p-6 text-muted-foreground/20">
            <BookOpen size={60} />
          </div>
          <h3 className="text-sm font-black uppercase italic tracking-[0.2em] text-muted-foreground">
            Nenhum treinamento disponível <br /> 
            <span className="text-[10px] font-bold opacity-50">para esta unidade no momento.</span>
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trainings.map((training: any) => (
            <CatalogueCard 
              key={training.id} 
              training={training} 
              empresaId={empresaId} // Agora passa como number corretamente
            />
          ))}
        </div>
      )}
    </div>
  )
}