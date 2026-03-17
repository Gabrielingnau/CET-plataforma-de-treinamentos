// app/(plataforma)/treinamentos/novo/[id]/modulos/novo/_components/course-builder-client.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { TrainingHeader } from "./training-header";
import { BuilderSidebar } from "./builder-sidebar";
import { ModuleForm } from "./module-form";
import { LessonForm } from "./lesson-form";
import { QuestionManager } from "./question-manager";

export type EditorState = 
  | { type: "idle" }
  | { type: "new-module" }
  | { type: "edit-module"; data: any }
  | { type: "new-lesson"; moduleId: number }
  | { type: "edit-lesson"; data: any }
  | { type: "quiz"; moduleId: number; moduleTitle: string }
  | { type: "exam"; trainingId: number };

export default function CourseBuilderClient({ training, initialStructure }: any) {
  const [editor, setEditor] = useState<EditorState>({ type: "idle" });

  // Sincronização automática da estrutura via React Query
  const { data: structure } = useQuery({
    queryKey: ["training-structure", training.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("training_id", training.id)
        .order("ordem", { ascending: true });
      
      if (error) throw error;
      
      // Ordenar aulas dentro de cada módulo
      return data.map(mod => ({
        ...mod,
        lessons: mod.lessons?.sort((a: any, b: any) => a.ordem - b.ordem) || []
      }));
    },
    initialData: initialStructure,
  });

  if (!training?.id) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <TrainingHeader training={training} setEditor={setEditor} />
      
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <BuilderSidebar 
          structure={structure} 
          activeEditor={editor} 
          setEditor={setEditor} 
          trainingId={training.id}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-muted/5">
          <div className="max-w-4xl mx-auto bg-card p-6 rounded-xl border shadow-sm">
            {editor.type === "idle" && (
              <div className="text-center py-20 text-muted-foreground">
                <p>Selecione um item na lateral para editar ou comece um novo módulo.</p>
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
                moduleId={editor.type === "new-lesson" ? editor.moduleId : editor.data.module_id}
                trainingId={training.id}
                defaultValues={editor.type === "edit-lesson" ? editor.data : null}
                onCancel={() => setEditor({ type: "idle" })}
                nextOrdem={(structure.find((m: any) => m.id === (editor.type === "new-lesson" ? editor.moduleId : editor.data.module_id))?.lessons?.length || 0) + 1}
              />
            )}

            {editor.type === "quiz" && (
              <QuestionManager ownerId={editor.moduleId} type="quiz" title={editor.moduleTitle} />
            )}

            {editor.type === "exam" && (
              <QuestionManager ownerId={training.id} type="exam" title="Prova Final" />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}