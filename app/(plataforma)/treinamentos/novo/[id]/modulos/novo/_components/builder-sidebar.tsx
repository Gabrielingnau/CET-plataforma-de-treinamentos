// _components/builder-sidebar.tsx
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, FileText, Plus, HelpCircle, CheckCircle2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export function BuilderSidebar({ structure, activeEditor, setEditor, trainingId }: any) {
  const router = useRouter();

  const handleFinalize = async () => {
    const { data: questions } = await supabase
      .from("exam_questions")
      .select("id")
      .eq("training_id", trainingId);

    if (!questions || questions.length === 0) {
      toast.error("Prova Final Obrigatória", {
        description: "Crie ao menos uma pergunta na Prova Final antes de finalizar."
      });
      setEditor({ type: "exam", trainingId });
      return;
    }

    toast.success("Treinamento publicado!");
    router.push("/treinamentos/visualizar");
  };

  return (
    <aside className="w-full lg:w-80 border-r bg-background flex flex-col h-full shrink-0">
      <div className="p-4 border-b">
        <Button className="w-full gap-2 font-bold" onClick={() => setEditor({ type: "new-module" })}>
          <Plus size={18} /> Novo Módulo
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {structure.map((module: any) => (
            <div key={module.id} className="space-y-1">
              <div 
                onClick={() => setEditor({ type: "edit-module", data: module })}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer text-sm font-bold border transition-all ${
                  activeEditor.type === "edit-module" && activeEditor.data?.id === module.id 
                  ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate"><Folder size={16} /> {module.titulo}</div>
              </div>

              <div className="ml-4 pl-3 border-l-2 space-y-1">
                {module.lessons?.map((lesson: any) => (
                  <button 
                    key={lesson.id}
                    onClick={() => setEditor({ type: "edit-lesson", data: lesson })}
                    className={`w-full text-left p-2 text-xs rounded-md flex items-center gap-2 transition-colors ${
                      activeEditor.data?.id === lesson.id ? "bg-accent text-foreground font-bold" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <FileText size={14} /> {lesson.titulo}
                  </button>
                ))}
                
                <div className="flex flex-col gap-1 pt-2">
                  <button onClick={() => setEditor({ type: "new-lesson", moduleId: module.id })} className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase hover:underline">
                    <Plus size={12}/> Nova Aula
                  </button>
                  <button onClick={() => setEditor({ type: "quiz", moduleId: module.id, moduleTitle: module.titulo })} className="text-[10px] font-bold text-orange-500 flex items-center gap-1 uppercase hover:underline">
                    <HelpCircle size={12}/> Configurar Quiz
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/20 space-y-2">
        <Button variant="outline" className="w-full gap-2" onClick={() => router.push("/treinamentos/visualizar")}>
          <LogOut size={16}/> Sair
        </Button>
        <Button className="w-full bg-green-600 hover:bg-green-700 gap-2 font-bold" onClick={handleFinalize}>
          <CheckCircle2 size={16}/> Finalizar
        </Button>
      </div>
    </aside>
  );
}