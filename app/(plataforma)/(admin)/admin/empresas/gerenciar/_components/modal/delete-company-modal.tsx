"use client"

import * as React from "react"
import { Trash2, AlertTriangle, Loader2, Copy, X } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDeleteCompany } from "@/hooks/companies/use-delete-company"
import { cn } from "@/lib/utils"

interface DeleteProps {
  empresaId: string
  empresaNome: string
  // Removi QtdGestores daqui, a menos que você queira passar apenas para exibição visual
}

export function DeleteCompanyModal({ empresaId, empresaNome }: DeleteProps) {
  // O hook useDeleteCompany agora deve receber apenas o empresaId
  const {
    open,
    setOpen,
    confirmText,
    setConfirmText,
    mutation,
    canDelete,
    handleCopy
  } = useDeleteCompany(empresaId, empresaNome)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-[10px] font-black tracking-widest uppercase transition-colors outline-none hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Excluir Parceria
        </button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-md rounded-[1.5rem] p-6 md:rounded-[2.5rem] md:p-8 shadow-2xl overflow-hidden border-none">
        
        <div className="absolute right-4 top-4 md:hidden">
            <DialogClose className="rounded-full hover:bg-accent p-2 text-muted-foreground transition-colors">
                <X size={16} />
            </DialogClose>
        </div>

        <DialogHeader className="space-y-4 text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-destructive">
            <div className="h-12 w-12 bg-destructive/10 rounded-2xl flex items-center justify-center shadow-lg shadow-destructive/5 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <DialogTitle className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-foreground">
                Encerrar <span className="text-destructive">Parceria</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                Ação irreversível detectada
              </DialogDescription>
            </div>
          </div>
          
          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
            Ao confirmar, a instituição <span className="text-foreground font-bold italic underline decoration-destructive/30 underline-offset-4">"{empresaNome}"</span>, todos os seus usuários (gestores e colaboradores), certificados e progressos vinculados serão removidos permanentemente.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <div className="bg-muted/30 border border-border p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-between gap-3 group transition-colors">
             <code className="text-[9px] md:text-[10px] font-black text-muted-foreground truncate italic uppercase tracking-widest">
                {empresaNome}
             </code>
             <Button 
                type="button" 
                variant="secondary" 
                size="icon" 
                onClick={handleCopy}
                className="h-8 w-8 shrink-0 rounded-lg md:rounded-xl"
              >
                <Copy size={14} />
              </Button>
          </div>

          <div className="space-y-3">
            <Label className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
              Confirme digitando o nome da empresa:
            </Label>
            <Input 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite exatamente o nome..."
              className={cn(
                "h-12 rounded-xl font-bold text-sm transition-all focus-visible:ring-destructive/20 focus-visible:border-destructive/50",
                confirmText === empresaNome && "border-green-500/50 focus-visible:border-green-500/50 focus-visible:ring-green-500/10"
              )}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-stretch">
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)} 
            className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest sm:flex-1"
          >
            Abortar
          </Button>
          <Button 
            variant="destructive" 
            disabled={!canDelete || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-destructive/10 active:scale-95 transition-all sm:flex-1"
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : "Confirmar Exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={cn("block", className)}>{children}</label>
}