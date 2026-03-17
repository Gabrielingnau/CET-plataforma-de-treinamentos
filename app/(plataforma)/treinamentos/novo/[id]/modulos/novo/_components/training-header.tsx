// _components/training-header.tsx
import { EditTrainingModal } from "./modal/edit-training-modal"
import { DeleteConfirmModal } from "./modal/delete-confirm-modal"
import { Button } from "@/components/ui/button"
import { FileQuestion, Clock, Target } from "lucide-react"

export function TrainingHeader({ training, setEditor }: any) {
  return (
    <header className="z-20 w-full border-b bg-card p-4 shadow-sm">
      <div className="mx-auto flex max-w-[1800px] flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-4">
          <img
            src={training.cover_url}
            className="h-14 w-20 rounded border object-cover"
          />
          <div>
            <h1 className="max-w-[300px] truncate text-xl font-bold">
              {training.titulo}
            </h1>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {training.carga_horaria}
              </span>
              <span className="flex items-center gap-1">
                <Target size={12} /> Min. {training.pontuacao_aprovacao}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 border-orange-500 text-orange-600 hover:bg-orange-50"
            onClick={() => setEditor({ type: "exam", trainingId: training.id })}
          >
            <FileQuestion size={16} /> Prova Final
          </Button>
          <EditTrainingModal training={training} />
          <DeleteConfirmModal title={training.titulo} onConfirm={() => {}} />
        </div>
      </div>
    </header>
  )
}
