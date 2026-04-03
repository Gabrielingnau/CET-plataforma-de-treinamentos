"use client"

import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface QuizResultProps {
  data: { pontuacao: number; passou: boolean } | any
  trainingId: number
  onRetry: () => void
  isAdmin?: boolean // Adicionado para controle de visualização
}

export function QuizResult({ data, trainingId, onRetry, isAdmin }: QuizResultProps) {
  const router = useRouter()
  const passed = data?.passou

  return (
    <div className="flex h-dvh items-center justify-center bg-background p-4 animate-in fade-in zoom-in duration-300">
      <div className="w-full max-w-md space-y-6 rounded-[40px] border border-border bg-card p-10 text-center shadow-2xl relative overflow-hidden">
        
        {/* Badge de Admin Discreta */}
        {isAdmin && (
          <div className="absolute top-0 left-0 right-0 bg-orange-600 py-1.5 flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-white" />
            <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Resultado Simulado (Admin)</span>
          </div>
        )}

        <div className={cn(
          "mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] shadow-2xl transition-all mt-4",
          passed ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-red-500 text-white shadow-red-500/20"
        )}>
          {passed ? <CheckCircle2 size={48} strokeWidth={2.5} /> : <XCircle size={48} strokeWidth={2.5} />}
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
            {passed ? "Aprovado!" : "Tente de Novo"}
          </h2>
          <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
            Sua Nota: <span className={passed ? "text-emerald-500" : "text-red-500"}>{data?.pontuacao}%</span>
          </p>
        </div>

        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          {isAdmin 
            ? "Como administrador, você pode visualizar este resultado sem afetar as estatísticas do treinamento."
            : passed 
              ? "Excelente trabalho! Você dominou este conteúdo e o próximo módulo já está disponível." 
              : "Ops! Você precisa de pelo menos 70% de acerto para progredir no treinamento."}
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => router.push(`/colaborador/treinamentos/${trainingId}/visualizar`)}
            className="w-full rounded-2xl bg-foreground py-5 text-[10px] font-black tracking-widest text-background uppercase transition-all active:scale-95"
          >
            {isAdmin ? "Finalizar Preview" : "Voltar ao Início"}
          </button>
          
          {/* Se for admin, sempre mostramos a opção de refazer para facilitar seus testes */}
          {(!passed || isAdmin) && (
            <button
              onClick={onRetry}
              className="w-full rounded-2xl bg-muted py-5 text-[10px] font-black tracking-widest text-muted-foreground uppercase hover:text-foreground transition-all"
            >
              Refazer Avaliação
            </button>
          )}
        </div>
      </div>
    </div>
  )
}