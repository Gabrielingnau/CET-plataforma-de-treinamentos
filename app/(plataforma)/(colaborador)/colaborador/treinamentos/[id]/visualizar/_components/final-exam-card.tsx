"use client"

import { Trophy, Lock, ArrowRight, CheckCircle2, FileBadge, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface FinalExamCardProps {
  trainingId: number
  unlocked: boolean
  passed: boolean
  isAdmin?: boolean // Prop adicionada
}

export function FinalExamCard({ trainingId, unlocked, passed, isAdmin }: FinalExamCardProps) {
  const router = useRouter()

  // Se for admin e não tiver passado ainda, mostramos como "unlocked" por padrão
  const effectiveUnlocked = isAdmin || unlocked

  return (
    <div className={cn(
      "relative p-10 rounded-[48px] border-2 transition-all duration-500 flex flex-col items-center text-center space-y-8 overflow-hidden",
      passed 
        ? "bg-emerald-500/3 border-emerald-500/20 shadow-2xl shadow-emerald-500/10" 
        : effectiveUnlocked 
          ? "bg-orange-600/3 border-orange-600/30 border-dashed shadow-2xl shadow-orange-600/5" 
          : "bg-zinc-100/50 border-zinc-200 opacity-60" 
    )}>
      
      {/* BADGE DE ADMIN */}
      {isAdmin && !passed && (
        <div className="absolute top-6 flex items-center gap-1.5 rounded-full bg-orange-600/10 px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-orange-600 border border-orange-600/20 z-20">
          <ShieldCheck size={12} />
          Acesso Admin
        </div>
      )}

      {/* ÍCONE DINÂMICO */}
      <div className={cn(
        "w-20 h-20 rounded-[28px] flex items-center justify-center shadow-2xl transition-all duration-500 relative z-10",
        passed 
          ? "bg-emerald-500 text-white shadow-emerald-500/20" 
          : effectiveUnlocked 
            ? "bg-orange-600 text-white shadow-orange-600/20 animate-pulse" 
            : "bg-zinc-200 text-zinc-400 border border-zinc-300 shadow-none"
      )}>
        {passed ? (
          <CheckCircle2 size={40} strokeWidth={2.5} />
        ) : effectiveUnlocked ? (
          <Trophy size={40} />
        ) : (
          <Lock size={32} />
        )}
      </div>

      <div className="space-y-3 relative z-10">
        <h3 className={cn(
          "text-3xl font-black uppercase italic tracking-tighter leading-none",
          passed ? "text-emerald-500" : !effectiveUnlocked ? "text-zinc-400" : "text-foreground"
        )}>
          {passed ? "Aprovado!" : "Prova Final"}
        </h3>
        
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] max-w-70 mx-auto leading-relaxed">
          {passed 
            ? "Excelente trabalho! Sua certificação está pronta." 
            : isAdmin
              ? "Você tem acesso total para testar a avaliação final."
              : effectiveUnlocked 
                ? "Requisitos concluídos! Você já pode realizar a prova." 
                : "Bloqueado. Finalize as aulas e quizzes para liberar."}
        </p>
      </div>

      {/* BOTÃO */}
      <button 
        disabled={!effectiveUnlocked && !passed}
        onClick={() => {
          if (passed) {
            router.push(`/colaborador/treinamentos/${trainingId}/prova/resultado`)
          } else {
            router.push(`/colaborador/treinamentos/${trainingId}/prova`)
          }
        }}
        className={cn(
          "group relative z-10 flex items-center gap-3 px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95",
          passed
            ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
            : effectiveUnlocked 
              ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/20" 
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed border border-zinc-300"
        )}
      >
        <span>
          {passed ? "Ver meu Resultado" : effectiveUnlocked ? "Iniciar Prova Agora" : "Acesso Bloqueado"}
        </span>
        {passed ? (
          <FileBadge size={16} className="group-hover:rotate-12 transition-transform" />
        ) : effectiveUnlocked ? (
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        ) : null}
      </button>

      {/* ELEMENTOS DE FUNDO */}
      {!effectiveUnlocked && !passed && (
        <Lock size={140} className="absolute -right-10 -bottom-10 text-zinc-900/3 -rotate-12 pointer-events-none" />
      )}
      
      {(passed || (isAdmin && !passed)) && (
        <Trophy size={140} className="absolute -right-10 -bottom-10 text-emerald-500/5 -rotate-12 pointer-events-none" />
      )}
    </div>
  )
}