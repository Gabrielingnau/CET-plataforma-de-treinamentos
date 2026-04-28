"use client"

import { cn } from "@/lib/utils"
import {
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  Lock,
  Play,
} from "lucide-react"
import Link from "next/link"

export function ModuleCard({
  module,
  completedLessons = [],
  passedQuizzes = [],
  isAdmin,
  trainingId,
  isLocked,
}: any) {
  const firstLesson = module.aulas?.[0]
  const firstLessonId = firstLesson?.id

  const totalMinutes =
    module.aulas?.reduce(
      (acc: number, aula: any) => acc + (aula.duracao_min || 0),
      0,
    ) || 0
  const timeString =
    totalMinutes > 60
      ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min`
      : `${totalMinutes}min`

  const moduleLessonIds = module.aulas?.map((a: any) => a.id) || []
  const finishedAllLessons =
    moduleLessonIds.length > 0 &&
    moduleLessonIds.every((id: any) => completedLessons.includes(id))
  const hasPassedQuiz = passedQuizzes.includes(module.id)

  const isModuleFullyCompleted = finishedAllLessons && hasPassedQuiz

  // SE FOR ADMIN, NUNCA ESTÁ BLOQUEADO
  const isModuleDisabled = !isAdmin && isLocked
  // SE FOR ADMIN, O QUIZ SEMPRE ESTÁ LIBERADO (NÃO PRECISA TERMINAR AS AULAS)
  const isQuizDisabled = !isAdmin && !finishedAllLessons

  const aulaUrl = firstLessonId
    ? `/colaborador/treinamentos/${trainingId}/aula/${firstLessonId}?moduleId=${module.id}`
    : "#"

  return (
    <div
      className={cn(
        "space-y-4 transition-all duration-500",
        isModuleDisabled && "opacity-60 grayscale-[0.5]",
      )}
    >
      {/* CARD DO MÓDULO (AULAS) */}
      {isModuleDisabled || !firstLessonId ? (
        <div className="bg-muted border-border Treinamentor-not-allowed relative rounded-[32px] border-2 p-6 lg:p-8">
          <Content
            isModuleDisabled={true}
            module={module}
            timeString={timeString}
            noLessons={!firstLessonId}
          />
        </div>
      ) : (
        <Link
          href={aulaUrl}
          className={cn(
            "group relative block overflow-hidden rounded-[32px] border-2 p-6 shadow-sm transition-all duration-300 lg:p-8",
            "hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]",
            isModuleFullyCompleted
              ? "border-emerald-500 bg-emerald-50 shadow-emerald-500/10 hover:bg-emerald-100/50"
              : "bg-card border-border shadow-orange-600/5 hover:border-orange-600",
          )}
        >
          {isModuleFullyCompleted && (
            <div className="absolute top-0 right-0 z-20 flex items-center gap-2 rounded-bl-2xl bg-emerald-500 px-6 py-1 text-white">
              <Check size={14} strokeWidth={4} />
              <span className="text-[10px] font-black tracking-widest uppercase">
                Concluído
              </span>
            </div>
          )}

          <Content
            isModuleFullyCompleted={isModuleFullyCompleted}
            module={module}
            timeString={timeString}
          />
        </Link>
      )}

      {/* CARD DO QUIZ */}
      {!isQuizDisabled ? (
        <Link
          href={`/colaborador/treinamentos/${trainingId}/quiz/${module.id}`}
          className={cn(
            "group flex flex-col items-center justify-between gap-4 rounded-[28px] border-2 p-5 transition-all duration-300 sm:flex-row",
            "hover:-translate-y-1 hover:shadow-xl active:scale-[0.99]",
            hasPassedQuiz
              ? "border-emerald-600 bg-emerald-500 text-white shadow-emerald-500/20"
              : "bg-card border-border shadow-orange-600/5 hover:border-orange-600",
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 transition-transform group-hover:scale-110",
                hasPassedQuiz
                  ? "border-white bg-white text-emerald-600"
                  : "bg-muted border-border group-hover:border-orange-600/30",
              )}
            >
              <FileText size={20} />
            </div>
            <div className="text-left">
              <p
                className={cn(
                  "mb-1 text-[11px] leading-none font-black tracking-widest uppercase",
                  hasPassedQuiz ? "text-white" : "text-foreground",
                )}
              >
                Avaliação do Módulo
              </p>
              <p
                className={cn(
                  "text-[10px] font-bold uppercase",
                  hasPassedQuiz ? "text-emerald-100" : "text-muted-foreground",
                )}
              >
                {isAdmin
                  ? "Acesso Admin Liberado"
                  : hasPassedQuiz
                    ? "Você foi aprovado!"
                    : "Libera após os vídeos"}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-3 text-[9px] font-black tracking-widest uppercase transition-all",
              hasPassedQuiz
                ? "bg-white/20 text-white backdrop-blur-sm"
                : "bg-orange-600 text-white group-hover:bg-orange-700",
            )}
          >
            {hasPassedQuiz ? "Refazer" : "Iniciar Quiz"}
            <ChevronRight size={14} strokeWidth={3} />
          </div>
        </Link>
      ) : (
        /* Estado Bloqueado do Quiz (Só aparece para colaborador que não terminou as aulas) */
        <div className="bg-muted/50 border-border flex cursor-not-allowed flex-col items-center justify-between gap-4 rounded-[28px] border-2 p-5 opacity-60 grayscale sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="bg-muted border-border flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2">
              <Lock size={18} className="text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="text-muted-foreground mb-1 text-[11px] leading-none font-black tracking-widest uppercase">
                Avaliação
              </p>
              <p className="text-muted-foreground/60 text-[10px] font-bold uppercase">
                Bloqueado
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-zinc-200 px-6 py-3 text-[9px] font-black tracking-widest text-zinc-400 uppercase">
            Indisponível
          </div>
        </div>
      )}
    </div>
  )
}

function Content({
  isModuleFullyCompleted,
  isModuleDisabled,
  module,
  timeString,
  noLessons,
}: any) {
  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      <div
        className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border-2 transition-all duration-500",
          isModuleFullyCompleted
            ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
            : isModuleDisabled
              ? "border-zinc-300 bg-zinc-200 text-zinc-400"
              : "bg-muted border-border text-muted-foreground shadow-sm group-hover:scale-110 group-hover:rotate-3 group-hover:border-orange-600 group-hover:bg-orange-600 group-hover:text-white",
        )}
      >
        {isModuleFullyCompleted ? (
          <CheckCircle2 size={32} />
        ) : isModuleDisabled ? (
          <Lock size={24} />
        ) : (
          <Play size={28} className="group-hover:fill-current" />
        )}
      </div>

      <div className="flex-1 space-y-2 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cn(
              "text-2xl leading-none font-black tracking-tighter uppercase italic transition-colors",
              isModuleFullyCompleted
                ? "text-emerald-900"
                : "text-foreground group-hover:text-orange-600",
            )}
          >
            {module.titulo}
          </h3>
          <span
            className={cn(
              "rounded-lg border px-2 py-1 text-[9px] font-black tracking-widest uppercase",
              isModuleFullyCompleted
                ? "border-emerald-300 bg-emerald-200/50 text-emerald-700"
                : "border-zinc-200 bg-zinc-100 text-zinc-500 group-hover:border-orange-600/20 group-hover:text-orange-600",
            )}
          >
            {module.aulas?.length || 0} Aulas • {timeString}
          </span>
        </div>
        <p
          className={cn(
            "line-clamp-2 max-w-3xl text-sm leading-relaxed font-medium transition-colors",
            isModuleFullyCompleted
              ? "text-emerald-700/80"
              : "text-muted-foreground group-hover:text-foreground/80",
          )}
        >
          {noLessons
            ? "Nenhuma aula cadastrada neste módulo."
            : module.descricao}
        </p>
      </div>
    </div>
  )
}
