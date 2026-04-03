"use client"

import { Loader2, Save, X, CheckCircle2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useQuestionForm } from "@/hooks/questions/use-question-form"

interface QuestionFormProps {
  ownerId: string
  type: "quiz" | "exam"
  defaultValues?: any
  onCancel: () => void
  onSuccess: () => void
}

export function QuestionForm(props: QuestionFormProps) {
  const {
    register,
    errors,
    isSubmitting,
    watchOptions,
    watchCorrect,
    setValue,
    isEditing,
    onSubmit,
  } = useQuestionForm(props)

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-xl border bg-card p-6 shadow-sm animate-in fade-in duration-200"
    >
      {/* ENUNCIADO */}
      <div className="space-y-2">
        <Label htmlFor="pergunta" className="text-xs font-bold uppercase tracking-wider">
          Enunciado da Pergunta
        </Label>
        <Input
          id="pergunta"
          {...register("pergunta")}
          placeholder="Ex: O que significa a sigla RLS?"
          className={cn(errors.pergunta && "border-destructive")}
        />
        {errors.pergunta && (
          <p className="text-[10px] font-medium text-destructive uppercase">
            {errors.pergunta.message as string}
          </p>
        )}
      </div>

      {/* ALTERNATIVAS */}
      <div className="space-y-4">
        <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 size={14} className="text-primary" /> Alternativas (Marque a correta)
        </Label>
        
        <RadioGroup
          value={watchCorrect}
          onValueChange={(val) => setValue("opcao_correta", val, { shouldValidate: true })}
          className="space-y-3"
        >
          {watchOptions.map((_, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value={watchOptions[index]}
                  id={`opt-${index}`}
                  disabled={!watchOptions[index]}
                  className="border-2"
                />
                <Input
                  {...register(`opcoes.${index}`)}
                  placeholder={`Opção ${index + 1}`}
                  className={cn(
                    "bg-background font-medium",
                    errors.opcoes?.[index] && "border-destructive"
                  )}
                  onChange={(e) => {
                    const val = e.target.value
                    if (watchCorrect === watchOptions[index]) {
                      setValue("opcao_correta", val)
                    }
                    setValue(`opcoes.${index}`, val)
                  }}
                />
              </div>
            </div>
          ))}
        </RadioGroup>

        {(errors.opcoes || errors.opcao_correta) && (
          <div className="space-y-1">
            {errors.opcao_correta && (
              <p className="text-[10px] font-medium text-destructive uppercase">
                {errors.opcao_correta.message as string}
              </p>
            )}
            {errors.opcoes && (
              <p className="text-[10px] font-medium text-destructive uppercase">
                Verifique o preenchimento das alternativas
              </p>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={props.onCancel}
          className="text-xs font-bold uppercase tracking-wider"
        >
          <X size={16} className="mr-2" /> Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-35 text-xs font-bold uppercase tracking-wider"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Save size={18} className="mr-2" />
              {isEditing ? "Atualizar" : "Salvar Pergunta"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}