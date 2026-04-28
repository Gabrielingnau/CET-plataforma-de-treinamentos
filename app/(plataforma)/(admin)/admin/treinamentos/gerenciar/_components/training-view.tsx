"use client"

import { Search, LayoutGrid, Clock, GraduationCap, Inbox, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrainingCard } from "./training-card"
import { useTrainingsView } from "@/hooks/trainings/use-trainings-view"
import { cn } from "@/lib/utils"

export function TrainingsView() {
  const {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filtered,
    isLoading,
    isError,
    clearFilters
  } = useTrainingsView()

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive p-6 text-center">
        <RotateCcw size={32} className="animate-in spin-in-180 duration-500" />
        <div className="space-y-1">
          <p className="font-semibold">Erro ao carregar os treinamentos.</p>
          <p className="text-sm opacity-80">Não foi possível conectar ao banco de dados.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()} className="border-destructive/20">
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* BARRA DE FILTROS - RESPONSIVA */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm">
        
        {/* BUSCA */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar treinamentos..."
            className="pl-10 bg-background focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTROS (TABS NO MOBILE) */}
        <div className="flex items-center gap-1 rounded-md border bg-muted/50 p-1 w-full lg:w-auto overflow-hidden">
          <FilterButton 
            active={filterStatus === "todos"} 
            onClick={() => setFilterStatus("todos")} 
            icon={<LayoutGrid size={14} />} 
            label="Todos" 
          />
          <FilterButton 
            active={filterStatus === "curtos"} 
            onClick={() => setFilterStatus("curtos")} 
            icon={<Clock size={14} />} 
            label="Até 20h" 
          />
          <FilterButton 
            active={filterStatus === "longos"} 
            onClick={() => setFilterStatus("longos")} 
            icon={<GraduationCap size={14} />} 
            label="Especializações" 
          />
        </div>
      </div>

      {/* CONTEÚDO COM ANIMATION */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 w-full rounded-lg bg-muted animate-pulse border" />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((training) => (
                <motion.div
                  key={training.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <TrainingCard training={training} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex h-80 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed bg-muted/5 text-muted-foreground">
               <div className="rounded-full bg-muted p-4">
                 <Inbox size={32} className="opacity-20" />
               </div>
               <div className="text-center space-y-1">
                 <p className="font-semibold text-foreground">Nenhum treinamento encontrado</p>
                 <p className="text-sm">Tente mudar os filtros ou a busca.</p>
               </div>
               {(search || filterStatus !== "todos") && (
                 <Button variant="link" onClick={clearFilters} className="text-primary font-semibold">
                   Limpar Filtros
                 </Button>
               )}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

/* --- Componente Interno de Botão de Filtro --- */

function FilterButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean, 
  onClick: () => void, 
  icon: React.ReactNode, 
  label: string 
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex-1 lg:flex-none h-8 gap-2 rounded-sm px-4 text-xs font-medium transition-all",
        active 
          ? "bg-background text-foreground shadow-sm" 
          : "text-muted-foreground hover:text-foreground hover:bg-transparent"
      )}
      onClick={onClick}
    >
      {icon} 
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )
}