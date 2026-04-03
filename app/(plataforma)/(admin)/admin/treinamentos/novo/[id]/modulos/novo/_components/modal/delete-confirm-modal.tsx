"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"

interface DeleteConfirmModalProps {
  title: string
  onConfirm: () => void
  isLoading?: boolean // Nova prop para o estado de loading
}

export function DeleteConfirmModal({
  title,
  onConfirm,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className=" gap-2 border-2 border-destructive/20 font-black uppercase text-[10px] tracking-widest text-destructive hover:bg-destructive/10 transition-all"
        >
          <Trash2 size={14} /> 
          <span className="hidden sm:inline">Excluir</span>
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-destructive mb-2">
            <div className="bg-destructive/10 p-2 rounded-xl">
               <AlertTriangle size={24} />
            </div>
            <AlertDialogTitle className="text-xl font-black uppercase italic tracking-tighter">
              Atenção Total
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm font-medium leading-relaxed">
            Você está prestes a remover o treinamento: <br />
            <strong className="text-foreground text-base italic">"{title}"</strong>.
            <br /><br />
            Esta ação é **irreversível** e removerá todos os dados vinculados a este registro.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel 
            type="button" 
            className="rounded-xl font-black uppercase text-[10px] tracking-widest h-12"
            disabled={isLoading}
          >
            Manter Treinamento
          </AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-white rounded-xl font-black uppercase text-[10px] tracking-widest h-12 px-8 shadow-lg shadow-destructive/20"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span>Excluindo...</span>
              </div>
            ) : (
              "Confirmar Exclusão"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}