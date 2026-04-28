"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useDeleteTraining } from "@/hooks/trainings/use-delete-training"
import { AlertTriangle, Copy, Loader2, Trash2 } from "lucide-react"

interface DeleteTrainingModalProps {
  trainingId: number | string
  trainingTitle: string
}

export function DeleteTrainingModal({
  trainingId,
  trainingTitle,
}: DeleteTrainingModalProps) {
  const {
    open,
    setOpen,
    confirmText,
    setConfirmText,
    mutation,
    canDelete,
    handleCopy,
  } = useDeleteTraining(trainingId, trainingTitle)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-border max-w-md rounded-3xl">
        <DialogHeader>
          <div className="text-destructive mb-1 flex items-center gap-3">
            <AlertTriangle size={20} />
            <DialogTitle className="text-lg font-bold">
              Excluir Treinamento
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            Esta ação é permanente. Você perderá todos os dados de
            <span className="text-foreground px-1 font-semibold">
              &quot;{trainingTitle}&quot;
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 border-border flex items-center justify-between gap-3 rounded-xl border p-3">
            <code className="text-muted-foreground truncate font-mono text-[11px] italic">
              {trainingTitle}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="text-muted-foreground h-7 w-7 shrink-0"
            >
              <Copy size={12} />
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground ml-1 text-[11px] font-medium">
              Confirme digitando o nome do Treinamento:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Nome do treinamento..."
              className="bg-background border-border focus-visible:ring-destructive h-10 rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl text-xs font-semibold"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={!canDelete || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="h-10 flex-1 rounded-xl text-xs font-semibold"
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 animate-spin" size={16} />
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
