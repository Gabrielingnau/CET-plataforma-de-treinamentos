"use client"

import React, { useState, useMemo } from "react"
import { Edit2, Loader2, X, User2, ShieldCheck } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { CpfInput } from "../../../inputs/cpfInput"
import { PhoneInput } from "../../../inputs/phoneInput"
import { useUserEdit } from "@/hooks/companies/use-user-edit"

interface UserEditModalProps {
  userData: any
  empresaId: string | number
}

export function UserEditModal({ userData, empresaId }: UserEditModalProps) {
  const [open, setOpen] = useState(false)
  
  const { form, isGestor, isLoading, update } = useUserEdit({
    userData,
    empresaId,
    isOpen: open,
    onSuccess: () => setOpen(false)
  })

  const { register, handleSubmit, setValue, formState: { errors } } = form

  // Tema dinâmico memoizado
  const theme = useMemo(() => ({
    trigger: isGestor 
      ? "text-sky-500 hover:border-sky-500/50 hover:bg-sky-500/10" 
      : "text-primary hover:border-primary/50 hover:bg-primary/10",
    borderTop: isGestor ? "border-t-sky-600" : "border-t-primary",
    iconContainer: isGestor ? "text-sky-500 bg-sky-500/10" : "text-primary bg-primary/10",
    saveButton: isGestor 
      ? "bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20" 
      : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
  }), [isGestor])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={cn(
          "p-2.5 rounded-xl border bg-background transition-all active:scale-95 shadow-sm outline-none",
          theme.trigger
        )}>
          <Edit2 size={16} />
        </button>
      </DialogTrigger>
      
      <DialogContent className={cn(
        "w-[95vw] max-w-md p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border-t-4 overflow-y-auto max-h-[95vh] animate-in zoom-in-95",
        theme.borderTop
      )}>
        
        <div className="absolute right-6 top-6 md:hidden">
          <DialogClose className="rounded-full bg-muted p-2 text-muted-foreground">
            <X size={18} />
          </DialogClose>
        </div>

        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-black uppercase italic flex items-center gap-4 tracking-tighter text-left">
            <div className={cn("p-3 rounded-2xl shrink-0 shadow-inner", theme.iconContainer)}>
                {isGestor ? <ShieldCheck size={24} /> : <User2 size={24} />}
            </div>
            <div className="flex flex-col">
                <span className="leading-none text-foreground">{isGestor ? "Perfil Gestor" : "Perfil Colaborador"}</span>
                <span className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase not-italic mt-1">Atualizar Credenciais</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form 
          onSubmit={handleSubmit((data) => update(data))} 
          className="space-y-5 mt-8"
        >
          {/* NOME COMPLETO */}
          <div className="space-y-2 text-left">
            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Nome Completo</label>
            <Input 
              {...register("nome")}
              placeholder="Digite o nome completo"
              className={cn(
                "rounded-xl md:rounded-2xl h-12 md:h-14 font-bold text-sm border-border focus-visible:ring-1",
                errors.nome && "border-destructive focus-visible:ring-destructive"
              )} 
            />
            {errors.nome && <p className="text-[9px] text-destructive font-black uppercase italic ml-1 animate-in slide-in-from-left-1">{errors.nome?.message?.toString()}</p>}
          </div>

          <CpfInput register={register} setValue={setValue} name="cpf" label="CPF (Login de Acesso)" error={errors.cpf} />

          {/* CAMPOS EXCLUSIVOS DE GESTOR */}
          {isGestor && (
            <div className="grid grid-cols-1 gap-5 animate-in fade-in slide-in-from-top-2 duration-500 text-left">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">E-mail Corporativo</label>
                <Input 
                  {...register("email")}
                  placeholder="email@empresa.com"
                  className={cn("rounded-xl md:rounded-2xl h-12 md:h-14 font-bold text-sm", errors.email && "border-destructive")} 
                />
                {errors.email && <p className="text-[9px] text-destructive font-black uppercase italic ml-1">{errors.email?.message?.toString()}</p>}
              </div>
              <PhoneInput register={register} setValue={setValue} error={errors.telefone} />
            </div>
          )}

          {/* AÇÕES */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-8">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline"
                className="w-full sm:flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-muted transition-all"
              >
                Cancelar
              </Button>
            </DialogClose>
            
            <Button 
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full sm:flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-xl",
                theme.saveButton
              )}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Atualizar Dados"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}