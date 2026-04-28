"use client"

import React, { useMemo } from "react"
import { GraduationCap, BookPlus, Check, Loader2, Sparkles, X } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUserTrainings } from "@/hooks/companies/use-user-trainings"

interface UserTrainingsModalProps {
  userData: any
  empresaId: number
  catalogo: any[]
}

export function UserTrainingsModal({ userData, empresaId, catalogo }: UserTrainingsModalProps) {
  const { isGestor, updatingId, handleToggle } = useUserTrainings({ userData, empresaId })

  // OTIMIZAÇÃO: Tema memoizado
  const theme = useMemo(() => ({
    trigger: isGestor 
      ? "text-sky-500 border-sky-500/20 bg-sky-500/5 hover:bg-sky-500 hover:text-white shadow-sky-500/5" 
      : "text-primary border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground shadow-primary/5",
    accent: isGestor ? "text-sky-500" : "text-primary",
    badge: isGestor ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
    borderTop: isGestor ? "border-t-sky-600" : "border-t-primary"
  }), [isGestor])

  const firstName = useMemo(() => userData.nome?.split(' ')[0] || "Usuário", [userData.nome])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className={cn(
            "w-full mb-6 border-2 rounded-2xl h-12 font-black uppercase text-[10px] tracking-[0.2em] italic transition-all duration-300 gap-2 active:scale-95 shadow-sm",
            theme.trigger
          )}
        >
          <BookPlus size={14} /> Gerenciar Catálogo
        </Button>
      </DialogTrigger>
      
      <DialogContent className={cn(
        "max-w-[95vw] md:max-w-5xl p-0 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-t-4 bg-background animate-in zoom-in-95",
        theme.borderTop
      )}>
        
        <div className="flex flex-col max-h-[90vh]">
          {/* HEADER SECTION */}
          <div className="p-6 md:p-10 border-b bg-muted/20 relative">
            <div className="absolute right-6 top-6 hidden md:block">
              <DialogClose className="rounded-full bg-background border p-2 text-muted-foreground hover:bg-muted transition-colors">
                <X size={18} />
              </DialogClose>
            </div>

            <DialogHeader className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 text-center md:text-left">
              <div className={cn(
                "h-16 w-16 md:h-24 md:w-24 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shrink-0 transition-transform hover:scale-105 duration-500",
                theme.badge
              )}>
                <GraduationCap size={36} className="md:w-12 md:h-12" strokeWidth={2.5} />
              </div>
              
              <div className="space-y-1 md:pt-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] italic", theme.accent)}>
                    Plataforma KYDORA • {isGestor ? 'Gestão de Empresa' : 'Treinamento Individual'}
                  </span>
                  <Sparkles size={12} className="text-orange-500 animate-pulse" />
                </div>
                <DialogTitle className="text-3xl md:text-5xl font-black uppercase italic text-foreground tracking-tighter leading-none">
                  Catálogo: <span className={theme.accent}>{firstName}</span>
                </DialogTitle>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest pt-2">
                  Libere ou remova acessos instantaneamente.
                </p>
              </div>
            </DialogHeader>
          </div>

          {/* CATALOG GRID */}
          <div className="p-4 md:p-10 overflow-y-auto custom-scrollbar bg-muted/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogo?.map((curso: any) => {
                const isEnabled = userData.user_trainings?.some((ut: any) => ut.training_id === curso.id)
                const isCurrentUpdating = updatingId === curso.id;

                return (
                  <button
                    key={curso.id}
                    disabled={isCurrentUpdating}
                    onClick={() => handleToggle(curso.id)}
                    className={cn(
                      "group relative flex flex-col items-start p-6 rounded-[2rem] border-2 transition-all duration-300 text-left outline-none active:scale-[0.98]",
                      isEnabled 
                        ? (isGestor ? "bg-sky-500/[0.03] border-sky-500/30 shadow-md shadow-sky-500/5" : "bg-primary/[0.03] border-primary/30 shadow-md shadow-primary/5")
                        : "bg-background border-border text-muted-foreground hover:border-muted-foreground/30 shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "mb-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-colors",
                      isEnabled 
                        ? (isGestor ? "bg-sky-500 text-white border-sky-600" : "bg-primary text-primary-foreground border-primary") 
                        : "bg-muted/50 border-border text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                    )}>
                      {isEnabled ? '✓ Habilitado' : '○ Bloqueado'}
                    </div>

                    <h5 className="text-[11px] md:text-xs font-black uppercase italic tracking-tight mb-6 leading-snug line-clamp-2 text-foreground">
                      {curso.titulo}
                    </h5>

                    <div className="mt-auto w-full flex items-center justify-between pt-2">
                      <span className="text-[8px] font-mono font-bold opacity-30 uppercase tracking-tighter">ID: {curso.id}</span>
                      <div className={cn(
                        "h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500", 
                        isEnabled 
                          ? (isGestor ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "bg-primary text-primary-foreground shadow-lg shadow-primary/20") 
                          : "bg-muted text-muted-foreground group-hover:scale-110"
                      )}>
                        {isCurrentUpdating ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : isEnabled ? (
                          <Check size={22} strokeWidth={3} />
                        ) : (
                          <BookPlus size={18} />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t bg-muted/20 flex justify-center md:justify-between items-center">
             <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest">Servidor Online</span>
             </div>
             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">
               Sincronização em tempo real via KYDORA Cloud
             </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}