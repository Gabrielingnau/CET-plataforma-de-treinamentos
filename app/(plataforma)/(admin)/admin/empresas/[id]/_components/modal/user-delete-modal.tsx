"use client"

import React, { useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDeleteUser } from "@/hooks/companies/use-delete-user"

interface UserDeleteModalProps {
  user: {
    id: string
    nome: string
    role?: string
  }
  empresaId: number
}

export function UserDeleteModal({ user: userData, empresaId }: UserDeleteModalProps) {
  const { isGestor, isLoading, confirmDelete } = useDeleteUser({
    userId: userData.id,
    empresaId,
    role: userData.role
  })

  // Memoização do tema: performance garantida em listas grandes
  const theme = useMemo(() => ({
    trigger: isGestor
      ? "text-sky-500 hover:border-sky-500/50 hover:bg-sky-500/5"
      : "text-primary hover:border-primary/50 hover:bg-primary/5",
    borderTop: isGestor ? "border-t-sky-600" : "border-t-primary",
    iconContainer: isGestor
      ? "bg-sky-500/10 border-sky-500/20 text-sky-500"
      : "bg-primary/10 border-primary/20 text-primary",
    highlight: isGestor ? "text-sky-500" : "text-primary",
    button: isGestor
      ? "bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20"
      : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20",
  }), [isGestor])

  const displayName = useMemo(() => userData.nome?.split(" ")[0] || "Usuário", [userData.nome])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "group rounded-xl border bg-background p-2.5 shadow-sm transition-all active:scale-95",
            theme.trigger
          )}
        >
          <Trash2 size={16} className="transition-transform group-hover:rotate-12" />
        </button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "w-[95vw] max-w-sm rounded-[2rem] border-t-4 bg-background p-6 shadow-2xl md:rounded-[2.5rem] md:p-10",
          theme.borderTop
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-lg md:h-20 md:w-20 md:rounded-3xl",
              theme.iconContainer
            )}
          >
            <AlertTriangle size={32} className="animate-pulse md:h-10 md:w-10" />
          </div>

          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic md:text-3xl">
              Remover <span className={theme.highlight}>{displayName}</span>?
            </DialogTitle>
            <p className="text-[9px] font-black tracking-[0.25em] text-muted-foreground/60 uppercase">
              Confirma a exclusão deste {isGestor ? "gestor" : "colaborador"}?
            </p>
          </DialogHeader>

          <div className="mt-10 flex w-full flex-col-reverse gap-3 sm:flex-row">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl text-[10px] font-black tracking-widest uppercase sm:flex-1"
              >
                Manter
              </Button>
            </DialogClose>

            <Button
              disabled={isLoading}
              onClick={() => confirmDelete()}
              className={cn(
                "h-12 w-full rounded-xl text-[10px] font-black tracking-widest uppercase shadow-xl transition-all sm:flex-1",
                theme.button
              )}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Excluir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}