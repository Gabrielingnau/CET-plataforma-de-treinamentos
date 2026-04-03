"use client"

import React, { useContext } from "react"
import { ArrowLeft, Medal, Lock, Loader2, CircleCheck, AlertCircle, Clock, ShieldCheck, MousePointer2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/contexts/auth-context"
import { useExamIntro } from "@/hooks/curso/use-exam-intro"
import { ExamFailedBlock } from "./_components/exam-failed-block"
import { ExamInfoCard } from "./_components/exam-info-card"
import { cn } from "@/lib/utils"

export default function ProvaIntroPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const resolvedParams = React.use(params)
  const trainingId = Number(resolvedParams.id)

  const { 
    playerData, 
    status, 
    isEligible, 
    isLoading, 
    isResetting, 
    handleReset,
    isAdmin
  } = useExamIntro({ 
    userId: user?.id, 
    trainingId, 
    userRole: user?.role ?? undefined
  })

  if (isLoading || !playerData) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
          Sincronizando com KYDORA Cloud...
        </span>
      </div>
    </div>
  )

  return (
    <div className="custom-scrollbar min-h-screen overflow-y-auto bg-background pb-20 text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b bg-background/80 px-6 md:px-12 backdrop-blur-md">
        <Link 
          href={`/colaborador/treinamentos/${trainingId}/visualizar`} 
          className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="p-2 rounded-lg bg-muted group-hover:bg-orange-600/10 group-hover:text-orange-600 transition-all">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase italic">Voltar ao curso</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">
               {isAdmin ? "Privilégio de Acesso" : "Status de Tentativas"}
             </span>
             <span className="text-xs font-black uppercase italic text-orange-600">
               {isAdmin ? "Acesso Ilimitado Admin" : `${status.currentAttempts} de ${status.maxAttempts} utilizadas`}
             </span>
          </div>
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shadow-inner transition-colors",
            isAdmin ? "bg-orange-600 text-white" : "bg-orange-600/10 text-orange-600"
          )}>
            {isAdmin ? <ShieldCheck size={22} /> : <Medal size={22} />}
          </div>
        </div>
      </header>

      <main className="mx-auto mt-16 max-w-4xl space-y-16 px-6">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 mb-4">
             <ShieldCheck size={12} className="text-orange-600" />
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600 italic">
               {isAdmin ? "Modo de Visualização Admin" : "Certificação Oficial KYDORA"}
             </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic lg:text-8xl leading-none">
            {status.hasPassed && !isAdmin ? "Aprovado" : "Prova Final"}
          </h1>
          <p className="text-[11px] font-black tracking-[0.4em] text-muted-foreground uppercase max-w-xl mx-auto leading-relaxed">
            {status.title}
          </p>
        </div>

        {status.hasFailedDefinitively ? (
          <ExamFailedBlock onReset={handleReset} loading={isResetting} maxAttempts={status.maxAttempts}/>
        ) 
        
        : !isEligible ? (
          <div className="flex flex-col items-center space-y-8 rounded-[48px] border-2 border-dashed border-border p-12 text-center lg:p-24 bg-muted/5">
            <div className="h-20 w-20 rounded-[2rem] bg-muted flex items-center justify-center text-muted-foreground shadow-inner">
              <Lock size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">Acesso Bloqueado</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Você precisa concluir 100% dos módulos e quizzes antes de realizar a prova.
              </p>
            </div>
            <Link href={`/colaborador/treinamentos/${trainingId}/visualizar`} className="group flex items-center gap-4 rounded-2xl bg-foreground px-12 py-6 text-[10px] font-black text-background uppercase shadow-2xl hover:bg-orange-600 transition-all active:scale-95">
              RETORNAR AOS MÓDULOS
              <ArrowLeft size={14} className="rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) 
        
        : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ExamInfoCard
              totalQuestions={status.questionsCount}
              minGrade={status.minGrade}
              attempts={playerData.examAttempts || []}
            />
            
            <div className={cn(
              "relative flex flex-col items-center space-y-12 overflow-hidden rounded-[56px] border p-10 text-center shadow-2xl lg:p-20 transition-all",
              (status.hasPassed && !isAdmin) ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "bg-card border-orange-600/10"
            )}>
              
              <h3 className="text-4xl font-black uppercase italic lg:text-5xl tracking-tighter">
                {(status.hasPassed && !isAdmin) ? "Desempenho de Elite" : "Instruções"}
              </h3>

              {(!status.hasPassed || isAdmin) ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left w-full max-w-3xl">
                    <div className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-muted/20 border border-border/40 hover:border-orange-600/20 transition-colors group">
                      <div className="h-10 w-10 shrink-0 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                        <MousePointer2 size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-foreground">Seleção Única</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-snug">
                          Cada questão possui apenas <span className="text-orange-600">uma alternativa correta</span>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-muted/20 border border-border/40 hover:border-orange-600/20 transition-colors group">
                      <div className="h-10 w-10 shrink-0 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                        <CircleCheck size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-foreground">Aprovação</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-snug">
                          É necessário atingir <span className="text-orange-600">{status.minGrade}%</span> de acerto.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-muted/20 border border-border/40 hover:border-orange-600/20 transition-colors group">
                      <div className="h-10 w-10 shrink-0 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                        <Clock size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-foreground">Sem Pressa</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-snug">
                          Leia cada pergunta com calma antes de confirmar sua escolha.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-muted/20 border border-border/40 hover:border-orange-600/20 transition-colors group">
                      <div className="h-10 w-10 shrink-0 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                        <AlertCircle size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-foreground">Tentativas</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-snug">
                          Você possui um total de <span className="text-orange-600">{status.maxAttempts} tentativas</span>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/colaborador/treinamentos/${trainingId}/prova/executar`)}
                    className="group relative h-20 w-full max-w-md overflow-hidden rounded-[32px] bg-orange-600 text-xs font-black tracking-[0.3em] text-white uppercase shadow-2xl shadow-orange-600/40 transition-all active:scale-95 hover:bg-orange-700"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {isAdmin ? "Visualizar Avaliação Final" : "Iniciar Avaliação Final"}
                      <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    </span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-8 py-4">
                   <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40">
                      <Medal size={48} />
                    </div>
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-emerald-600/10 border border-emerald-600/20 px-10 py-5 text-sm font-black tracking-widest text-emerald-600 uppercase italic">
                      Aprovação Confirmada
                    </div>
                    <Link 
                      href={`/colaborador/treinamentos/${trainingId}/prova/resultado`} 
                      className="block text-[10px] font-black tracking-widest text-muted-foreground uppercase hover:text-orange-600 transition-all"
                    >
                      Clique aqui para ver o desempenho detalhado
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}