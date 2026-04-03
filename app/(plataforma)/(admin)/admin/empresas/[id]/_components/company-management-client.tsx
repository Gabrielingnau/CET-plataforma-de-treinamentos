"use client"

import * as React from "react"
import { Search, ArrowLeft, Loader2, Building2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { CollaboratorCreate } from "./collaborator-create" // Nomenclatura atualizada
import { UserCard } from "./user-card"     // Nomenclatura atualizada
import { useCompanyManagement } from "@/hooks/companies/use-company-management"

export function CompanyManagementClient() {
  const params = useParams()
  const router = useRouter()
  const empresaId = Number(params.id)
  
  const { 
    company, 
    filteredUsers, 
    isLoading, 
    search, 
    setSearch, 
    stats 
  } = useCompanyManagement(JSON.stringify(empresaId))

  if (isLoading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 font-black tracking-widest text-primary uppercase">
      <Loader2 className="animate-spin text-orange-600" size={32} /> 
      <span className="animate-pulse">Sincronizando Unidade...</span>
    </div>
  )

  if (!company) return (
    <div className="py-20 text-center font-black tracking-widest text-muted-foreground uppercase italic">
      Unidade não encontrada no ecossistema.
    </div>
  )

  return (
    <div className="container mx-auto max-w-7xl space-y-8 md:space-y-12 pb-20">
      
      {/* HEADER */}
      <header className="flex flex-col w-full gap-6 border-b border-border pb-8 md:pb-12 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4 md:gap-6 w-full">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="shrink-0 h-12 w-12 rounded-xl border-border bg-background/50 hover:bg-accent transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </Button>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse" />
               <p className="text-[9px] md:text-[10px] font-black tracking-[0.3em] text-orange-600 uppercase italic">
                 Gestão de Unidade • KYDORA
               </p>
            </div>
            <h1 className="block w-full truncate text-3xl md:text-5xl leading-none font-black tracking-tighter text-foreground uppercase italic">
              {stats.companyName}
            </h1>
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-mono text-muted-foreground uppercase">
              <Building2 size={12} />
              CNPJ: {stats.cnpj}
            </div>
          </div>
        </div>

        {/* GESTOR CARD */}
        {stats.gestor && (
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-4 transition-all hover:border-orange-600/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 font-black text-white italic shadow-lg shadow-orange-600/20">
              {stats.gestor.nome[0]}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase leading-none mb-1">
                Gestor Responsável
              </p>
              <p className="truncate text-xs font-bold text-foreground">
                {stats.gestor.nome}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* CREATE SECTION */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CollaboratorCreate empresaId={JSON.stringify(empresaId)} />
      </section>

      {/* FILTERS & LIST */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-4 w-1 bg-orange-600 rounded-full" />
            <h2 className="text-sm font-black tracking-widest text-muted-foreground uppercase italic">
              Equipe Cadastrada ({stats.totalUsers})
            </h2>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-600 transition-colors" size={14} />
            <Input
              placeholder="Buscar por nome ou CPF..."
              className="h-12 rounded-2xl border-border bg-background pl-11 text-[11px] font-bold focus-visible:ring-orange-600/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* LISTAGEM GRID */}
        {filteredUsers.length === 0 ? (
          <div className="rounded-[2.5rem] md:rounded-[4rem] border-2 border-dashed border-muted bg-muted/5 py-16 md:py-24 text-center px-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
               <Search size={20} />
            </div>
            <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">
              Nenhum registro encontrado nesta unidade
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-700">
            {filteredUsers.map((user: any) => (
              <UserCard
                key={user.id}
                userData={user}
                catalogo={stats.catalogo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}