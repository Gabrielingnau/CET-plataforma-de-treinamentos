"use client"

import { Trash2, AlertTriangle, Loader2, Copy } from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDeleteTraining } from "@/hooks/trainings/use-delete-training";

interface DeleteTrainingModalProps {
  trainingId: number | string; 
  trainingTitle: string;
}

export function DeleteTrainingModal({ trainingId, trainingTitle }: DeleteTrainingModalProps) {
  const {
    open,
    setOpen,
    confirmText,
    setConfirmText,
    mutation,
    canDelete,
    handleCopy
  } = useDeleteTraining(trainingId, trainingTitle);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg"
        >
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-border max-w-md rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3 text-destructive mb-1">
            <AlertTriangle size={20} />
            <DialogTitle className="text-lg font-bold">Excluir Treinamento</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            Esta ação é permanente. Você perderá todos os dados de 
            <span className="text-foreground font-semibold px-1">"{trainingTitle}"</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 border border-border p-3 rounded-xl flex items-center justify-between gap-3">
             <code className="text-[11px] font-mono text-muted-foreground truncate italic">
                {trainingTitle}
             </code>
             <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={handleCopy}
                className="h-7 w-7 text-muted-foreground shrink-0"
              >
                <Copy size={12} />
              </Button>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-medium text-muted-foreground ml-1">
              Confirme digitando o nome do curso:
            </p>
            <Input 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Nome do treinamento..."
              className="bg-background border-border h-10 rounded-xl focus-visible:ring-destructive"
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
            className="flex-1 rounded-xl text-xs font-semibold h-10"
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}