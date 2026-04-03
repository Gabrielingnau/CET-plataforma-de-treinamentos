"use client"

import React, { useContext } from "react"
import { Loader2, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react"
import { AuthContext } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { useExamEngine } from "@/hooks/curso/use-exam-engine"

export default function ExecutarProvaPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useContext(AuthContext)
  const isAdmin = user?.role === "admin"
  const resolvedParams = React.use(params)
  const trainingId = Number(resolvedParams.id)

  const {
    questions,
    currentQuestion,
    currentStep,
    progress,
    answers,
    isLoading,
    isSubmitting,
    isLastStep,
    canGoNext,
    handleSelectOption,
    handleNext,
    handlePrevious,
  } = useExamEngine({ userId: user?.id, trainingId })

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2 className="animate-spin text-orange-600" size={40} />
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* PROGRESSO FIXO NO TOPO */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-muted">
        <div 
          className={cn(
            "h-full transition-all duration-700 ease-out",
            isAdmin ? "bg-orange-500" : "bg-orange-600"
          )} 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <header className="sticky top-0 z-40 flex h-24 items-center justify-between border-b bg-background/80 px-8 backdrop-blur-xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-[0.2em] text-orange-600 uppercase">
            {isAdmin ? "MODO PREVIEW ADMIN" : "Questão"}
          </span>
          <h2 className="text-2xl font-black italic leading-none">
            {currentStep + 1} <span className="text-sm text-muted-foreground not-italic">/</span> {questions.length}
          </h2>
        </div>
        
        {isAdmin && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/20">
            <ShieldCheck size={20} />
          </div>
        )}
      </header>

      {/* Padding inferior aumentado (pb-32) para não sobrepor o footer fixo */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 pt-12 pb-40">
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            {isAdmin && (
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest italic">Simulação de Exame Final</p>
            )}
            <h1 className="text-3xl leading-[0.95] font-black tracking-tighter uppercase italic lg:text-4xl">
              {currentQuestion?.pergunta}
            </h1>
          </div>

          <div className="grid gap-3">
            {currentQuestion?.opcoes.map((opcao: string, index: number) => {
              const isSelected = answers[currentStep] === opcao
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(opcao)}
                  className={cn(
                    "flex w-full items-center gap-5 rounded-[28px] border-2 p-6 text-left transition-all active:scale-[0.98]",
                    isSelected 
                      ? "border-orange-600 bg-orange-600 text-white shadow-xl shadow-orange-600/20" 
                      : "border-border bg-card hover:border-orange-600/30"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 shrink-0 rounded-xl border-2 flex items-center justify-center font-black text-sm",
                    isSelected ? "border-white bg-white text-orange-600" : "border-border bg-muted text-muted-foreground"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={cn("font-bold text-lg", isSelected ? "text-white" : "text-foreground/80")}>
                    {opcao}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* FOOTER FIXO (Igual ao do Quiz) */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/90 p-6 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
          <button
            disabled={currentStep === 0 || isSubmitting}
            onClick={handlePrevious}
            className="flex items-center gap-2 px-6 py-4 text-[10px] font-black tracking-widest uppercase text-muted-foreground hover:text-foreground disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={16} strokeWidth={3} /> Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext || isSubmitting}
            className={cn(
              "flex flex-1 md:flex-none items-center justify-center gap-3 rounded-[24px] px-12 py-5 text-[10px] font-black tracking-widest uppercase transition-all shadow-xl active:scale-95",
              canGoNext ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-muted text-muted-foreground opacity-50"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Processando</span>
            ) : (
              <>
                {isLastStep ? (isAdmin ? "Finalizar Preview" : "Finalizar Prova") : "Próxima Pergunta"}
                <ChevronRight size={16} strokeWidth={3} />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}