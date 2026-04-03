"use client"

import React, { useContext } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, HelpCircle, ChevronRight, Check, Loader2, ShieldCheck } from "lucide-react"
import { AuthContext } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { useQuiz } from "@/hooks/curso/use-quiz"
import { QuizResult } from "./_components/quiz-result"

export default function QuizPage({ params }: { params: Promise<{ id: string; moduleId: string }> }) {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const resolvedParams = React.use(params)
  
  const trainingId = Number(resolvedParams.id)
  const moduleId = Number(resolvedParams.moduleId)

  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    isFinished,
    isLastQuestion,
    hasSelectedOption,
    progress,
    mutationData,
    isSubmitting,
    handleNext,
    handleSelectOption,
    resetQuiz,
    answers,
    isAdmin
  } = useQuiz({ userId: user?.id, trainingId, moduleId })

  if (isLoading) return <LoadingScreen />

  if (isFinished) {
    return (
      <QuizResult 
        data={mutationData} 
        trainingId={trainingId} 
        onRetry={resetQuiz}
        isAdmin={isAdmin} // Repassamos para o resultado se quiser tratar lá também
      />
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-xl">
        <button onClick={() => router.back()} className="p-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col items-center">
          <span className="mb-1 text-[10px] font-black tracking-[0.2em] text-orange-600 uppercase">
            {isAdmin ? "MODO ADMIN" : `Progresso ${currentQuestionIndex + 1}/${questions?.length}`}
          </span>
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
            <div 
              className={cn(
                "h-full transition-all duration-500",
                isAdmin ? "bg-orange-500" : "bg-orange-600"
              )} 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-2xl border transition-all",
          isAdmin ? "border-orange-500 bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "border-orange-600/20 bg-orange-600/10 text-orange-600"
        )}>
          {isAdmin ? <ShieldCheck size={18} /> : <HelpCircle size={18} />}
        </div>
      </header>

      {/* QUESTÃO */}
      <main className="flex-1 px-6 pt-10 pb-40">
        <div className="mx-auto max-w-2xl space-y-10">
          <div className="space-y-4 text-center">
            {isAdmin && (
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Visualização em Tempo Real</span>
            )}
            <h1 className="text-2xl leading-[0.9] font-black tracking-tighter uppercase italic md:text-3xl">
              {currentQuestion?.pergunta}
            </h1>
          </div>

          <div className="grid gap-3">
            {currentQuestion?.opcoes?.map((option: string, index: number) => {
              const isSelected = answers[currentQuestion.id] === option
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  className={cn(
                    "group relative flex items-center gap-4 rounded-[24px] border-2 p-5 text-left transition-all active:scale-[0.98]",
                    isSelected ? "border-orange-600 bg-orange-600 shadow-xl shadow-orange-600/20" : "border-border bg-card hover:border-orange-600/30"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 font-black",
                    isSelected ? "border-white bg-white text-orange-600" : "border-border bg-muted text-muted-foreground"
                  )}>
                    {isSelected ? <Check size={20} strokeWidth={4} /> : String.fromCharCode(65 + index)}
                  </div>
                  <span className={cn("text-base font-bold", isSelected ? "text-white" : "text-foreground/80")}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 p-6 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl">
          <button
            disabled={!hasSelectedOption || isSubmitting}
            onClick={handleNext}
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-[24px] py-6 text-[12px] font-black tracking-[0.2em] uppercase transition-all",
              hasSelectedOption ? "bg-orange-600 text-white" : "bg-muted text-muted-foreground opacity-50"
            )}
          >
            {isSubmitting ? "Simulando..." : isLastQuestion ? (isAdmin ? "Finalizar Preview" : "Finalizar Avaliação") : "Próxima Pergunta"}
            {!isSubmitting && <ChevronRight size={18} strokeWidth={3} />}
          </button>
        </div>
      </footer>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-background text-orange-600">
      <Loader2 className="animate-spin" size={40} />
      <span className="text-[10px] font-black tracking-widest uppercase">Preparando Questões...</span>
    </div>
  )
}