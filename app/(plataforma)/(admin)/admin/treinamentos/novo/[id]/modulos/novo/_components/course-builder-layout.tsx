"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { LessonForm } from "./forms/lesson-form"
import { ModuleForm } from "./forms/module-form"
import { BuilderSidebar } from "./builder-sidebar"
import { QuestionManager } from "./question-manager"
import { TrainingHeader } from "./training-header"
import { useCourseBuilder } from "@/hooks/trainings/use-course-builder"

export default function CourseBuilderClient() {
  const {
    training,
    structure,
    isLoading,
    editor,
    setEditor,
    handleSetEditor,
    isSidebarOpen,
    setIsSidebarOpen,
    trainingId
  } = useCourseBuilder()

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Sincronizando estrutura...
          </p>
        </div>
      </div>
    )
  }

  if (!training) return null

  return (
    <div className="flex flex-col overflow-hidden">
      <TrainingHeader training={training} setEditor={handleSetEditor} />

      {/* BOTÃO MOBILE PARA ABRIR SIDEBAR */}
      <div className="flex items-center justify-between border-b bg-muted/20 p-4 lg:hidden overflow-hidden">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetHeader>
              <SheetTitle>Menu de Estrutura</SheetTitle>
              <SheetDescription>
                Navegue pelos módulos e aulas.
              </SheetDescription>
            </SheetHeader>

          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <BuilderSidebar
              structure={structure}
              activeEditor={editor}
              setEditor={handleSetEditor}
              trainingId={String(trainingId)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* SIDEBAR DESKTOP */}
        <div className="hidden border-r lg:block lg:w-80">
          <BuilderSidebar
            structure={structure}
            activeEditor={editor}
            setEditor={handleSetEditor}
            trainingId={String(trainingId)}
          />
        </div>

        {/* ÁREA DO FORMULÁRIO (MAIN) */}
        <main className="flex-1 overflow-y-auto h-screen sm:h-[70vh] bg-muted/5 pt-4 pb-10 lg:p-5 lg:pt-4">
          {editor.type === "idle" && (
            <div className="py-12 text-center text-muted-foreground lg:py-20">
              <p className="text-xs font-medium tracking-widest uppercase opacity-50">
                {isSidebarOpen
                  ? "Escolha um item"
                  : "Selecione um item para editar"}
              </p>
            </div>
          )}

          {(editor.type === "new-module" || editor.type === "edit-module") && (
            <ModuleForm
              trainingId={training.id}
              defaultValues={editor.type === "edit-module" ? editor.data : null}
              onCancel={() => setEditor({ type: "idle" })}
              nextOrdem={structure.length + 1}
            />
          )}

          {(editor.type === "new-lesson" || editor.type === "edit-lesson") && (
            <LessonForm
              moduleId={
                editor.type === "new-lesson"
                  ? editor.moduleId
                  : editor.data.module_id
              }
              trainingId={training.id}
              defaultValues={editor.type === "edit-lesson" ? editor.data : null}
              onCancel={() => setEditor({ type: "idle" })}
              nextOrdem={1}
            />
          )}

          {editor.type === "quiz" && (
            <QuestionManager
              ownerId={editor.moduleId}
              type="quiz"
              title={editor.moduleTitle}
            />
          )}

          {editor.type === "exam" && (
            <QuestionManager
              ownerId={training.id}
              type="exam"
              title="Prova Final"
            />
          )}
        </main>
      </div>
    </div>
  )
}