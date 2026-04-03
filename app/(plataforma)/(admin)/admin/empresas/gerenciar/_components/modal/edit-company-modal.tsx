"use client"

import {
  Pencil,
  Building2,
  Loader2,
  Check,
  ShieldCheck,
  Clock,
  Layers,
  X,
  UserPlus2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useEditCompany } from "@/hooks/companies/use-edit-company"
import Link from "next/link"

import { CnpjInput } from "../../../inputs/cnpjInput"
import { CpfInput } from "../../../inputs/cpfInput"
import { PhoneInput } from "../../../inputs/phoneInput"

export function EditCompanyModal({ empresa }: { empresa: any }) {
  const {
    open,
    setOpen,
    activeTab,
    setActiveTab,
    isSaving,
    form,
    gestoresFields,
    acessoTotal,
    selectedTrainings,
    globalTrainings,
    loadingTrainings,
    toggleTraining,
    onSubmit,
  } = useEditCompany(empresa)

  const {
    register,
    setValue,
    formState: { errors },
  } = form

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative flex w-full cursor-default items-center rounded-sm px-3 py-2 text-[10px] font-black tracking-widest uppercase transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground">
          <Pencil className="mr-2 h-3.5 w-3.5 text-primary" />
          Editar Parceria
        </button>
      </DialogTrigger>

      <DialogContent className="flex h-[90vh] w-[98vw] flex-col overflow-hidden rounded-[1.5rem] p-0 shadow-2xl md:h-auto md:w-full md:max-w-5xl md:rounded-[2.5rem] lg:min-w-[1000px] border-none">
        <form onSubmit={onSubmit} className="flex h-full w-full flex-col bg-background">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="flex h-full w-full flex-col"
          >
            
            {/* HEADER */}
            <div className="border-b px-4 pt-6 md:px-10 md:pt-8 bg-muted/20">
              <div className="flex items-center justify-between mb-6">
                <DialogTitle className="flex items-center gap-3 text-lg font-black tracking-tighter uppercase italic md:text-2xl text-foreground">
                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary shadow-lg shadow-primary/5 md:p-2.5">
                    <Building2 size={20} className="md:w-[22px]" />
                  </div>
                  <span className="hidden xs:inline">Gestão da</span>
                  <span className="text-primary underline decoration-primary/20 underline-offset-8">
                    Parceria
                  </span>
                </DialogTitle>
                
                <DialogClose className="rounded-full hover:bg-accent p-2 text-muted-foreground md:hidden transition-colors">
                  <X size={20} />
                </DialogClose>
              </div>

              <div className="no-scrollbar overflow-x-auto">
                <TabsList className="flex h-12 w-full justify-start gap-4 rounded-none bg-transparent p-0 md:gap-8">
                  <TabsTrigger value="dados" className="tab-trigger whitespace-nowrap">
                    Institucional
                  </TabsTrigger>
                  <TabsTrigger value="responsavel" className="tab-trigger whitespace-nowrap">
                    Gestores ({gestoresFields.length})
                  </TabsTrigger>
                  {!acessoTotal && (
                    <TabsTrigger value="treinamentos" className="tab-trigger whitespace-nowrap">
                      Catálogo
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
            </div>

            {/* CONTEÚDO */}
            <div className="custom-scrollbar flex-1 overflow-y-auto p-4 md:max-h-[55vh] md:p-10">
              
              <TabsContent value="dados" className="mt-0 animate-in space-y-6 md:space-y-8 outline-none fade-in">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-10 md:gap-y-6">
                  <div className="space-y-2 text-left">
                    <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase italic">Razão Social</Label>
                    <Input {...register("nome")} className="h-12 font-bold uppercase italic focus-visible:ring-primary/20" />
                    {errors.nome && <span className="text-[9px] font-bold text-destructive uppercase italic">{errors.nome?.message}</span>}
                  </div>
                  <CnpjInput register={register} setValue={setValue} error={errors.cnpj} />
                  <div className="space-y-2 text-left">
                    <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase italic">E-mail Corporativo</Label>
                    <Input {...register("email")} className="h-12 focus-visible:ring-primary/20" />
                    {errors.email && <span className="text-[9px] font-bold text-destructive uppercase italic">{errors.email?.message}</span>}
                  </div>
                  <PhoneInput register={register} setValue={setValue} error={errors.telefone} />
                </div>

                <div
                  onClick={() => setValue("acesso_total", !acessoTotal, { shouldDirty: true })}
                  className={cn(
                    "group flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all md:rounded-3xl md:p-6",
                    acessoTotal ? "border-primary bg-primary/10" : "border-border bg-muted/30 hover:border-primary/20"
                  )}
                >
                  <div className="flex items-center gap-3 md:gap-4 text-left">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:h-12 md:w-12",
                      acessoTotal ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <ShieldCheck size={20} className="md:w-[24px]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <Label className={cn("text-xs font-black uppercase italic md:text-sm cursor-pointer", acessoTotal ? "text-primary" : "text-foreground")}>
                        Acesso Master
                      </Label>
                      <p className="text-[9px] font-medium text-muted-foreground uppercase md:text-[10px]">Liberação automática de catálogo.</p>
                    </div>
                  </div>
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 md:h-7 md:w-7",
                    acessoTotal ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  )}>
                    {acessoTotal && <Check size={14} strokeWidth={4} />}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="responsavel" className="mt-0 animate-in space-y-4 md:space-y-6 outline-none fade-in">
                {gestoresFields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border py-16 px-6 text-center animate-in zoom-in-95 duration-500 bg-muted/5">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                      <UserPlus2 size={32} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-black uppercase italic tracking-widest text-foreground">Nenhum gestor vinculado</h3>
                      <Link href="/admin/empresas/gestor" className="mt-8">
                        <Button className="h-11 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                          Vincular Gestor Agora
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  gestoresFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 rounded-[1.5rem] border bg-muted/10 p-5 md:rounded-[2rem] md:p-8 text-left">
                      <div className="flex items-center gap-3 border-b pb-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary ring-1 ring-primary/20">{index + 1}</div>
                        <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase italic">Gestor de Acesso</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-10 md:gap-y-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase italic">Nome Completo</Label>
                          <Input 
                            {...register(`gestores.${index}.nome` as const)} 
                            className="h-12 font-bold uppercase italic focus-visible:ring-primary/20" 
                          />
                          {errors.gestores?.[index]?.nome && (
                            <span className="text-[9px] font-bold text-destructive uppercase italic">{errors.gestores[index].nome?.message}</span>
                          )}
                        </div>
                        
                        <CpfInput 
                          name={`gestores.${index}.cpf`} 
                          register={register} 
                          setValue={setValue} 
                          error={errors.gestores?.[index]?.cpf} 
                        />

                        <div className="space-y-2">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase italic">E-mail de Login</Label>
                          <Input 
                            {...register(`gestores.${index}.email` as const)} 
                            className="h-12 focus-visible:ring-primary/20" 
                          />
                          {errors.gestores?.[index]?.email && (
                            <span className="text-[9px] font-bold text-destructive uppercase italic">{errors.gestores[index].email?.message}</span>
                          )}
                        </div>

                        <PhoneInput 
                          name={`gestores.${index}.telefone`}
                          register={register} 
                          setValue={setValue} 
                          error={errors.gestores?.[index]?.telefone} 
                        />
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="treinamentos" className="mt-0 animate-in duration-300 outline-none fade-in">
                {loadingTrainings ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Loader2 className="animate-spin text-primary mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Carregando Catálogo...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 text-left">
                    {globalTrainings?.map((t: any) => {
                      const isSelected = selectedTrainings.includes(t.id)
                      return (
                        <div
                          key={t.id}
                          onClick={() => toggleTraining(t.id)}
                          className={cn(
                            "group relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-4 transition-all duration-300",
                            isSelected 
                              ? "border-primary bg-primary/10 shadow-lg shadow-primary/5" 
                              : "border-border bg-muted/20 hover:border-primary/20"
                          )}
                        >
                          <div className={cn(
                            "absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full border-2",
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                          )}>
                            {isSelected && <Check size={12} strokeWidth={4} />}
                          </div>
                          <p className={cn("pr-6 text-[11px] font-black uppercase italic leading-tight transition-colors", isSelected ? "text-primary" : "text-foreground")}>
                            {t.titulo}
                          </p>
                          <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock size={10} className={cn(isSelected && "text-primary/70")} /> {t.carga_horaria || "8"}h</span>
                            <span className="flex items-center gap-1"><Layers size={10} className={cn(isSelected && "text-primary/70")} /> {t.modules?.length || 0} Mód.</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col-reverse gap-3 border-t p-4 md:flex-row md:items-center md:justify-end md:gap-4 md:p-10 bg-muted/5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="w-full text-[10px] font-black tracking-[0.2em] uppercase md:w-auto md:px-8 hover:bg-destructive/10 hover:text-destructive"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="h-12 w-full rounded-xl text-[10px] font-black tracking-[0.2em] uppercase shadow-xl shadow-primary/20 md:w-auto md:px-12 transition-all active:scale-95"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : "Salvar Alterações"}
              </Button>
            </div>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  )
}