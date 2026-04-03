"use client"

import {
  Folder,
  FileText,
  Plus,
  HelpCircle,
  Zap,
  Loader2,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBuilderSidebar } from "@/hooks/trainings/use-builder-sidebar" // Ajuste o path conforme sua pasta

interface BuilderSidebarProps {
  structure: any[]
  activeEditor: { type: string; data?: any }
  setEditor: (config: any) => void
  trainingId: string
}

export function BuilderSidebar({
  structure,
  activeEditor,
  setEditor,
  trainingId,
}: BuilderSidebarProps) {
  
  // Utilizando a lógica do seu hook customizado
  const { 
    isSeeding, 
    isFinalizing, 
    handleFinalize, 
    handleMagicSeed, 
    handleExit 
  } = useBuilderSidebar({ structure, trainingId: Number(trainingId) })

  return (
    <aside className="flex h-screen sm:h-[70vh] flex-col overflow-hidden border-r bg-background lg:w-80">
      {/* HEADER: Ações de Criação */}
      <div className="shrink-0 space-y-2 border-b p-4">
        <Button
          className="w-full gap-2 font-bold"
          onClick={() => setEditor({ type: "new-module" })}
        >
          <Plus size={18} /> Novo Módulo
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isSeeding}
          onClick={handleMagicSeed}
          className="w-full gap-2 border-orange-100 text-[10px] font-bold tracking-widest text-orange-600 uppercase hover:bg-orange-50"
        >
          {isSeeding ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <Zap size={14} />
          )}
          Povoar Teste
        </Button>
      </div>

      {/* CONTEÚDO: Árvore de Módulos e Aulas */}
      <div className="space-y-4 p-4 overflow-auto">
        {structure.map((module) => (
          <div key={module.id} className="space-y-1">
            <button
              onClick={() => setEditor({ type: "edit-module", data: module })}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-sm font-bold transition-all",
                activeEditor.type === "edit-module" &&
                  activeEditor.data?.id === module.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-transparent text-foreground/80 hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <Folder size={16} /> {module.titulo}
              </div>
            </button>

            <div className="ml-4 space-y-1 overflow-y-auto border-l-2 border-muted/50 pl-3">
              {/* Ajustado de 'lessons' para 'aulas' para bater com seu novo service */}
              {module.aulas?.map((lesson: any) => (
                <button
                  key={lesson.id}
                  onClick={() =>
                    setEditor({ type: "edit-lesson", data: lesson })
                  }
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md p-2 text-left text-xs transition-colors",
                    activeEditor.data?.id === lesson.id
                      ? "bg-accent font-bold text-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <FileText size={14} /> {lesson.titulo}
                </button>
              ))}

              <div className="flex flex-col gap-1 pt-2">
                <button
                  onClick={() =>
                    setEditor({ type: "new-lesson", moduleId: module.id })
                  }
                  className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase hover:underline"
                >
                  <Plus size={12} /> Nova Aula
                </button>
                <button
                  onClick={() =>
                    setEditor({
                      type: "quiz",
                      moduleId: module.id,
                      moduleTitle: module.titulo,
                    })
                  }
                  className="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase hover:underline"
                >
                  <HelpCircle size={12} /> Quiz
                </button>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditor({ type: "exam", trainingId })}
          className={cn(
            "mt-2 w-full justify-start gap-2 text-[11px] font-bold tracking-wider uppercase",
            activeEditor.type === "exam"
              ? "bg-orange-50 text-orange-700"
              : "text-muted-foreground"
          )}
        >
          <GraduationCap size={16} /> Prova Final
        </Button>
      </div>

      {/* FOOTER: Botões de Saída/Finalização */}
      <div className="shrink-0 border-t bg-background p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold"
            onClick={handleExit}
          >
            Sair
          </Button>
          <Button
            size="sm"
            disabled={isFinalizing}
            className="bg-green-600 text-xs font-bold uppercase hover:bg-green-700"
            onClick={handleFinalize}
          >
            {isFinalizing ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              "Finalizar"
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}