"use client"

import { useRef } from "react"
import Image from "next/image"
import { Controller } from "react-hook-form"
import { ImageIcon, Layout, PlusCircle, Loader2, Upload, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateTraining } from "@/hooks/trainings/use-create-training"
import { cn } from "@/lib/utils"

export function CreateTrainingForm() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { 
    register, 
    control, 
    errors, 
    previewImage, 
    handleImageChange, 
    onSubmit, 
    isPending,
    templates,
    isLoadingTemplates
  } = useCreateTraining()

  return (
    <Card className="shadow-lg border rounded-xl overflow-hidden">
      <CardHeader className="bg-muted/30 border-b p-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary h-10 w-10 rounded-lg flex items-center justify-center text-primary-foreground shadow-sm shrink-0">
            <PlusCircle size={20} />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Novo Treinamento
            </CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-wider opacity-70">
              Passo 1: Dados Gerais
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LADO VISUAL */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <Label className={cn("text-xs font-bold uppercase flex items-center gap-2", errors.cover_url && "text-destructive")}>
                  <ImageIcon size={14} /> Capa do Curso
                </Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center bg-muted/20",
                    errors.cover_url ? "border-destructive bg-destructive/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30"
                  )}
                >
                  {previewImage ? (
                    <Image src={previewImage} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground p-4">
                      <Upload size={20} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Selecionar Capa</span>
                    </div>
                  )}
                </div>
                {errors.cover_url && (
                  <p className="flex items-center gap-1 text-[10px] font-bold text-destructive uppercase">
                    <AlertCircle size={12} /> {errors.cover_url.message as string}
                  </p>
                )}
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
              </div>

              <div className="space-y-3">
                <Label className={cn("text-xs font-bold uppercase flex items-center gap-2", errors.template_id && "text-destructive")}>
                  <Layout size={14} /> Certificado
                </Label>
                <Controller
                  name="template_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={cn(errors.template_id && "border-destructive")}>
                        {isLoadingTemplates ? <Loader2 className="animate-spin size-4" /> : <SelectValue placeholder="Escolha o modelo" />}
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((t: any) => (
                          <SelectItem key={t.id} value={t.id.toString()}>
                            {t.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.template_id && <p className="text-[10px] font-bold text-destructive uppercase">{errors.template_id.message as string}</p>}
              </div>
            </div>

            {/* LADO TEXTUAL */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <Label className={cn("text-xs font-bold uppercase", errors.titulo && "text-destructive")}>Título</Label>
                <Input
                  {...register("titulo")}
                  className={cn("font-semibold", errors.titulo && "border-destructive")}
                  placeholder="Ex: Treinamento de Vendas"
                />
                {errors.titulo && <p className="text-[10px] font-bold text-destructive uppercase">{errors.titulo.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label className={cn("text-xs font-bold uppercase", errors.descricao && "text-destructive")}>Descrição</Label>
                <Textarea
                  {...register("descricao")}
                  className={cn("min-h-30 resize-none", errors.descricao && "border-destructive")}
                  placeholder="O que será ensinado?"
                />
                {errors.descricao && <p className="text-[10px] font-bold text-destructive uppercase">{errors.descricao.message as string}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Carga (h)</Label>
                  <Input type="number" {...register("carga_horaria")} className={cn("text-center font-bold", errors.carga_horaria && "border-destructive")} />
                  {errors.carga_horaria && <p className="text-[9px] font-bold text-destructive uppercase">{errors.carga_horaria.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Nota Mín (%)</Label>
                  <Input type="number" {...register("pontuacao_aprovacao")} className={cn("text-center font-bold", errors.pontuacao_aprovacao && "border-destructive")} />
                  {errors.pontuacao_aprovacao && <p className="text-[9px] font-bold text-destructive uppercase">{errors.pontuacao_aprovacao.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Tentativas</Label>
                  <Input type="number" {...register("max_exam_tentativas")} className={cn("text-center font-bold", errors.max_exam_tentativas && "border-destructive")} />
                  {errors.max_exam_tentativas && <p className="text-[9px] font-bold text-destructive uppercase">{errors.max_exam_tentativas.message as string}</p>}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <Button 
              variant="ghost" 
              type="button" 
              className="w-full sm:w-auto text-[10px] font-bold uppercase tracking-widest" 
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto min-w-45 font-bold uppercase tracking-wider text-xs"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" size={18} /> : "Próxima Etapa: Módulos"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}