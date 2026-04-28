"use client"

import {
  AlertCircle,
  Edit,
  FileText,
  Image as ImageIcon,
  Info,
  Layout,
  Loader2,
  Upload,
} from "lucide-react"
import Image from "next/image"
import { useRef } from "react"
import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useEditTraining } from "@/hooks/trainings/use-edit-training"
import { cn } from "@/lib/utils"

interface EditTrainingModalProps {
  training: any
}

export function EditTrainingModal({ training }: EditTrainingModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    open,
    setOpen,
    register,
    control,
    errors,
    previewImage,
    isPending,
    handleImageChange,
    onSubmit,
    templates,
    isLoadingTemplates,
  } = useEditTraining(training)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit size={14} /> Editar Treinamento
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-[90vh] flex-col overflow-y-auto rounded-xl border p-0 shadow-2xl lg:max-w-250">
        <DialogHeader className="bg-muted/20 shrink-0 border-b p-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg shadow-sm">
              <Edit size={20} />
            </div>
            Ajustar Treinamento
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1">
          {/* ASIDE INFO */}
          <aside className="bg-muted/10 hidden w-70 shrink-0 border-r p-6 lg:block">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  className={cn(
                    "flex items-center gap-2 text-xs font-bold uppercase",
                    errors.cover_url && "text-destructive",
                  )}
                >
                  <ImageIcon size={14} /> Imagem de Capa
                </Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "group bg-background relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-all",
                    errors.cover_url
                      ? "border-destructive bg-destructive/5"
                      : "border-input hover:border-primary",
                  )}
                >
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
                      <Upload size={20} />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                      Alterar
                    </span>
                  </div>
                </div>
                {errors.cover_url && (
                  <p className="text-destructive flex items-center gap-1 text-[10px] font-medium uppercase">
                    <AlertCircle size={10} />{" "}
                    {errors.cover_url.message as string}
                  </p>
                )}
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

              <Separator />

              <div className="bg-primary/5 border-primary/10 rounded-lg border p-4">
                <h4 className="text-primary mb-2 flex items-center gap-2 text-[10px] font-bold uppercase">
                  <Info size={14} /> Dica do KYDORA
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Mantenha títulos objetivos para facilitar a navegação do
                  aluno.
                </p>
              </div>
            </div>
          </aside>

          {/* FORM PRINCIPAL */}
          <main className="bg-background flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="flex-1 p-6">
              <form
                id="edit-form"
                onSubmit={onSubmit}
                className="mx-auto max-w-2xl space-y-6"
              >
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase">
                    Título do Treinamento
                  </Label>
                  <Input
                    {...register("titulo")}
                    className={cn(
                      "font-semibold",
                      errors.titulo && "border-destructive",
                    )}
                  />
                  {errors.titulo && (
                    <p className="text-destructive text-[10px] font-medium uppercase">
                      {errors.titulo.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase">
                    Descrição Detalhada
                  </Label>
                  <Textarea
                    {...register("descricao")}
                    rows={5}
                    className={cn(
                      "resize-none font-medium",
                      errors.descricao && "border-destructive",
                    )}
                  />
                  {errors.descricao && (
                    <p className="text-destructive text-[10px] font-medium uppercase">
                      {errors.descricao.message as string}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-[10px] font-bold uppercase">
                      Carga (h)
                    </Label>
                    <Input
                      type="number"
                      {...register("carga_horaria")}
                      className="text-center font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-[10px] font-bold uppercase">
                      Nota Mín (%)
                    </Label>
                    <Input
                      type="number"
                      {...register("pontuacao_aprovacao")}
                      className="text-primary text-center font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-[10px] font-bold uppercase">
                      Tentativas
                    </Label>
                    <Input
                      type="number"
                      {...register("max_exam_tentativas")}
                      className="text-center font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-bold uppercase">
                    <Layout size={14} /> Layout do Certificado
                  </Label>
                  <Controller
                    name="template_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          {isLoadingTemplates ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <SelectValue placeholder="Escolha um modelo..." />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((t: any) => (
                            <SelectItem key={t.id} value={t.id.toString()}>
                              <div className="flex items-center gap-3 py-1">
                                <div className="bg-muted relative h-8 w-12 shrink-0 overflow-hidden rounded border">
                                  {t.capa_url ? (
                                    <Image
                                      src={t.capa_url}
                                      alt=""
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <FileText
                                      size={12}
                                      className="m-auto opacity-20"
                                    />
                                  )}
                                </div>
                                <span className="text-xs font-semibold">
                                  {t.titulo}
                                </span>
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

            <footer className="bg-muted/5 flex shrink-0 flex-col-reverse justify-end gap-3 border-t p-4 sm:flex-row">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-xs font-bold tracking-wider uppercase"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="edit-form"
                disabled={isPending}
                className="min-w-37.5 text-xs font-bold tracking-wider uppercase"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </footer>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}
