"use client"

import { Loader2, Save, Video, FileText, Clock, X, UploadCloud } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { useLessonForm } from "@/hooks/lessons/use-lesson-form"
import { DeleteConfirmModal } from "../modal/delete-confirm-modal"

export function LessonForm(props: any) {
  const { 
    register, 
    errors, 
    isPending, 
    isDeleting, 
    isEditing, 
    handleVideoChange, 
    handleDelete, 
    onSubmit 
  } = useLessonForm(props)

  return (
    <div className="bg-card border rounded-xl p-6 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <form onSubmit={onSubmit} className="space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Video size={18} className="text-primary" />
              {isEditing ? "Editar Aula" : "Nova Aula"}
            </h3>
            <p className="text-xs text-muted-foreground">Configure o conteúdo e o vídeo da lição</p>
          </div>
          
          {isEditing && (
            <DeleteConfirmModal
              title={props.defaultValues?.titulo}
              onConfirm={handleDelete}
              isLoading={isDeleting}
            />
          )}
        </div>

        <Separator />

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider">Título da Aula</Label>
            <Input 
              {...register("titulo")} 
              placeholder="Ex: 01. Primeiros passos"
              className={cn("font-medium", errors.titulo && "border-destructive")} 
            />
            {errors.titulo && (
              <p className="text-[10px] font-bold text-destructive uppercase">
                {errors.titulo.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="md:text-center block text-xs font-bold uppercase tracking-wider">Ordem</Label>
            <Input 
              type="number" 
              {...register("ordem")} 
              className="text-center font-bold"
            />
          </div>
        </div>

        {/* VÍDEO E DURAÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <UploadCloud size={14} className="text-primary" /> Arquivo de Vídeo
            </Label>
            <div className="relative">
              <Input
                type="file"
                accept="video/*"
                className={cn(
                  "cursor-pointer file:font-bold file:text-primary",
                  errors.video_url && "border-destructive"
                )}
                onChange={handleVideoChange}
              />
            </div>
            {errors.video_url && (
              <p className="text-[10px] font-bold text-destructive uppercase">
                {errors.video_url.message as string}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider md:justify-center">
              <Clock size={14} /> Duração (min)
            </Label>
            <Input 
              type="number" 
              {...register("duracao_min")} 
              className={cn("text-center font-bold", errors.duracao_min && "border-destructive")} 
            />
            {errors.duracao_min && (
              <p className="text-[10px] font-bold text-destructive uppercase text-center">
                {errors.duracao_min.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider">Descrição Curta</Label>
          <Input 
            {...register("descricao")} 
            placeholder="Um breve resumo sobre o que será abordado..."
            className={cn(errors.descricao && "border-destructive")} 
          />
          {errors.descricao && (
            <p className="text-[10px] font-bold text-destructive uppercase">
              {errors.descricao.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <FileText size={14} /> Material Complementar (Texto)
          </Label>
          <Textarea 
            {...register("texto_video")} 
            className={cn(
              "min-h-25 resize-none font-medium",
              errors.texto_video && "border-destructive"
            )} 
            placeholder="Instruções adicionais ou links de apoio..."
          />
          {errors.texto_video && (
            <p className="text-[10px] font-bold text-destructive uppercase">
              {errors.texto_video.message as string}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={props.onCancel}
            className="font-bold uppercase text-[10px] tracking-widest"
          >
            <X size={16} className="mr-2" /> Descartar
          </Button>
          
          <Button 
            type="submit" 
            disabled={isPending || isDeleting}
            className="min-w-40 font-bold uppercase text-xs tracking-wider"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Enviando...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                {isEditing ? "Salvar Alterações" : "Criar Aula"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}