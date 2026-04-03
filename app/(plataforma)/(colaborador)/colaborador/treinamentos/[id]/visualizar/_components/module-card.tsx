"use client"

import Link from "next/link"
import { Play, CheckCircle2, FileText, Lock, Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModuleCard({ 
  module, 
  completedLessons = [], 
  passedQuizzes = [], 
  isAdmin, 
  trainingId, 
  isLocked 
}: any) {
  
  const firstLesson = module.aulas?.[0]
  const firstLessonId = firstLesson?.id 
  
  const totalMinutes = module.aulas?.reduce((acc: number, aula: any) => acc + (aula.duracao_min || 0), 0) || 0
  const timeString = totalMinutes > 60 
    ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min` 
    : `${totalMinutes}min`

  const moduleLessonIds = module.aulas?.map((a: any) => a.id) || []
  const finishedAllLessons = moduleLessonIds.length > 0 && moduleLessonIds.every((id: any) => completedLessons.includes(id))
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
    <div className={cn(
      "space-y-4 transition-all duration-500", 
      isModuleDisabled && "opacity-60 grayscale-[0.5]"
    )}>
      
      {/* CARD DO MÓDULO (AULAS) */}
      {isModuleDisabled || !firstLessonId ? (
        <div className="relative border-2 rounded-[32px] p-6 lg:p-8 bg-muted border-border cursor-not-allowed">
           <Content isModuleDisabled={true} module={module} timeString={timeString} noLessons={!firstLessonId} />
        </div>
      ) : (
        <Link 
          href={aulaUrl}
          className={cn(
            "block relative overflow-hidden transition-all duration-300 group border-2 rounded-[32px] p-6 lg:p-8 shadow-sm",
            "hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]",
            isModuleFullyCompleted 
              ? "bg-emerald-50 border-emerald-500 hover:bg-emerald-100/50 shadow-emerald-500/10" 
              : "bg-card border-border hover:border-orange-600 shadow-orange-600/5"
          )}
        >
          {isModuleFullyCompleted && (
            <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-1 rounded-bl-2xl flex items-center gap-2 z-20">
              <Check size={14} strokeWidth={4} />
              <span className="text-[10px] font-black uppercase tracking-widest">Concluído</span>
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
            "group border-2 rounded-[28px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-xl active:scale-[0.99]",
            hasPassedQuiz 
              ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20" 
              : "bg-card border-border hover:border-orange-600 shadow-orange-600/5"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-transform group-hover:scale-110",
              hasPassedQuiz ? "bg-white text-emerald-600 border-white" : "bg-muted border-border group-hover:border-orange-600/30"
            )}>
              <FileText size={20} />
            </div>
            <div className="text-left">
              <p className={cn(
                "text-[11px] font-black uppercase tracking-widest leading-none mb-1", 
                hasPassedQuiz ? "text-white" : "text-foreground"
              )}>
                Avaliação do Módulo
              </p>
              <p className={cn(
                "text-[10px] font-bold uppercase", 
                hasPassedQuiz ? "text-emerald-100" : "text-muted-foreground"
              )}>
                {isAdmin ? "Acesso Admin Liberado" : hasPassedQuiz ? "Você foi aprovado!" : "Libera após os vídeos"}
              </p>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
            hasPassedQuiz 
              ? "bg-white/20 text-white backdrop-blur-sm" 
              : "bg-orange-600 text-white group-hover:bg-orange-700"
          )}>
            {hasPassedQuiz ? "Refazer" : "Iniciar Quiz"}
            <ChevronRight size={14} strokeWidth={3} />
          </div>
        </Link>
      ) : (
        /* Estado Bloqueado do Quiz (Só aparece para colaborador que não terminou as aulas) */
        <div className="border-2 rounded-[28px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/50 border-border opacity-60 grayscale cursor-not-allowed">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 bg-muted border-border">
              <Lock size={18} className="text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-muted-foreground">Avaliação</p>
              <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Bloqueado</p>
            </div>
          </div>
          <div className="px-6 py-3 rounded-xl bg-zinc-200 text-zinc-400 text-[9px] font-black uppercase tracking-widest">
            Indisponível
          </div>
        </div>
      )}
    </div>
  )
}

function Content({ isModuleFullyCompleted, isModuleDisabled, module, timeString, noLessons }: any) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className={cn(
        "w-16 h-16 rounded-[22px] border-2 flex items-center justify-center shrink-0 transition-all duration-500",
        isModuleFullyCompleted
          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30"
          : isModuleDisabled 
            ? "bg-zinc-200 border-zinc-300 text-zinc-400" 
            : "bg-muted border-border group-hover:bg-orange-600 group-hover:border-orange-600 text-muted-foreground group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm"
      )}>
        {isModuleFullyCompleted ? <CheckCircle2 size={32} /> : isModuleDisabled ? <Lock size={24} /> : <Play size={28} className="group-hover:fill-current" />}
      </div>

      <div className="flex-1 space-y-2 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={cn(
            "text-2xl font-black uppercase italic tracking-tighter leading-none transition-colors",
            isModuleFullyCompleted ? "text-emerald-900" : "text-foreground group-hover:text-orange-600"
          )}>
            {module.titulo}
          </h3>
          <span className={cn(
            "text-[9px] px-2 py-1 rounded-lg font-black uppercase tracking-widest border",
            isModuleFullyCompleted ? "bg-emerald-200/50 border-emerald-300 text-emerald-700" : "bg-zinc-100 border-zinc-200 text-zinc-500 group-hover:border-orange-600/20 group-hover:text-orange-600"
          )}>
            {module.aulas?.length || 0} Aulas • {timeString}
          </span>
        </div>
        <p className={cn(
          "text-sm leading-relaxed max-w-3xl line-clamp-2 font-medium transition-colors",
          isModuleFullyCompleted ? "text-emerald-700/80" : "text-muted-foreground group-hover:text-foreground/80"
        )}>
          {noLessons ? "Nenhuma aula cadastrada neste módulo." : module.descricao}
        </p>
      </div>
    </div>
  )
}