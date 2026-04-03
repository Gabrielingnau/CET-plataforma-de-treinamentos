"use client"

import React, { useContext } from "react"
import { Trophy, XCircle, RefreshCcw, FileBadge, Home, Loader2, AlertCircle, BookOpen, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { useExamResult } from "@/hooks/curso/use-exam-result"

export default function ResultadoProvaPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useContext(AuthContext)
  const isAdmin = user?.role === "admin"
  const router = useRouter()
  const resolvedParams = React.use(params)
  const trainingId = Number(resolvedParams.id)

  const { data, result, isLoading, isResetting, handleReset } = useExamResult({
    userId: user?.id,
    trainingId
  })

  if (isLoading || !data || !result) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  const passed = result.passed

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 space-y-6">
        
        <div className={cn(
          "relative space-y-6 overflow-hidden rounded-[40px] border p-8 text-center shadow-xl",
          passed ? "bg-emerald-500/[0.03] border-emerald-500/10" : "bg-red-500/[0.03] border-red-500/10"
        )}>
          {/* Admin Header */}
          {isAdmin && (
            <div className="absolute top-0 left-0 right-0 bg-orange-600 py-2 flex items-center justify-center gap-2 z-20">
              <ShieldCheck size={14} className="text-white" />
              <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Modo Admin: Resultado Não Gravado</span>
            </div>
          )}

          <div className="relative z-10 flex flex-col items-center gap-4 pt-4">
            <div className={cn(
              "flex h-20 w-20 items-center justify-center rounded-[28px] shadow-2xl",
              passed ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-red-500 text-white shadow-red-500/30"
            )}>
              {passed ? <Trophy size={40} /> : <XCircle size={40} />}
            </div>

            <div className="space-y-1">
              <h1 className={cn(
                "text-4xl font-black tracking-tighter uppercase italic",
                passed ? "text-emerald-500" : "text-red-500"
              )}>
                {passed ? "Aprovado!" : "Tente Novamente"}
              </h1>
              <p className="text-[9px] font-black tracking-[0.2em] text-muted-foreground/60 uppercase">
                {isAdmin ? "Simulação de Desempenho" : "Resultado da Avaliação"}
              </p>
            </div>
          </div>

          <div className="relative z-10 border-y border-border/50 py-6">
            <span className="text-8xl font-black tracking-tighter italic tabular-nums leading-none">
              {result.score}<span className="text-2xl text-muted-foreground/30 not-italic">%</span>
            </span>
          </div>

          <p className="relative z-10 px-4 text-xs font-medium text-muted-foreground italic leading-relaxed">
            {passed
              ? "Excelente! Sua certificação já está disponível para emissão no menu principal."
              : result.hasFailedDefinitively && !isAdmin
                ? `Tentativas esgotadas (${result.maxAttempts}/${result.maxAttempts}). Inicie a reciclagem para liberar o conteúdo novamente.`
                : `Você atingiu ${result.score}%. Restam ${isAdmin ? "∞" : result.remainingAttempts} tentativa(s) de teste.`}
          </p>

          <div className="relative z-10 flex flex-col gap-3 pt-4">
            {passed ? (
              <button
                onClick={() => router.push(`/colaborador/treinamentos/${trainingId}/visualizar`)}
                className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-5 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95"
              >
                <FileBadge size={16} /> Finalizar Treinamento
              </button>
            ) : (result.hasFailedDefinitively && !isAdmin) ? (
              <button
                disabled={isResetting}
                onClick={() => handleReset()}
                className="flex items-center justify-center gap-3 rounded-2xl bg-red-600 py-5 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {isResetting ? <Loader2 className="animate-spin" size={16} /> : <BookOpen size={16} />}
                Reiniciar e estuadar novamente
              </button>
            ) : (
              <button
                onClick={() => router.push(`/colaborador/treinamentos/${trainingId}/prova`)}
                className="flex items-center justify-center gap-3 rounded-2xl bg-orange-600 py-5 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95"
              >
                <RefreshCcw size={16} /> Tentar Novamente
              </button>
            )}

            <Link
              href={`/colaborador/treinamentos/${trainingId}/visualizar`}
              className="flex items-center justify-center gap-3 rounded-2xl border bg-card py-5 text-[10px] font-black tracking-widest uppercase hover:bg-muted transition-all active:scale-95"
            >
              <Home size={16} /> Ir para a vitrine
            </Link>
          </div>
        </div>

        {(result.hasFailedDefinitively && !isAdmin) && (
          <div className="flex animate-in slide-in-from-top-2 items-start gap-4 rounded-[24px] border border-red-500/20 bg-red-500/10 p-5">
            <AlertCircle className="shrink-0 text-red-500" size={20} />
            <div className="space-y-1 text-left">
              <p className="text-[9px] font-black tracking-widest text-red-500 uppercase">Aviso de Reciclagem</p>
              <p className="text-[10px] leading-tight font-bold text-red-500/80 uppercase">
                Seu progresso será zerado para permitir um novo ciclo de estudo completo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}