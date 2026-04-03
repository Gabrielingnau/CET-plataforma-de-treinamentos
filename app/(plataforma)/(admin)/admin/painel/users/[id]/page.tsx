"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  User,
  History,
  Zap,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShieldAlert,
  Trophy,
  LayoutDashboard,
} from "lucide-react"
import { useStudentDossier } from "@/hooks/dashboard/admin/use-student-dossier"
import { Button } from "@/components/ui/button"
import { UnlockModuleModal } from "./_components/unlock-module-modal"
import { cn } from "@/lib/utils"

export default function StudentDossierPage() {
  const params = useParams()
  const router = useRouter()
  const { data, isLoading, isActionLoading, actions } = useStudentDossier(
    params.id as string
  )

  const [selectedTrainingModules, setSelectedTrainingModules] = useState<
    any[] | null
  >(null)

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Sincronizando Dossiê...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen animate-in space-y-10 bg-background p-4 duration-500 fade-in md:p-10 text-foreground">
      {/* HEADER DO ALUNO */}
      <header className="flex flex-col justify-between gap-6 border-b border-border pb-10 md:flex-row md:items-center">
        <div className="space-y-4 max-w-full md:max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-auto p-0 text-[10px] font-black tracking-widest text-muted-foreground uppercase italic hover:text-primary transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Voltar para Unidade
          </Button>

          <div className="flex items-center gap-6 overflow-hidden">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] border-2 border-border bg-muted/50">
              <User size={32} className="text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic md:text-5xl truncate">
                {data?.user.nome}
              </h1>
              <p className="text-[10px] font-black tracking-[0.3em] text-primary uppercase truncate">
                {data?.user.empresa_nome} • ID: {data?.user.id.slice(0, 8)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="min-w-[120px] rounded-3xl border border-border bg-card/50 p-4 text-center">
            <p className="text-[8px] font-black text-muted-foreground uppercase italic">
              Cursos Ativos
            </p>
            <p className="text-2xl font-black italic">
              {data?.trainings.length}
            </p>
          </div>
        </div>
      </header>

      {/* GRID DE TREINAMENTOS */}
      <div className="grid grid-cols-1 gap-8">
        {data?.trainings.map((train) => {
          const isThisTrainingLoading = isActionLoading === train.training_id
          const hasModules = train.modules && train.modules.length > 0

          return (
            <div
              key={train.training_id}
              className="group relative rounded-[3rem] border border-border bg-card/30 p-8 transition-all hover:border-primary/30"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* COLUNA 1: INFO DO CURSO */}
                <div className="space-y-6 lg:col-span-4 min-w-0">
                  <div className="min-w-0">
                    <h3 className="text-2xl leading-tight font-black text-foreground uppercase italic truncate">
                      {train.titulo}
                    </h3>
                    <p className="mt-1 text-[10px] font-bold text-muted-foreground uppercase">
                      Carga Horária: {train.carga_horaria}h
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase italic">
                      <span className="text-muted-foreground">Progresso Atual</span>
                      <span className="text-primary">{train.progresso}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${train.progresso}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 rounded-2xl border border-border bg-background p-3 text-center">
                      <p className="text-[8px] font-black text-muted-foreground uppercase italic">
                        Tentativas
                      </p>
                      <p
                        className={cn(
                          "text-lg font-black italic",
                          train.tentativas_usadas >= train.max_tentativas
                            ? "text-destructive"
                            : "text-foreground"
                        )}
                      >
                        {train.tentativas_usadas} / {train.max_tentativas}
                      </p>
                    </div>
                  </div>
                </div>

                {/* COLUNA 2: HISTÓRICO DE EXAMES */}
                <div className="space-y-4 lg:col-span-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                    <History size={14} /> Log de Performance
                  </h4>
                  <div className="custom-scrollbar max-h-[180px] space-y-2 overflow-y-auto pr-2">
                    {train.historico_provas.length > 0 ? (
                      train.historico_provas.map((attempt, idx) => (
                        <div
                          key={attempt.id}
                          className="flex items-center justify-between rounded-xl border border-border bg-background/40 p-3"
                        >
                          <span className="text-[9px] font-black text-muted-foreground italic">
                            #{idx + 1} TENTATIVA
                          </span>
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "text-xs font-black italic",
                                attempt.passou
                                  ? "text-emerald-500"
                                  : "text-destructive"
                              )}
                            >
                              NOTA: {attempt.pontuacao}
                            </span>
                            {attempt.passou ? (
                              <CheckCircle size={14} className="text-emerald-500" />
                            ) : (
                              <AlertCircle size={14} className="text-destructive" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-2xl border-2 border-dashed border-border py-8">
                        <p className="text-[9px] font-black text-muted-foreground uppercase italic">
                          Nenhuma tentativa realizada
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUNA 3: PAINEL DE OVERRIDES */}
                <div className="space-y-4 rounded-[2rem] border border-primary/10 bg-card p-6 lg:col-span-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
                    <ShieldAlert size={14} /> Overrides Administrativos
                  </h4>

                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      disabled={!!isActionLoading || train.progresso === 100}
                      onClick={() => actions.approveProgress(train.training_id)}
                      className="h-12 justify-start rounded-xl border-border bg-background text-[9px] font-black uppercase italic transition-all hover:bg-emerald-500 hover:text-white"
                    >
                      {isThisTrainingLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LayoutDashboard className="mr-2 h-4 w-4 text-emerald-500" />
                      )}
                      <span className="truncate">Reconstruir Caminho (Aulas/Quiz)</span>
                    </Button>

                    <Button
                      variant="outline"
                      disabled={!!isActionLoading || train.status === "concluido"}
                      onClick={() => actions.passExam(train.training_id)}
                      className="h-12 justify-start rounded-xl border-border bg-background text-[9px] font-black uppercase italic transition-all hover:bg-blue-600 hover:text-white"
                    >
                      {isThisTrainingLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trophy className="mr-2 h-4 w-4 text-blue-500" />
                      )}
                      <span className="truncate">Forçar Aprovação Final</span>
                    </Button>

                    <Button
                      variant="outline"
                      disabled={!!isActionLoading || train.tentativas_usadas === 0}
                      onClick={() => actions.resetExams(train.training_id)}
                      className="h-12 justify-start rounded-xl border-border bg-background text-[9px] font-black uppercase italic transition-all hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {isThisTrainingLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RotateCcw className="mr-2 h-4 w-4 text-destructive" />
                      )}
                      <span className="truncate">Resetar Todas as Tentativas</span>
                    </Button>
                  </div>

                  {hasModules && (
                    <div className="border-t border-border pt-2">
                      <Button
                        variant="ghost"
                        disabled={!!isActionLoading}
                        onClick={() => setSelectedTrainingModules(train.modules)}
                        className="h-8 w-full justify-start p-0 text-[8px] font-black text-muted-foreground uppercase hover:text-primary transition-colors"
                      >
                        <Zap className="mr-2 h-3 w-3 text-yellow-500" />
                        <span className="truncate">Destravar Módulo Individual</span>
                      </Button>
                      <p className="mt-2 text-[7px] leading-tight font-bold text-muted-foreground uppercase italic">
                        * Selecione um módulo específico para forçar a conclusão.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <UnlockModuleModal
        isOpen={!!selectedTrainingModules}
        onClose={() => setSelectedTrainingModules(null)}
        onConfirm={actions.unlockModule}
        isActionLoading={
          typeof isActionLoading === "string" &&
          isActionLoading.startsWith("module")
        }
        modules={selectedTrainingModules || []}
      />
    </div>
  )
}