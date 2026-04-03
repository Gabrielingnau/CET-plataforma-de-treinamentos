"use client"

import React from "react"
import { Loader2, Users, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CpfInput } from "../../inputs/cpfInput" 
import { useCreateCollaborator } from "@/hooks/companies/use-create-collaborator"

export function CollaboratorCreate({ empresaId }: { empresaId: string }) {
  const { 
    form, 
    isAdding, 
    toggleAdding, 
    isLoading, 
    create 
  } = useCreateCollaborator(empresaId)

  const { register, handleSubmit, setValue, formState: { errors } } = form

  return (
    <div className="space-y-4">
      {/* HEADER CARD */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-border bg-card/30 gap-4 shadow-sm">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-3 bg-orange-600/10 rounded-2xl shrink-0 transition-colors">
            <Users className="text-orange-600" size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-black uppercase tracking-tight italic leading-none truncate">
              Gestão de Equipe
            </h3>
            <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
              {isAdding ? "Preencha os dados abaixo" : "Adicione novos colaboradores"}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={toggleAdding} 
          variant={isAdding ? "secondary" : "default"}
          className="h-11 w-full sm:w-auto px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-md"
        >
          {isAdding ? (
            <span className="flex items-center gap-2"><X size={14} /> Cancelar</span>
          ) : (
            <span className="flex items-center gap-2"><UserPlus size={14} /> Novo Acesso</span>
          )}
        </Button>
      </div>

      {/* FORMULÁRIO DE CRIAÇÃO */}
      {isAdding && (
        <form 
          onSubmit={handleSubmit((data) => create(data))} 
          className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8 border border-border rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl bg-background animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <div className="space-y-2 md:col-span-5">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
              Nome do Colaborador
            </Label>
            <Input 
              {...register("nome")}
              placeholder="Ex: João Silva"
              className="h-12 rounded-xl border-border focus-visible:ring-orange-600/20"
            />
            {errors.nome && (
              <p className="text-[9px] text-destructive font-black uppercase italic ml-1 animate-pulse">
                {errors.nome?.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-4">
             <CpfInput 
                register={register}
                setValue={setValue}
                name="cpf" 
                label="CPF (LOGIN E SENHA)"
                error={errors.cpf}
              />
          </div>
          
          <div className="flex items-end md:col-span-3">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-12 w-full rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl bg-orange-600 hover:bg-orange-500 text-white transition-all active:scale-95 shadow-orange-600/20"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={16} />
                  CRIAR CREDENCIAIS
                </span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}