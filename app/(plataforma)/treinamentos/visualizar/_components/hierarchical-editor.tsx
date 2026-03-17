// app/(plataforma)/treinamentos/visualizar/_components/hierarchical-editor.tsx
"use client";

import { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutGrid, 
  BookOpen, 
  Video, 
  Settings2, 
  Plus, 
  ChevronRight,
  MonitorPlay
} from "lucide-react";

// Importe o modal de exclusão que fizemos anteriormente
import { DeleteTrainingModal } from "./delete-training-modal";

export function HierarchicalEditor({ trainings }: { trainings: any[] }) {
  // Estado para controlar o que está sendo editado no painel central
  const [selected, setSelected] = useState<{
    type: 'training' | 'module' | 'lesson';
    data: any;
  }>({ type: 'training', data: trainings[0] });

  return (
    <div className="flex h-full">
      {/* SIDEBAR DE NAVEGAÇÃO */}
      <aside className="w-80 border-r flex flex-col bg-muted/10">
        <div className="p-4 border-b bg-background flex justify-between items-center">
          <h2 className="font-bold text-sm uppercase tracking-wider">Meus Cursos</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus size={18} />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {trainings.map((training) => (
              <div key={training.id} className="space-y-1">
                {/* Cabeçalho do Treinamento */}
                <div 
                  className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    selected.data?.id === training.id && selected.type === 'training' 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-muted"
                  }`}
                  onClick={() => setSelected({ type: 'training', data: training })}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MonitorPlay size={16} />
                    <span className="text-sm font-medium truncate">{training.titulo}</span>
                  </div>
                  <DeleteTrainingModal trainingId={training.id} trainingTitle={training.titulo} />
                </div>

                {/* Lista de Módulos (Accordion) */}
                <Accordion type="multiple" className="pl-4 border-l ml-3">
                  {training.modulos?.map((modulo: any) => (
                    <AccordionItem value={modulo.id} key={modulo.id} className="border-none">
                      <div className="flex items-center group/mod">
                        <AccordionTrigger className="py-1 hover:no-underline text-xs text-muted-foreground">
                          {modulo.titulo}
                        </AccordionTrigger>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover/mod:opacity-100"
                          onClick={() => setSelected({ type: 'module', data: modulo })}
                        >
                          <Settings2 size={12} />
                        </Button>
                      </div>

                      <AccordionContent className="pt-1 pb-2 space-y-1">
                        {modulo.aulas?.map((aula: any) => (
                          <button
                            key={aula.id}
                            onClick={() => setSelected({ type: 'lesson', data: aula })}
                            className={`w-full text-left py-1.5 px-2 text-[11px] rounded transition-all flex items-center gap-2 ${
                              selected.data?.id === aula.id 
                              ? "bg-primary text-primary-foreground shadow-sm" 
                              : "text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            <Video size={10} />
                            <span className="truncate">{aula.titulo}</span>
                          </button>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* PAINEL DE CONTEÚDO / EDIÇÃO */}
      <main className="flex-1 bg-background overflow-y-auto">
        <div className="p-8 max-w-4xl mx-auto">
          {/* Header Dinâmico */}
          <div className="mb-8 flex justify-between items-end border-b pb-6">
            <div>
              <p className="text-sm text-primary font-medium mb-1 capitalize">
                Editando {selected.type === 'lesson' ? 'Aula' : selected.type === 'module' ? 'Módulo' : 'Treinamento'}
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                {selected.data?.titulo || "Selecione um item"}
              </h1>
            </div>
            
            <div className="flex gap-2">
               <Button variant="outline" size="sm">Visualizar como Aluno</Button>
               <Button size="sm">Salvar Alterações</Button>
            </div>
          </div>

          {/* Renderização Condicional dos Formulários */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            {selected.type === 'training' && (
               <div className="space-y-6">
                 {/* Aqui você chama o formulário que criamos na etapa anterior */}
                 <p className="text-sm text-muted-foreground">Dados base do treinamento: {selected.data.titulo}</p>
                 {/* <TrainingFormValues initialData={selected.data} /> */}
               </div>
            )}

            {selected.type === 'module' && (
              <div className="space-y-6 text-center py-20">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">Configurações do Módulo</h3>
                <p className="text-muted-foreground">Formulário de edição do módulo: {selected.data.titulo}</p>
              </div>
            )}

            {selected.type === 'lesson' && (
              <div className="space-y-6 text-center py-20">
                <Video className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">Configurações da Aula</h3>
                <p className="text-muted-foreground">Formulário de edição da aula: {selected.data.titulo}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}