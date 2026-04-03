"use client"

import Image from "next/image"
import { FileQuestion, Clock, Target } from "lucide-react"

import { EditTrainingModal } from "./modal/edit-training-modal"
import { DeleteConfirmModal } from "./modal/delete-confirm-modal"
import { Button } from "@/components/ui/button"
import { FullTrainingStructure } from "@/types/database/trainings"
import { useTrainingHeader } from "@/hooks/trainings/use-training-header"

interface TrainingHeaderProps {
  training: FullTrainingStructure
  setEditor: (config: { type: string; trainingId: number | string }) => void
}

export function TrainingHeader({ training, setEditor }: TrainingHeaderProps) {
  const { isDeleting, handleDelete } = useTrainingHeader(training)

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-card/80 backdrop-blur-md p-4">
      <div className="mx-auto flex max-w-450 flex-col items-center justify-between gap-4 md:flex-row">
        
        {/* INFO DO CURSO */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-muted shadow-sm">
            <Image
              src={training.cover_url || "/placeholder-course.png"}
              alt={training.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black uppercase italic tracking-tighter md:text-xl">
              {training.titulo}
            </h1>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-primary" /> {training.carga_horaria}h
              </span>
              <span className="flex items-center gap-1">
                <Target size={12} className="text-primary" /> {training.pontuacao_aprovacao}% Min.
              </span>
            </div>
          </div>
        </div>

        {/* AÇÕES */}
        <div className="flex w-full items-center justify-end gap-2 md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-2 border-orange-500/20 font-black uppercase text-[10px] tracking-widest text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            onClick={() => setEditor({ type: "exam", trainingId: training.id })}
          >
            <FileQuestion size={14} /> 
            <span className="hidden sm:inline">Prova Final</span>
          </Button>
          
          <EditTrainingModal training={training} />
          
          <DeleteConfirmModal 
            title={training.titulo} 
            onConfirm={handleDelete}
            isLoading={isDeleting}
          />
        </div>
      </div>
    </header>
  )
}