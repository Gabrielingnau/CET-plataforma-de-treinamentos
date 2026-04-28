"use client"

import { AuthContext } from "@/contexts/auth-context"
import { useExamIntro } from "@/hooks/curso/use-exam-intro"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  ArrowLeft,
  CircleCheck,
  Clock,
  Loader2,
  Lock,
  Medal,
  MousePointer2,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useContext } from "react"
import { ExamFailedBlock } from "./_components/exam-failed-block"
import { ExamInfoCard } from "./_components/exam-info-card"

export default function ProvaIntroPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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
    isAdmin,
  } = useExamIntro({
    userId: user?.id,
    trainingId,
    userRole: user?.role ?? undefined,
  })

  if (isLoading || !playerData)
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
          <span className="text-muted-foreground animate-pulse text-[10px] font-black tracking-[0.3em] uppercase">
            Sincronizando com KYDORA Cloud...
          </span>
        </div>
      </div>
    )

  return (
    <div className="custom-scrollbar bg-background text-foreground min-h-screen overflow-y-auto pb-20">
      {/* HEADER */}
      <header className="bg-background/80 sticky top-0 z-10 flex h-20 items-center justify-between border-b px-6 backdrop-blur-md md:px-12">
        <Link
          href={`/colaborador/treinamentos/${trainingId}/visualizar`}
          className="group text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors"
        >
          <div className="bg-muted rounded-lg p-2 transition-all group-hover:bg-orange-600/10 group-hover:text-orange-600">
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase italic">
            Voltar ao Treinamento
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-muted-foreground text-[9px] font-black tracking-tighter uppercase">
              {isAdmin ? "Privilégio de Acesso" : "Status de Tentativas"}
            </span>
            <span className="text-xs font-black text-orange-600 uppercase italic">
              {isAdmin
                ? "Acesso Ilimitado Admin"
                : `${status.currentAttempts} de ${status.maxAttempts} utilizadas`}
            </span>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl shadow-inner transition-colors",
              isAdmin
                ? "bg-orange-600 text-white"
                : "bg-orange-600/10 text-orange-600",
            )}
          >
            {isAdmin ? <ShieldCheck size={22} /> : <Medal size={22} />}
          </div>
        </div>
      </header>

      <main className="mx-auto mt-16 max-w-4xl space-y-16 px-6">
        <div className="space-y-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-600/20 bg-orange-600/10 px-4 py-1.5">
            <ShieldCheck size={12} className="text-orange-600" />
            <span className="text-[9px] font-black tracking-[0.2em] text-orange-600 uppercase italic">
              {isAdmin
                ? "Modo de Visualização Admin"
                : "Certificação Oficial KYDORA"}
            </span>
          </div>
          <h1 className="text-5xl leading-none font-black tracking-tighter uppercase italic lg:text-8xl">
            {status.hasPassed && !isAdmin ? "Aprovado" : "Prova Final"}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-[11px] leading-relaxed font-black tracking-[0.4em] uppercase">
            {status.title}
          </p>
        </div>

        {status.hasFailedDefinitively ? (
          <ExamFailedBlock
            onReset={handleReset}
            loading={isResetting}
            maxAttempts={status.maxAttempts}
          />
        ) : !isEligible ? (
          <div className="border-border bg-muted/5 flex flex-col items-center space-y-8 rounded-[48px] border-2 border-dashed p-12 text-center lg:p-24">
            <div className="bg-muted text-muted-foreground flex h-20 w-20 items-center justify-center rounded-[2rem] shadow-inner">
              <Lock size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tighter uppercase italic">
                Acesso Bloqueado
              </h3>
              <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Você precisa concluir 100% dos módulos e quizzes antes de
                realizar a prova.
              </p>
            </div>
            <Link
              href={`/colaborador/treinamentos/${trainingId}/visualizar`}
              className="group bg-foreground text-background flex items-center gap-4 rounded-2xl px-12 py-6 text-[10px] font-black uppercase shadow-2xl transition-all hover:bg-orange-600 active:scale-95"
            >
              RETORNAR AOS MÓDULOS
              <ArrowLeft
                size={14}
                className="rotate-180 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 space-y-12 duration-700">
            <ExamInfoCard
              totalQuestions={status.questionsCount}
              minGrade={status.minGrade}
              attempts={playerData.examAttempts || []}
            />

            <div
              className={cn(
                "relative flex flex-col items-center space-y-12 overflow-hidden rounded-[56px] border p-10 text-center shadow-2xl transition-all lg:p-20",
                status.hasPassed && !isAdmin
                  ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                  : "bg-card border-orange-600/10",
              )}
            >
              <h3 className="text-4xl font-black tracking-tighter uppercase italic lg:text-5xl">
                {status.hasPassed && !isAdmin
                  ? "Desempenho de Elite"
                  : "Instruções"}
              </h3>

              {!status.hasPassed || isAdmin ? (
                <>
                  <div className="grid w-full max-w-3xl grid-cols-1 gap-5 text-left md:grid-cols-2">
                    <div className="bg-muted/20 border-border/40 group flex items-start gap-4 rounded-[2.5rem] border p-6 transition-colors hover:border-orange-600/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-600/10 text-orange-600 transition-all duration-500 group-hover:bg-orange-600 group-hover:text-white">
                        <MousePointer2 size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground text-[10px] font-black uppercase">
                          Seleção Única
                        </p>
                        <p className="text-muted-foreground text-[10px] leading-snug font-bold uppercase">
                          Cada questão possui apenas{" "}
                          <span className="text-orange-600">
                            uma alternativa correta
                          </span>
                          .
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/20 border-border/40 group flex items-start gap-4 rounded-[2.5rem] border p-6 transition-colors hover:border-orange-600/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-600/10 text-orange-600 transition-all duration-500 group-hover:bg-orange-600 group-hover:text-white">
                        <CircleCheck size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground text-[10px] font-black uppercase">
                          Aprovação
                        </p>
                        <p className="text-muted-foreground text-[10px] leading-snug font-bold uppercase">
                          É necessário atingir{" "}
                          <span className="text-orange-600">
                            {status.minGrade}%
                          </span>{" "}
                          de acerto.
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/20 border-border/40 group flex items-start gap-4 rounded-[2.5rem] border p-6 transition-colors hover:border-orange-600/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-600/10 text-orange-600 transition-all duration-500 group-hover:bg-orange-600 group-hover:text-white">
                        <Clock size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground text-[10px] font-black uppercase">
                          Sem Pressa
                        </p>
                        <p className="text-muted-foreground text-[10px] leading-snug font-bold uppercase">
                          Leia cada pergunta com calma antes de confirmar sua
                          escolha.
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/20 border-border/40 group flex items-start gap-4 rounded-[2.5rem] border p-6 transition-colors hover:border-orange-600/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-600/10 text-orange-600 transition-all duration-500 group-hover:bg-orange-600 group-hover:text-white">
                        <AlertCircle size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground text-[10px] font-black uppercase">
                          Tentativas
                        </p>
                        <p className="text-muted-foreground text-[10px] leading-snug font-bold uppercase">
                          Você possui um total de{" "}
                          <span className="text-orange-600">
                            {status.maxAttempts} tentativas
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/colaborador/treinamentos/${trainingId}/prova/executar`,
                      )
                    }
                    className="group relative h-20 w-full max-w-md overflow-hidden rounded-[32px] bg-orange-600 text-xs font-black tracking-[0.3em] text-white uppercase shadow-2xl shadow-orange-600/40 transition-all hover:bg-orange-700 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {isAdmin
                        ? "Visualizar Avaliação Final"
                        : "Iniciar Avaliação Final"}
                      <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    </span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-8 py-4">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40">
                    <Medal size={48} />
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-600/20 bg-emerald-600/10 px-10 py-5 text-sm font-black tracking-widest text-emerald-600 uppercase italic">
                      Aprovação Confirmada
                    </div>
                    <Link
                      href={`/colaborador/treinamentos/${trainingId}/prova/resultado`}
                      className="text-muted-foreground block text-[10px] font-black tracking-widest uppercase transition-all hover:text-orange-600"
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
