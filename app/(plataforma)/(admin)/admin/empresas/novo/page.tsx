"use client"

import { Loader2, ChevronRight, ChevronLeft, Building2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCreateCompany } from "@/hooks/companies/use-create-company"
import { CompanyInfoStep } from "./_components/steps/company-info-step"
import { TrainingSelectionStep } from "./_components/steps/training-selection-step"

export default function NovoClientePage() {
  const {
    step, setStep, form, trainings, mutation,
    acessoTotal, selectedTrainings, handleNextStep,
    toggleTraining, toggleAllTrainings, onSubmit
  } = useCreateCompany()

  const { formState: { isSubmitting, errors }, register, setValue } = form

  return (
    <div className="mx-auto flex w-full max-w-6xl animate-in flex-col gap-6 px-4 pt-4 pb-10 duration-700 fade-in sm:px-6">
      
      {/* HEADER: Limpo de cores fixas */}
      <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl font-black tracking-tight uppercase italic sm:text-3xl text-foreground">
            {step === 1 ? "Nova Empresa" : "Configurar Treinamentos"}
          </h1>
          <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase italic">
            Passo {step} de 2
          </p>
        </div>

        {/* INDICADORES: Adaptáveis ao tema usando bg-muted */}
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border bg-muted/20 p-2 md:justify-end">
          <StepIndicator active={step === 1} icon={<Building2 size={14}/>} label="Dados" />
          <div className="h-1 w-2 rounded-full bg-border" />
          <StepIndicator active={step === 2} icon={<BookOpen size={14}/>} label="Cursos" />
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="min-h-[300px] sm:min-h-[400px]">
          {step === 1 ? (
            <div className="animate-in slide-in-from-left-4 duration-500">
              <CompanyInfoStep register={register} setValue={setValue} errors={errors} />
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <TrainingSelectionStep 
                trainings={trainings}
                selectedIds={selectedTrainings}
                acessoTotal={acessoTotal}
                onToggleAll={toggleAllTrainings}
                onToggleTraining={toggleTraining}
              />
            </div>
          )}
        </div>

        {/* NAVEGAÇÃO: Sem bordas ou fundos manuais de zinco */}
        <div className="flex flex-col-reverse gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          
          <Button 
            type="button" 
            variant="ghost" 
            className={cn(
              "h-14 w-full px-6 text-[10px] font-black tracking-[0.2em] uppercase transition-all sm:h-12 sm:w-auto",
              step === 1 && "hidden sm:invisible sm:block"
            )} 
            onClick={() => setStep(1)} 
            disabled={isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar aos Dados
          </Button>

          <div className="flex w-full sm:w-auto">
            {step === 1 ? (
              <Button 
                type="button" 
                onClick={handleNextStep} 
                className="h-14 w-full rounded-2xl px-8 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg transition-all sm:h-12 sm:w-auto"
              >
                Configurar Treinamentos <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting || mutation.isPending} 
                className="h-14 w-full rounded-2xl bg-primary text-primary-foreground px-10 text-[10px] font-black tracking-[0.2em] uppercase shadow-xl shadow-primary/10 transition-all sm:h-12 sm:w-auto"
              >
                {isSubmitting || mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Finalizando...
                  </>
                ) : (
                  "Criar Empresa e Liberar Acessos"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

function StepIndicator({ active, icon, label }: { active: boolean, icon: React.ReactNode, label: string }) {
  return (
    <div className={cn(
      "flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 sm:px-3 sm:py-1.5", 
      active ? "bg-muted shadow-inner" : "opacity-30"
    )}>
      <span className={active ? "text-primary" : "text-muted-foreground"}>{icon}</span>
      <span className={cn(
        "text-[9px] font-black uppercase tracking-widest", 
        active ? "text-foreground" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </div>
  )
}