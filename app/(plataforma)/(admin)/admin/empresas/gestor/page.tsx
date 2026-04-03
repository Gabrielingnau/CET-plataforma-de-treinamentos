"use client"

import { UserCog, ShieldCheck, Loader2, Building2, Check, Search, AlertCircle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FormField } from "../novo/_components/form-field"
import { CpfInput } from "../inputs/cpfInput"
import { PhoneInput } from "../inputs/phoneInput"
import { useCompanyAdmin } from "@/hooks/companies/use-company-admin"

export default function NovoResponsavelPage() {
  const { 
    form, 
    companies, 
    loadingCompanies, 
    mutation, 
    selectedEmpresaId, 
    onSubmit, 
    handleSelectCompany,
    searchTerm,
    setSearchTerm
  } = useCompanyAdmin()

  const { register, setValue, formState: { errors } } = form

  return (
    <div className="mx-auto flex w-full max-w-6xl animate-in flex-col gap-10 pt-6 pb-20 duration-700 fade-in px-4">
      
      {/* HEADER - Limpo e Adaptável */}
      <div className="flex flex-col items-center space-y-4 border-b pb-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary/10 text-primary shadow-inner ring-1 ring-primary/20">
          <UserCog size={40} />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight uppercase italic md:text-5xl">
            Vincular <span className="text-primary">Responsável</span>
          </h1>
          <p className="mx-auto max-w-md font-medium text-muted-foreground">
            Crie as credenciais de acesso para o gestor de uma instituição parceira.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        
        {/* COLUNA DA ESQUERDA: DADOS PESSOAIS */}
        <div className="space-y-8 lg:col-span-7">
          <div className="space-y-8 rounded-[2.5rem] border p-6 md:p-8 shadow-xl bg-card/50">
            <div className="flex items-center gap-3 border-b pb-4">
              <ShieldCheck className="text-primary" size={20} />
              <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                Dados do Usuário
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                label="Nome do Gestor"
                placeholder="Ex: João Silva"
                {...register("nome")}
                error={errors.nome}
              />
              <FormField
                label="E-mail de Acesso"
                placeholder="gestor@email.com"
                {...register("email")}
                error={errors.email}
              />
              <CpfInput
                name="cpf"
                register={register}
                setValue={setValue}
                error={errors.cpf}
              />
              <PhoneInput
                register={register}
                setValue={setValue}
                error={errors.telefone}
              />
            </div>
          </div>

          {/* Banner de Segurança */}
          <div className="flex items-center gap-5 rounded-3xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            <div className="space-y-1 text-left">
              <p className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Segurança</p>
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                A senha inicial será o <strong className="text-foreground">CPF</strong> (somente números).
              </p>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA: SELEÇÃO DE EMPRESA */}
        <div className="space-y-6 lg:col-span-5">
          <div className="flex h-full flex-col rounded-[2.5rem] border p-6 md:p-8 shadow-xl bg-card/50">
            
            <header className="mb-6 space-y-4">
              <div className="flex items-center gap-3 border-b pb-4">
                <Building2 className="text-primary" size={20} />
                <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                  Selecionar Instituição
                </span>
              </div>

              {/* BUSCA */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input 
                  placeholder="Nome da empresa ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 rounded-2xl pl-12 text-xs font-bold focus-visible:ring-primary/30"
                />
                {searchTerm && (
                  <X 
                    size={14} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground" 
                    onClick={() => setSearchTerm("")}
                  />
                )}
              </div>

              {/* AVISOS DINÂMICOS */}
              {searchTerm === "" ? (
                <div className="flex items-start gap-3 rounded-2xl bg-primary/10 p-4 border border-primary/20 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={16} className="mt-0.5 text-primary shrink-0" />
                  <p className="text-[10px] font-bold leading-tight text-primary uppercase tracking-tight">
                    Listando empresas <span className="underline decoration-primary/50">sem gestor</span>. Use a busca para ver todas.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-2xl bg-sky-500/10 p-4 border border-sky-500/20 animate-in fade-in slide-in-from-top-1">
                  <Info size={16} className="mt-0.5 text-sky-500 shrink-0" />
                  <p className="text-[10px] font-bold leading-tight text-sky-600 dark:text-sky-100 uppercase tracking-tight">
                    Catálogo geral liberado para vínculo múltiplo.
                  </p>
                </div>
              )}
            </header>

            {loadingCompanies ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                <Loader2 className="animate-spin text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sincronizando...</span>
              </div>
            ) : (
              <div className="custom-scrollbar max-h-[380px] flex-1 space-y-3 overflow-y-auto pr-2">
                {companies?.length === 0 ? (
                  <div className="rounded-[2rem] border-2 border-dashed px-4 py-12 text-center border-border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase italic tracking-widest">Nenhuma empresa encontrada</p>
                  </div>
                ) : (
                  companies?.map((company: any) => (
                    <div
                      key={company.id}
                      onClick={() => handleSelectCompany(company.id)}
                      className={cn(
                        "group flex cursor-pointer items-center justify-between rounded-2xl border-2 p-5 transition-all relative",
                        selectedEmpresaId === company.id
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/5"
                          : "border-border bg-muted/20 hover:border-primary/40"
                      )}
                    >
                      <div className="flex flex-col text-left pr-4">
                        <span className={cn(
                          "text-[11px] font-black tracking-tight uppercase italic leading-none mb-2", 
                          selectedEmpresaId === company.id ? "text-primary" : "text-foreground"
                        )}>
                          {company.nome}
                        </span>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[8px] font-black text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded border border-border">
                            ID: #{company.id}
                          </span>
                          
                          {company.adminCount > 0 && (
                            <span className="text-[8px] font-black text-sky-500 uppercase bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                              {company.adminCount === 1 ? "+1 Gestor" : `+${company.adminCount} Gestores`}
                            </span>
                          )}
                        </div>
                      </div>

                      {selectedEmpresaId === company.id && (
                        <div className="rounded-full bg-primary p-1 text-primary-foreground shadow-lg animate-in zoom-in-50 duration-300">
                          <Check size={14} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {errors.empresa_id && (
              <p className="mt-4 text-[10px] font-black text-destructive uppercase italic tracking-widest text-center">
                ⚠️ Selecione uma empresa para continuar
              </p>
            )}

            <Button
              type="submit"
              disabled={mutation.isPending || companies?.length === 0}
              className="mt-8 h-16 w-full rounded-2xl font-black tracking-[0.2em] uppercase shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : "Finalizar Vínculo"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}