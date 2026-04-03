"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUpdateTemplate } from "@/hooks/certificates/use-update-template"
import { cn } from "@/lib/utils"
import { CertificateTemplate } from "@/types/database/template"
import {
  AlertCircle,
  Edit3,
  ExternalLink,
  FileCheck,
  FileText,
  ImageIcon,
  Loader2,
  Upload,
} from "lucide-react"

export function UpdateTemplateModal({
  template,
  open,
  onOpenChange,
}: {
  template: CertificateTemplate | null
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const {
    form,
    onSubmit,
    isUploading,
    validation,
    handlePdfChange,
    selectedCapa,
    selectedPdf,
    errors,
  } = useUpdateTemplate(template, () => onOpenChange(false))

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => !isUploading && onOpenChange(val)}
    >
      <DialogContent className="border-border bg-card/95 flex h-[85vh] max-w-[95vw] flex-col overflow-hidden p-0 shadow-2xl backdrop-blur-2xl md:max-w-237.5">
        <DialogHeader className="bg-muted/20 shrink-0 border-b p-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-xl p-3">
              <Edit3 className="text-primary h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Editar Template
              </DialogTitle>
              <DialogDescription className="text-sm font-medium">
                Altere os dados ou substitua os arquivos salvos no sistema.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar de Apoio */}
          <aside className="bg-muted/10 hidden w-72 shrink-0 flex-col overflow-y-auto border-r p-8 md:flex">
            <h4 className="text-primary mb-6 text-[10px] font-bold tracking-[0.2em] uppercase">
              Mapeamento de Campos
            </h4>

            <div className="space-y-6">
              <div className="bg-background border-border grid gap-2 rounded-xl border p-4 font-mono text-[11px]">
                {[
                  "nome_aluno",
                  "nome_treinamento",
                  "carga_horaria",
                  "data_conclusao",
                  "codigo",
                ].map((field) => (
                  <div key={field} className="text-primary/80">
                    {"{{"}
                    {field}
                    {"}}"}
                  </div>
                ))}
              </div>

              <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-bold uppercase">
                    Atenção
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-700/80">
                  Substituir arquivos atualizará todos os certificados futuros
                  gerados por este modelo.
                </p>
              </div>
            </div>
          </aside>

          <main className="bg-background/40 flex flex-1 flex-col overflow-auto sm:overflow-hidden">
            <ScrollArea className="sm:h-[57vh]">
              <div className="mx-auto max-w-2xl p-8 pb-12">
                <form
                  id="update-tpl-form"
                  onSubmit={onSubmit}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-titulo"
                        className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                      >
                        Título
                      </Label>
                      <Input
                        id="edit-titulo"
                        {...form.register("titulo")}
                        className="bg-background/50"
                      />
                      {errors.titulo && (
                        <p className="text-destructive text-xs font-medium">
                          {String(errors.titulo.message)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-descricao"
                        className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                      >
                        Descrição
                      </Label>
                      <Input
                        id="edit-descricao"
                        {...form.register("descricao")}
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  {/* Campo de Capa com Visualização do Banco */}
                  <div className="space-y-3">
                    <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Capa da Galeria
                    </Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Preview Atual (Banco) */}
                      {template?.capa_url && !selectedCapa?.[0] && (
                        <div className="group bg-muted relative aspect-video overflow-hidden rounded-xl border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={template.capa_url}
                            alt="Capa atual"
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="text-[10px] font-bold text-white uppercase">
                              Imagem Atual
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Input de Upload */}
                      <label
                        className={cn(
                          "flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
                          selectedCapa?.[0]
                            ? "border-primary bg-primary/5 col-span-2"
                            : "border-border hover:bg-muted/50",
                          !template?.capa_url && "col-span-2",
                        )}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          {...form.register("capa_imagem")}
                        />
                        {selectedCapa?.[0] ? (
                          <div className="text-primary flex flex-col items-center gap-1 px-4 text-center">
                            <FileCheck className="h-5 w-5" />
                            <span className="w-full truncate text-xs font-bold">
                              {selectedCapa[0].name}
                            </span>
                          </div>
                        ) : (
                          <div className="text-muted-foreground flex flex-col items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">
                              Trocar Capa
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Campo de PDF com Link do Banco */}
                  <div className="space-y-3">
                    <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Arquivo do Certificado (PDF)
                    </Label>

                    {/* Indicador de PDF já existente */}
                    {template?.url_bucket && !selectedPdf?.[0] && (
                      <div className="bg-muted/30 mb-2 flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 rounded-md p-2">
                            <FileText className="text-primary h-4 w-4" />
                          </div>
                          <span className="text-muted-foreground text-xs font-medium">
                            Arquivo atual salvo no servidor
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 text-[10px] font-bold uppercase"
                        >
                          <a
                            href={template.url_bucket}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="mr-1 h-3 w-3" /> Visualizar
                          </a>
                        </Button>
                      </div>
                    )}

                    <label
                      className={cn(
                        "flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
                        validation?.isValid
                          ? "border-green-500 bg-green-50/30"
                          : "border-border hover:bg-muted/50",
                      )}
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        {...form.register("arquivo_pdf", {
                          onChange: handlePdfChange,
                        })}
                      />
                      {validation?.isValid ? (
                        <div className="flex flex-col items-center gap-2 px-4 text-center text-green-600">
                          <FileCheck className="h-8 w-8" />
                          <span className="w-full text-xs font-bold">
                            {selectedPdf?.[0]?.name}
                          </span>
                        </div>
                      ) : (
                        <div className="text-muted-foreground flex flex-col items-center gap-3 px-4 text-center">
                          <Upload className="h-6 w-6" />
                          <span className="text-[10px] font-bold tracking-widest uppercase">
                            Clique para substituir o PDF
                          </span>
                        </div>
                      )}
                    </label>

                    {validation && !validation.isValid && (
                      <div className="animate-in slide-in-from-top-2 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                        <AlertCircle className="text-amber-600" size={18} />
                        <p className="text-[10px] leading-relaxed font-bold text-amber-700/80">
                          Este novo PDF não possui campos editáveis mapeados.
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </ScrollArea>

            <footer className="bg-muted/20 flex shrink-0 items-center justify-end gap-3 border-t p-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="update-tpl-form"
                disabled={isUploading}
                className="min-w-40"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Atualizando...
                  </>
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
