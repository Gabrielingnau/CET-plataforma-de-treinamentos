"use client"

import { Plus, Edit2, HelpCircle, Loader2, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuestionForm } from "./forms/question-form"
import { DeleteConfirmModal } from "./modal/delete-confirm-modal"
import { cn } from "@/lib/utils"
import { useQuestionManager } from "@/hooks/questions/use-question-manager"

interface QuestionManagerProps {
  ownerId: number
  type: "quiz" | "exam"
  title: string
}

export function QuestionManager({ ownerId, type, title }: QuestionManagerProps) {
  const {
    questions,
    isLoading,
    showForm,
    setShowForm,
    editingQuestion,
    deleteMutation,
    handleEdit,
    handleCloseForm,
    handleSuccess
  } = useQuestionManager({ ownerId, type })

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">Carregando Questões...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-3 rounded-xl hidden sm:block">
            <HelpCircle className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter leading-none">
              {type === "quiz" ? "Quiz do Módulo" : "Avaliação Final"}
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
              {title}
            </p>
          </div>
        </div>
        
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary/10"
          >
            <Plus size={16} /> Adicionar Pergunta
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <QuestionForm
            ownerId={ownerId.toString()}
            type={type}
            defaultValues={editingQuestion}
            onCancel={handleCloseForm}
            onSuccess={handleSuccess}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {questions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 transition-colors hover:bg-muted/30">
              <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/20" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Nenhuma pergunta cadastrada
              </p>
              <Button 
                variant="link" 
                onClick={() => setShowForm(true)}
                className="mt-2 text-xs font-bold uppercase"
              >
                Começar agora
              </Button>
            </div>
          ) : (
            questions?.map((q: any, index: number) => (
              <div
                key={q.id}
                className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary text-[10px] font-black text-primary-foreground shadow-sm">
                        {index + 1}
                      </span>
                      <p className="font-bold text-foreground leading-snug">
                        {q.pergunta}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-[80vw] sm:w-auto">
                      {q.opcoes.map((opt: string, i: number) => {
                        const isCorrect = opt === q.opcao_correta
                        return (
                          <div
                            key={i}
                            className={cn(
                              "flex items-center gap-3 rounded-lg border p-3 text-xs transition-colors",
                              isCorrect 
                                ? "border-green-500/50 bg-green-500/5 font-bold text-green-700" 
                                : "border-muted bg-muted/20 text-muted-foreground"
                            )}
                          >
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              isCorrect ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"
                            )} />
                            {opt}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="ml-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => handleEdit(q)}
                    >
                      <Edit2 size={14} className="text-muted-foreground hover:text-primary" />
                    </Button>
                    <DeleteConfirmModal
                      title="esta pergunta"
                      onConfirm={() => deleteMutation.mutate(q.id)}
                      isLoading={deleteMutation.isPending && deleteMutation.variables === q.id}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}