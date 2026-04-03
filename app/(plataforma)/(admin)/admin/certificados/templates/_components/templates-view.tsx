"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, CheckCircle2, XCircle, LayoutGrid, Loader2, AlertCircle, RotateCcw } from "lucide-react"
import { TemplateGrid } from "./template-grid"
import { useTemplates } from "@/hooks/certificates/use-templates"
import { cn } from "@/lib/utils"

export function TemplatesView() {
  const { 
    search, 
    setSearch, 
    filterStatus, 
    setFilterStatus, 
    filtered, 
    isLoading,
    isError,
    toggleStatus,
    remove,
    isProcessing
  } = useTemplates()

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Carregando seus templates...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive p-6 text-center">
        <AlertCircle size={32} />
        <div className="space-y-1">
          <p className="font-semibold">Erro ao carregar os templates.</p>
          <p className="text-sm opacity-80">Verifique sua conexão e tente novamente.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()} className="border-destructive/20 hover:bg-destructive/10">
          <RotateCcw className="mr-2 h-4 w-4" /> Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Barra de Filtros - Totalmente Responsiva */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-card p-4 rounded-lg border shadow-sm">
        
        {/* Busca */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            className="pl-9 bg-background focus-visible:ring-primary"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtros de Status */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md border w-full lg:w-auto">
          <FilterButton 
            active={filterStatus === "todos"} 
            onClick={() => setFilterStatus("todos")}
            icon={<LayoutGrid size={14} />}
            label="Todos"
          />
          <FilterButton 
            active={filterStatus === "ativos"} 
            onClick={() => setFilterStatus("ativos")}
            icon={<CheckCircle2 size={14} />}
            label="Ativos"
            activeClass="bg-background text-green-600 shadow-sm"
          />
          <FilterButton 
            active={filterStatus === "inativos"} 
            onClick={() => setFilterStatus("inativos")}
            icon={<XCircle size={14} />}
            label="Inativos"
            activeClass="bg-background text-destructive shadow-sm"
          />
        </div>
      </div>

      {/* Grid de Conteúdo */}
      {filtered.length > 0 ? (
        <TemplateGrid 
          initialTemplates={filtered} 
          onToggleStatus={toggleStatus}
          onRemove={remove}
          isProcessing={isProcessing}
        />
      ) : (
        <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed rounded-lg border-muted-foreground/20 text-muted-foreground gap-4 bg-muted/5">
          <div className="rounded-full bg-muted/20 p-4">
            <Filter size={32} className="opacity-30" />
          </div>
          <div className="text-center px-6">
            <p className="font-semibold text-foreground text-lg">Nenhum resultado encontrado</p>
            <p className="text-sm max-w-75 mx-auto">
              Ajuste seus filtros ou o termo de busca para encontrar o que precisa.
            </p>
          </div>
          {(search || filterStatus !== "todos") && (
            <Button 
              variant="link" 
              onClick={() => { setSearch(""); setFilterStatus("todos"); }}
              className="text-primary font-semibold"
            >
              Limpar todos os filtros
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/* --- Subcomponente de Botão de Filtro --- */

interface FilterButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  activeClass?: string
}

function FilterButton({ active, onClick, icon, label, activeClass = "bg-background shadow-sm" }: FilterButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex-1 lg:flex-none gap-2 h-8 rounded-sm px-4 text-xs font-medium transition-all",
        active 
          ? activeClass 
          : "text-muted-foreground hover:text-foreground hover:bg-transparent"
      )}
      onClick={onClick}
    >
      {icon} 
      <span className="hidden sm:inline">{label}</span>
      {/* Exibe o label no mobile apenas se estiver ativo para economizar espaço se necessário, 
          ou mantém sempre se couber bem como aqui. */}
    </Button>
  )
}