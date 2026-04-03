"use client"

import { useRef } from "react"
import Image from "next/image"
import { Controller } from "react-hook-form"
import { 
  Edit, Upload, Image as ImageIcon, Layout, 
  Loader2, FileText, Info, AlertCircle 
} from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useEditTraining } from "@/hooks/trainings/use-edit-training"

interface EditTrainingModalProps {
  training: any 
}

export function EditTrainingModal({ training }: EditTrainingModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { 
    open, setOpen, register, control, errors, 
    previewImage, isPending, handleImageChange, 
    onSubmit, templates, isLoadingTemplates 
  } = useEditTraining(training)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit size={14} /> Editar Curso
        </Button>
      </DialogTrigger>
      
      <DialogContent className="flex h-[90vh] lg:max-w-250 flex-col overflow-y-auto p-0 border shadow-2xl rounded-xl">
        <DialogHeader className="shrink-0 border-b bg-muted/20 p-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="bg-primary h-10 w-10 rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
              <Edit size={20} />
            </div>
            Ajustar Treinamento
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1">
          {/* ASIDE INFO */}
          <aside className="hidden w-70 shrink-0 border-r bg-muted/10 p-6 lg:block">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className={cn("text-xs font-bold uppercase flex items-center gap-2", errors.cover_url && "text-destructive")}>
                  <ImageIcon size={14} /> Imagem de Capa
                </Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-all bg-background",
                    errors.cover_url ? "border-destructive bg-destructive/5" : "border-input hover:border-primary"
                  )}
                >
                  {previewImage ? (
                    <Image src={previewImage} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Upload size={20} />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Alterar</span>
                  </div>
                </div>
                {errors.cover_url && (
                  <p className="text-[10px] font-medium text-destructive uppercase flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.cover_url.message as string}
                  </p>
                )}
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
              </div>
              
              <Separator />
              
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase text-primary mb-2">
                  <Info size={14}/> Dica do KYDORA
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mantenha títulos objetivos para facilitar a navegação do aluno.
                </p>
              </div>
            </div>
          </aside>

          {/* FORM PRINCIPAL */}
          <main className="flex flex-1 flex-col overflow-hidden bg-background">
            <ScrollArea className="flex-1 p-6">
              <form id="edit-form" onSubmit={onSubmit} className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase">Título do Curso</Label>
                  <Input 
                    {...register("titulo")} 
                    className={cn("font-semibold", errors.titulo && "border-destructive")} 
                  />
                  {errors.titulo && (
                    <p className="text-[10px] font-medium text-destructive uppercase">
                      {errors.titulo.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase">Descrição Detalhada</Label>
                  <Textarea 
                    {...register("descricao")} 
                    rows={5} 
                    className={cn("resize-none font-medium", errors.descricao && "border-destructive")} 
                  />
                  {errors.descricao && (
                    <p className="text-[10px] font-medium text-destructive uppercase">
                      {errors.descricao.message as string}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Carga (h)</Label>
                    <Input type="number" {...register("carga_horaria")} className="text-center font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Nota Mín (%)</Label>
                    <Input type="number" {...register("pontuacao_aprovacao")} className="text-center font-bold text-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Tentativas</Label>
                    <Input type="number" {...register("max_exam_tentativas")} className="text-center font-bold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase flex items-center gap-2">
                    <Layout size={14} /> Layout do Certificado
                  </Label>
                  <Controller
                    name="template_id"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          {isLoadingTemplates ? <Loader2 className="animate-spin size-4" /> : <SelectValue placeholder="Escolha um modelo..." />}
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((t: any) => (
                            <SelectItem key={t.id} value={t.id.toString()}>
                              <div className="flex items-center gap-3 py-1">
                                <div className="relative h-8 w-12 rounded border overflow-hidden shrink-0 bg-muted">
                                  {t.capa_url ? (
                                    <Image src={t.capa_url} alt="" fill className="object-cover" />
                                  ) : (
                                    <FileText size={12} className="m-auto opacity-20" />
                                  )}
                                </div>
                                <span className="text-xs font-semibold">{t.titulo}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </form>
            </ScrollArea>

            <footer className="shrink-0 border-t bg-muted/5 p-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setOpen(false)}
                className="text-xs font-bold uppercase tracking-wider"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                form="edit-form" 
                disabled={isPending} 
                className="min-w-37.5 text-xs font-bold uppercase tracking-wider"
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : "Salvar Alterações"}
              </Button>
            </footer>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}