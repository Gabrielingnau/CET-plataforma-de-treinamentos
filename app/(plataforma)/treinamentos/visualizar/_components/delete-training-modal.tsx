// app/(plataforma)/treinamentos/visualizar/_components/delete-training-modal.tsx
"use client"

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DeleteTrainingModal({ trainingId, trainingTitle }: { trainingId: string, trainingTitle: string }) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = confirmText === trainingTitle;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 transition-opacity"
        >
          <Trash2 size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle size={20} />
            <DialogTitle>Atenção Total</DialogTitle>
          </div>
          <DialogDescription>
            Você está prestes a excluir o treinamento <strong>{trainingTitle}</strong>. 
            Esta ação removerá permanentemente todos os módulos e aulas associados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <p className="text-xs text-muted-foreground italic">
            Para confirmar, digite o nome do treinamento exatamente como aparece acima:
          </p>
          <Input 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={trainingTitle}
            className="border-destructive/30 focus-visible:ring-destructive"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setConfirmText("")}>Cancelar</Button>
          <Button 
            variant="destructive" 
            disabled={!canDelete || isDeleting}
            onClick={async () => {
              setIsDeleting(true);
              // Chamar sua mutation de delete aqui
              setIsDeleting(false);
            }}
          >
            {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}