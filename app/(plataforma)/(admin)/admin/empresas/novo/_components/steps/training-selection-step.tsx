"use client"

import { ShieldCheck, Check, Clock, Layers, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrainingSelectionProps {
  trainings: any[] | undefined
  selectedIds: number[]
  acessoTotal: boolean
  onToggleAll: () => void
  onToggleTraining: (id: number) => void
}

export function TrainingSelectionStep({ 
  trainings, selectedIds, acessoTotal, onToggleAll, onToggleTraining 
}: TrainingSelectionProps) {
  return (
    <div className="animate-in space-y-6 duration-500 fade-in slide-in-from-right-4">
      {/* MASTER TOGGLE - Limpo de cores fixas */}
      <div 
        onClick={onToggleAll}
        className={cn(
          "group flex cursor-pointer items-center justify-between p-6 rounded-[2rem] border-2 transition-all select-none",
          acessoTotal 
            ? "border-primary bg-primary/10 shadow-lg shadow-primary/5" 
            : "border-border bg-muted/20 hover:border-primary/30"
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-all", 
            acessoTotal ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <div className="space-y-0.5 text-left">
            <h2 className={cn(
              "text-lg font-black uppercase italic tracking-tight", 
              acessoTotal ? "text-primary" : "text-foreground"
            )}>
              Acesso Total
            </h2>
            <p className="text-[11px] font-medium text-muted-foreground uppercase italic">
              Libera todos os treinamentos automaticamente.
            </p>
          </div>
        </div>
        <div className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all", 
          acessoTotal ? "border-primary bg-primary text-primary-foreground" : "border-border"
        )}>
          {acessoTotal && <Check size={16} strokeWidth={4} />}
        </div>
      </div>

      {!acessoTotal && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 text-left">
          {trainings?.map((t) => {
            const isSelected = selectedIds.includes(t.id)
            return (
              <div 
                key={t.id} 
                onClick={() => onToggleTraining(t.id)}
                className={cn(
                  "group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border-2 p-5 transition-all duration-300 select-none",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                    : "border-border bg-muted/20 hover:border-primary/20"
                )}
              >
                <div className={cn(
                  "absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all", 
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                )}>
                  {isSelected && <Check size={12} strokeWidth={4} />}
                </div>

                <span className={cn(
                  "w-fit rounded-md px-2 py-0.5 text-[8px] font-black tracking-[0.2em] uppercase", 
                  isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground border"
                )}>
                  {t.categoria || "Treinamento"}
                </span>

                <div className="space-y-1 pr-6">
                  <p className={cn(
                    "text-[12px] leading-tight font-black uppercase italic transition-colors", 
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {t.titulo}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={10} />
                      <span className="text-[9px] font-bold uppercase">{t.carga_horaria || "8"}h</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Layers size={10} />
                      <span className="text-[9px] font-bold uppercase">{t.modules?.length || "1"} Módulos</span>
                    </div>
                  </div>
                </div>

                {/* Ícone de fundo - Usando foreground para ser visível nos dois temas */}
                <BookOpen 
                  size={60} 
                  className={cn(
                    "absolute -right-2 -bottom-2 opacity-[0.04] transition-transform group-hover:scale-110", 
                    isSelected ? "text-primary" : "text-foreground"
                  )} 
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}