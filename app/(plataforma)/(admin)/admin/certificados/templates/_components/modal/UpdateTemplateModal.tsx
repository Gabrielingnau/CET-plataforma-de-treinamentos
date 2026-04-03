"use client"

import {
  Edit3,
  Upload,
  ImageIcon,
  FileCheck,
  Loader2,
  AlertCircle,
  ExternalLink,
  FileText,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUpdateTemplate } from "@/hooks/certificates/use-update-template"
import { CertificateTemplate } from "@/types/database/template"
import { cn } from "@/lib/utils"

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
    <Dialog open={open} onOpenChange={(val) => !isUploading && onOpenChange(val)}>
      <DialogContent className="max-w-[95vw] md:max-w-237.5 h-[85vh] p-0 overflow-hidden border-border bg-card/95 backdrop-blur-2xl shadow-2xl flex flex-col">
        
        <DialogHeader className="p-8 border-b bg-muted/20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Edit3 className="text-primary w-6 h-6" />
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
          <aside className="hidden md:flex w-72 flex-col bg-muted/10 p-8 border-r overflow-y-auto shrink-0">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
              Mapeamento de Campos
            </h4>
            
            <div className="space-y-6">
              <div className="grid gap-2 p-4 rounded-xl bg-background border border-border font-mono text-[11px]">
                {["nome_aluno", "nome_treinamento", "carga_horaria", "data_conclusao", "codigo"].map(field => (
                  <div key={field} className="text-primary/80">{"{{"}{field}{"}}"}</div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-bold uppercase">Atenção</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-700/80">
                  Substituir arquivos atualizará todos os certificados futuros gerados por este modelo.
                </p>
              </div>
            </div>
          </aside>

          <main className="flex-1 flex flex-col bg-background/40 sm:overflow-hidden overflow-auto">
            <ScrollArea className="sm:h-[57vh]">
              <div className="p-8 pb-12 max-w-2xl mx-auto">
                <form id="update-tpl-form" onSubmit={onSubmit} className="space-y-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="edit-titulo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Título</Label>
                      <Input id="edit-titulo" {...form.register("titulo")} className="bg-background/50" />
                      {errors.titulo && <p className="text-xs text-destructive font-medium">{String(errors.titulo.message)}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-descricao" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descrição</Label>
                      <Input id="edit-descricao" {...form.register("descricao")} className="bg-background/50" />
                    </div>
                  </div>

                  {/* Campo de Capa com Visualização do Banco */}
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Capa da Galeria</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Preview Atual (Banco) */}
                      {template?.capa_url && !selectedCapa?.[0] && (
                        <div className="relative group aspect-video rounded-xl overflow-hidden border bg-muted">
                          <img 
                            src={template.capa_url} 
                            alt="Capa atual" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-white font-bold uppercase">Imagem Atual</span>
                          </div>
                        </div>
                      )}

                      {/* Input de Upload */}
                      <label className={cn(
                        "flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed transition-all cursor-pointer",
                        selectedCapa?.[0] ? "border-primary bg-primary/5 col-span-2" : "border-border hover:bg-muted/50",
                        !template?.capa_url && "col-span-2"
                      )}>
                        <input type="file" accept="image/*" className="hidden" {...form.register("capa_imagem")} />
                        {selectedCapa?.[0] ? (
                          <div className="flex flex-col items-center gap-1 text-primary text-center px-4">
                            <FileCheck className="w-5 h-5" />
                            <span className="text-xs font-bold truncate w-full">{selectedCapa[0].name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Trocar Capa</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Campo de PDF com Link do Banco */}
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Arquivo do Certificado (PDF)</Label>
                    
                    {/* Indicador de PDF já existente */}
                    {template?.url_bucket && !selectedPdf?.[0] && (
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-md">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">Arquivo atual salvo no servidor</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="h-8 text-[10px] uppercase font-bold">
                          <a href={template.url_bucket} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" /> Visualizar
                          </a>
                        </Button>
                      </div>
                    )}

                    <label className={cn(
                      "flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed transition-all cursor-pointer",
                      validation?.isValid ? "border-green-500 bg-green-50/30" : "border-border hover:bg-muted/50"
                    )}>
                      <input 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        {...form.register("arquivo_pdf", { onChange: handlePdfChange })} 
                      />
                      {validation?.isValid ? (
                        <div className="flex flex-col items-center gap-2 text-green-600 text-center px-4">
                          <FileCheck className="w-8 h-8" />
                          <span className="text-xs font-bold w-full">{selectedPdf?.[0]?.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground text-center px-4">
                          <Upload className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Clique para substituir o PDF</span>
                        </div>
                      )}
                    </label>

                    {validation && !validation.isValid && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 animate-in slide-in-from-top-2">
                        <AlertCircle className="text-amber-600" size={18} />
                        <p className="text-[10px] text-amber-700/80 font-bold leading-relaxed">
                          Este novo PDF não possui campos editáveis mapeados.
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </ScrollArea>

            <footer className="p-6 border-t bg-muted/20 flex items-center justify-end gap-3 shrink-0">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isUploading}>
                Cancelar
              </Button>
              <Button type="submit" form="update-tpl-form" disabled={isUploading} className="min-w-40">
                {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...</> : "Salvar Alterações"}
              </Button>
            </footer>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}