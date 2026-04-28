"use client"

import { Building2, ShieldCheck } from "lucide-react"
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form"
import { CompanyFormData } from "@/types/forms/company-form"
import { FormField } from "../../../novo/_components/form-field"
import { CnpjInput } from "../../../inputs/cnpjInput"
import { PhoneInput } from "../../../inputs/phoneInput"

interface StepProps {
  register: UseFormRegister<CompanyFormData>
  setValue: UseFormSetValue<CompanyFormData>
  errors: FieldErrors<CompanyFormData>
}

export function CompanyInfoStep({ register, setValue, errors }: StepProps) {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500 text-left">
      {/* HEADER DO STEP - Limpo de cores fixas */}
      <div className="flex items-center gap-4 border-b pb-6 mb-10">
        <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary shrink-0 shadow-inner ring-1 ring-primary/20">
          <Building2 size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-foreground italic uppercase">Perfil da Empresa</h2>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em]">Dados cadastrais</p>
        </div>
      </div>
      
      {/* CARD DE DADOS - Agora usa bg-card ou bg-muted/20 para ser dinâmico */}
      <div className="bg-muted/10 p-6 md:p-10 rounded-[2.5rem] border shadow-xl backdrop-blur-sm space-y-8">
        <div className="flex items-center gap-3 border-b pb-4">
          <ShieldCheck className="text-primary" size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Dados Empresariais</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormField 
            label="Razão Social / Nome" 
            placeholder="Ex: Treinamentos S.A" 
            {...register("nome")} 
            error={errors.nome} 
          />
          <CnpjInput 
            register={register} 
            setValue={setValue} 
            error={errors.cnpj} 
          />
          <FormField 
            label="E-mail da Empresa" 
            placeholder="contato@empresa.com" 
            type="email" 
            {...register("email")} 
            error={errors.email} 
          />
          <PhoneInput 
            register={register} 
            setValue={setValue} 
            error={errors.telefone} 
          />
        </div>
      </div>
    </div>
  )
}