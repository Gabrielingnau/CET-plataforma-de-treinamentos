"use client"

import {
  FileText,
  Upload,
  AlertCircle,
  Image as ImageIcon,
  FileCheck,
  Loader2,
  CheckCircle2, // Importado para o feedback visual de sucesso
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCreateTemplate } from "@/hooks/certificates/use-create-template"
import { cn } from "@/lib/utils"

export function CreateTemplateModal({
  open,
  onOpenChange,
}: {
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
  } = useCreateTemplate(() => onOpenChange(false))

  return (
    <Dialog open={open} onOpenChange={(val) => !isUploading && onOpenChange(val)}>
      <DialogContent className="max-w-[95vw] md:max-w-237.5 h-[85vh] p-0 overflow-hidden border-border bg-card/95 backdrop-blur-2xl shadow-2xl flex flex-col">
        
        <DialogHeader className="p-8 border-b bg-muted/20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <FileText className="text-primary w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Configurar Template
              </DialogTitle>
              <DialogDescription className="text-sm font-medium">
                Suba o modelo base e a capa de visualização para o certificado.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="hidden md:flex w-72 flex-col bg-muted/10 p-8 border-r overflow-y-auto shrink-0">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
              Mapeamento de Campos
            </h4>
            
            <div className="space-y-6">
              <div className="grid gap-2 p-4 rounded-xl bg-background border border-border font-mono text-[11px]">
                {["nome_aluno", "nome_treinamento", "carga_horaria", "data_conclusao", "codigo"].map(field => (
                  <div key={field} className="text-primary/80">
                    {"{{"}{field}{"}}"}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-bold uppercase">Aviso</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-700/80">
                  Se o PDF não tiver campos, usaremos o modo de coordenadas automáticas.
                </p>
              </div>
            </div>
          </aside>

          {/* Área Principal */}
          <main className="flex-1 flex flex-col bg-background/40 sm:overflow-hidden overflow-auto">
            <ScrollArea className="sm:h-[57vh]">
              <div className="p-8 pb-12 max-w-2xl mx-auto">
                <form id="tpl-form" onSubmit={onSubmit} className="space-y-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="titulo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Título</Label>
                      <Input
                        id="titulo"
                        {...form.register("titulo")}
                        className="bg-background/50"
                        placeholder="Ex: Certificado Bronze"
                      />
                      {errors.titulo && <p className="text-xs text-destructive font-medium">{String(errors.titulo.message)}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricao" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descrição</Label>
                      <Input
                        id="descricao"
                        {...form.register("descricao")}
                        className="bg-background/50"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Capa da Galeria</Label>
                    <label className={cn(
                      "flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer",
                      selectedCapa?.[0] ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    )}>
                      <input type="file" accept="image/*" className="hidden" {...form.register("capa_imagem")} />
                      {selectedCapa?.[0] ? (
                        <div className="flex flex-col items-center gap-1 text-primary text-center px-4">
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                          <span className="text-xs font-bold truncate w-full">{selectedCapa[0].name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ImageIcon className="w-5 h-5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Selecionar Capa</span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Arquivo PDF</Label>
                    <label className={cn(
                      "flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer relative overflow-hidden",
                      validation?.isValid 
                        ? "border-green-500 bg-green-500/5 ring-4 ring-green-500/10" 
                        : "border-border hover:bg-muted/50",
                      selectedPdf?.[0] && !validation?.isValid && "border-destructive bg-destructive/5"
                    )}>
                      <input 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        {...form.register("arquivo_pdf", { 
                          onChange: (e) => {
                            handlePdfChange(e);
                          } 
                        })} 
                      />
                      
                      {validation?.isValid ? (
                        <div className="flex flex-col items-center gap-3 text-green-600 animate-in zoom-in-95 duration-300">
                          <div className="p-3 bg-green-100 rounded-full">
                            <FileCheck className="w-10 h-10" />
                          </div>
                          <div className="text-center px-4">
                            <span className="text-xs font-bold block truncate max-w-[250px]">
                              {selectedPdf?.[0]?.name}
                            </span>
                            <span className="text-[10px] uppercase font-bold opacity-70">Arquivo Pronto</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground text-center px-4">
                          <Upload className="w-8 h-8 opacity-40" />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest block">Clique para subir o PDF</span>
                            <span className="text-[9px] text-muted-foreground/60">Apenas arquivos .pdf</span>
                          </div>
                        </div>
                      )}
                    </label>
                    
                    {/* Exibe erro de validação do PDF se houver */}
                    {selectedPdf?.[0] && !validation?.isValid && (
                      <p className="text-[10px] text-destructive font-bold flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> O PDF selecionado é inválido ou muito pesado.
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </ScrollArea>

            {/* Footer Fixo */}
            <footer className="p-6 border-t bg-muted/20 flex items-center justify-end gap-3 shrink-0">
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
                form="tpl-form"
                disabled={isUploading || !validation?.isValid}
                className="min-w-40"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Salvar Template"
                )}
              </Button>
            </footer>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}