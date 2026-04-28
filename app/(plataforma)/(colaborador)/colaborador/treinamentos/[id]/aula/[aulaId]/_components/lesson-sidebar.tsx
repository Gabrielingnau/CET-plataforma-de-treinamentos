"use client"

import { Play, CheckCircle2, Lock, LayoutGrid, Clock, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

export function LessonSidebar({
  trainingId,
  currentLessonId,
  lessons,
  completedLessons,
  moduleId,
  quizDone,
  isAdmin, // Adicionado via props do Page
}: any) {
  const { push } = useRouter()
  
  const completedCount = (completedLessons || []).filter((id: number) =>
    lessons.some((l: { id: number }) => l.id === id)
  ).length

  // Se for admin, todas as aulas são consideradas "completas" para liberar o Quiz
  const allLessonsCompleted = isAdmin || completedCount === lessons.length

  return (
    <aside className="flex w-full shrink-0 flex-col border-border bg-card lg:h-[80vh] lg:w-80 lg:border-l xl:w-[380px]">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/80 p-6 backdrop-blur-sm">
        <div className="flex flex-col">
          <h3 className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            Conteúdo do Módulo
          </h3>
          <p className="text-[9px] font-bold text-zinc-400 uppercase">
            {isAdmin ? "Modo Administrador" : "Progresso linear"}
          </p>
        </div>
        <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-[11px] font-black text-emerald-500 shadow-sm">
          {isAdmin ? "∞" : `${completedCount}/${lessons.length}`}
        </span>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto">
        {lessons.map((item: {id: string, titulo: string, duracao_min: string}, index: number) => {
          const isSelected = item.id === currentLessonId
          const isCompleted = completedLessons.includes(item.id)

          // TRAVA LINEAR - Se for admin, isLocked é sempre false
          const isFirst = index === 0
          const isLocked = !isAdmin && !isFirst && !completedLessons.includes(lessons[index - 1].id)

          return (
            <Link
              key={item.id}
              href={isLocked ? "#" : `/colaborador/treinamentos/${trainingId}/aula/${item.id}`}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault()
                  toast.error("Aula Bloqueada", {
                    description: "Você precisa terminar a aula anterior.",
                  })
                }
              }}
              className={cn(
                "group flex items-center gap-4 border-l-4 px-6 py-5 transition-all relative",
                isSelected
                  ? "border-orange-600 bg-orange-600/5"
                  : isCompleted
                    ? "border-transparent bg-emerald-500/[0.03]"
                    : "border-transparent hover:bg-muted/30",
                isLocked && "cursor-not-allowed opacity-50 grayscale"
              )}
            >
              {/* ÍCONE DE STATUS */}
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110",
                  isLocked
                    ? "bg-zinc-100 text-zinc-400 border-zinc-200"
                    : isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : isSelected
                        ? "border-orange-600 bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                        : "bg-muted border-border text-muted-foreground"
                )}
              >
                {isLocked ? (
                  <Lock size={14} />
                ) : isCompleted ? (
                  <CheckCircle2 size={16} strokeWidth={3} />
                ) : (
                  <Play size={12} className={isSelected ? "fill-white" : ""} />
                )}
              </div>

              {/* TEXTOS DA AULA */}
              <div className="flex flex-col truncate flex-1">
                <p
                  className={cn(
                    "truncate text-[11px] leading-tight font-black uppercase tracking-tight",
                    isLocked
                      ? "text-zinc-400"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-foreground"
                  )}
                >
                  {item.titulo}
                </p>
                
                <div className="flex items-center gap-2 mt-1">
                   {/* Badge de Tempo */}
                   <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-400">
                      <Clock size={10} />
                      <span>{item.duracao_min} min</span>
                   </div>

                   {/* Status Label */}
                   {isCompleted && (
                     <span className="text-[8px] font-black text-emerald-500/70 uppercase tracking-tighter">
                       • Concluída
                     </span>
                   )}
                   {isLocked && (
                     <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">
                       • Bloqueada
                     </span>
                   )}
                   {isAdmin && !isCompleted && (
                     <span className="text-[8px] font-black text-orange-600 uppercase tracking-tighter">
                       • Liberado
                     </span>
                   )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* QUIZ FOOTER */}
      <div className="border-t border-border bg-card p-6">
        <div
          className={cn(
            "flex flex-col gap-4 rounded-2xl border-2 p-5 transition-all duration-500",
            quizDone
              ? "border-emerald-500/20 bg-emerald-500/5 shadow-inner"
              : allLessonsCompleted
                ? "border-orange-600/30 bg-orange-600/5 shadow-lg shadow-orange-600/5 animate-in fade-in zoom-in"
                : "bg-muted/50 grayscale opacity-70"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl shadow-xl transition-all duration-500",
                quizDone
                  ? "bg-emerald-500 text-white"
                  : allLessonsCompleted
                    ? "bg-orange-600 text-white scale-110 shadow-orange-600/20"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {quizDone ? <CheckCircle2 size={24} /> : <LayoutGrid size={24} />}
            </div>
            <div className="flex flex-col">
              <h3 className="text-[11px] font-black tracking-tight uppercase leading-none">
                {quizDone ? "Módulo Concluído" : "Avaliação Final"}
              </h3>
              <p
                className={cn(
                  "text-[9px] font-black mt-1 tracking-widest",
                  quizDone ? "text-emerald-500" : (allLessonsCompleted ? "text-orange-600" : "text-muted-foreground")
                )}
              >
                {quizDone
                  ? "✓ APROVADO"
                  : allLessonsCompleted
                    ? (isAdmin ? "ACESSO ADMIN" : "LIBERADO")
                    : "BLOQUEADO"}
              </p>
            </div>
          </div>

          <button
            disabled={!allLessonsCompleted}
            onClick={() =>
              push(`/colaborador/treinamentos/${trainingId}/quiz/${moduleId}`)
            }
            className={cn(
              "w-full rounded-xl py-4 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 group/btn active:scale-95 shadow-md",
              quizDone
                ? "bg-zinc-900 text-white hover:bg-black"
                : allLessonsCompleted
                  ? "bg-orange-600 text-white hover:bg-orange-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-600/20"
                  : "cursor-not-allowed bg-zinc-200 text-zinc-400 border-zinc-300"
            )}
          >
            {quizDone ? (
              <>Refazer Quiz <RotateCcw size={14} className="group-hover/btn:rotate-180 transition-transform duration-500" /></>
            ) : (
              <>Iniciar Desafio <LayoutGrid size={14} /></>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}