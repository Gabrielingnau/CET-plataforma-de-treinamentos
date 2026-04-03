"use client"

import React, { useContext } from "react"
import { AuthContext } from "@/contexts/auth-context"
import { useTrainingStructure } from "@/hooks/curso/use-training-structure"

import { FinalExamCard } from "./_components/final-exam-card"
import { ModuleCard } from "./_components/module-card"
import { ProgressCard } from "./_components/progress-card"
import { cn } from "@/lib/utils"

export default function VisualizarTreinamentoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { user } = useContext(AuthContext)
  const resolvedParams = React.use(params)
  const trainingId = Number(resolvedParams.id)

  const isAdmin = user?.role === "admin"

  const { data, isLoading, error, isEligible, totalLessons, totalModules } =
    useTrainingStructure({ userId: user?.id, trainingId })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground animate-pulse">
            Sincronizando seu progresso...
          </p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-20 text-center text-destructive font-black uppercase italic">
        Erro ao carregar curso.
      </div>
    )
  }

  const modulos = data.training.modulos || []

  return (
    <div className="min-h-screen bg-background pb-22 text-foreground">
      {/* HEADER DINÂMICO */}
      <div className="relative flex min-h-[350px] w-full flex-col justify-end bg-muted md:h-[500px] overflow-hidden">
        <img
          src={data.training.cover_url || "/default-cover.jpg"}
          className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale-[0.3]"
          alt="Capa"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl p-6 md:p-12 lg:p-16">
          <div className="mb-4 flex items-center gap-2">
            <span className={cn(
              "rounded-full px-3 py-1 text-[8px] font-black tracking-widest text-white uppercase",
              isAdmin ? "bg-blue-600" : "bg-primary"
            )}>
              {isAdmin ? "Modo Administrador (Tudo Liberado)" : "Treinamento Ativo"}
            </span>
          </div>
          
          {/* Título com truncamento em múltiplas linhas (line-clamp) se necessário, ou truncate simples */}
          <h1 className="max-w-5xl text-4xl leading-[0.85] font-black tracking-tighter text-white uppercase italic md:text-6xl lg:text-9xl line-clamp-3 md:line-clamp-2">
            {data.training.titulo}
          </h1>

          <p className="mt-6 max-w-2xl text-[10px] leading-tight font-bold text-muted-foreground uppercase md:text-sm lg:text-base line-clamp-3">
            {data.training.descricao}
          </p>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2 min-w-0">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary" />
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-muted-foreground">Módulos do Curso</h2>
            </div>
            
            <div className="grid gap-4">
              {modulos.map((modulo: any, index: number) => {
                let isLocked = false
                
                if (!isAdmin && index > 0) {
                  const moduloAnterior = modulos[index - 1]
                  const aulasAnterior = moduloAnterior.aulas || []
                  const aulasAnteriorConcluidas = aulasAnterior.length > 0 && aulasAnterior.every((aula: any) => 
                    data.completedLessons.includes(aula.id)
                  )
                  
                  const quizAnteriorPassou = data.passedQuizzes.includes(moduloAnterior.id)

                  if (!aulasAnteriorConcluidas || !quizAnteriorPassou) {
                    isLocked = true
                  }
                }

                return (
                  <ModuleCard
                    key={modulo.id}
                    module={modulo}
                    trainingId={trainingId}
                    completedLessons={data.completedLessons}
                    passedQuizzes={data.passedQuizzes}
                    isAdmin={isAdmin}
                    isLocked={isLocked}
                  />
                )
              })}
            </div>
          </section>

          <section>
            <FinalExamCard
              trainingId={trainingId}
              unlocked={isAdmin || isEligible}
              passed={data.passedFinalExam}
              isAdmin={isAdmin}
            />
          </section>
        </div>

        <aside className="relative">
          <div className="sticky top-24">
            <ProgressCard
              lessons={{
                total: totalLessons,
                completed: data.completedLessons.length,
              }}
              quizzes={{
                total: totalModules,
                completed: data.passedQuizzes.length,
              }}
              isEligible={isAdmin || isEligible}
              isAdmin={isAdmin}
              hasCertificate={data.passedFinalExam}
              userData={{ id: user?.id || "", name: user?.nome || "Colaborador" }}
              trainingData={{
                id: data.training.id,
                titulo: data.training.titulo,
                carga_horaria: data.training.carga_horaria,
              }}
            />
          </div>
        </aside>
      </main>
    </div>
  )
}