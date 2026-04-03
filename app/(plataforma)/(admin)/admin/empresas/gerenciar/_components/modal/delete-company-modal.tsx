"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useDeleteCompany } from "@/hooks/companies/use-delete-company"
import { cn } from "@/lib/utils"
import { AlertTriangle, Copy, Loader2, Trash2, X } from "lucide-react"
import * as React from "react"

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
    handleCopy,
  } = useDeleteCompany(empresaId, empresaNome)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hover:bg-destructive/10 hover:text-destructive relative flex w-full cursor-default items-center rounded-sm px-3 py-2 text-[10px] font-black tracking-widest uppercase transition-colors outline-none select-none">
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Excluir Parceria
        </button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-md overflow-hidden rounded-[1.5rem] border-none p-6 shadow-2xl md:rounded-[2.5rem] md:p-8">
        <div className="absolute top-4 right-4 md:hidden">
          <DialogClose className="hover:bg-accent text-muted-foreground rounded-full p-2 transition-colors">
            <X size={16} />
          </DialogClose>
        </div>

        <DialogHeader className="space-y-4 text-left">
          <div className="text-destructive flex flex-col gap-4 md:flex-row md:items-center">
            <div className="bg-destructive/10 shadow-destructive/5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <DialogTitle className="text-foreground text-lg font-black tracking-tighter uppercase italic md:text-xl">
                Encerrar <span className="text-destructive">Parceria</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase md:text-[10px]">
                Ação irreversível detectada
              </DialogDescription>
            </div>
          </div>

          <p className="text-muted-foreground text-xs leading-relaxed md:text-sm">
            Ao confirmar, a instituição{" "}
            <span className="text-foreground decoration-destructive/30 font-bold italic underline underline-offset-4">
              &quot;{empresaNome}&quot;
            </span>
            , todos os seus usuários (gestores e colaboradores), certificados e
            progressos vinculados serão removidos permanentemente.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <div className="bg-muted/30 border-border group flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors md:rounded-2xl md:p-4">
            <code className="text-muted-foreground truncate text-[9px] font-black tracking-widest uppercase italic md:text-[10px]">
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
            <Label className="text-muted-foreground ml-1 text-[9px] font-black tracking-[0.2em] uppercase md:text-[10px]">
              Confirme digitando o nome da empresa:
            </Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite exatamente o nome..."
              className={cn(
                "focus-visible:ring-destructive/20 focus-visible:border-destructive/50 h-12 rounded-xl text-sm font-bold transition-all",
                confirmText === empresaNome &&
                  "border-green-500/50 focus-visible:border-green-500/50 focus-visible:ring-green-500/10",
              )}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-stretch">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="h-12 w-full rounded-xl text-[10px] font-black tracking-widest uppercase sm:flex-1"
          >
            Abortar
          </Button>
          <Button
            variant="destructive"
            disabled={!canDelete || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="shadow-destructive/10 h-12 w-full rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg transition-all active:scale-95 sm:flex-1"
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Confirmar Exclusão"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <label className={cn("block", className)}>{children}</label>
}
