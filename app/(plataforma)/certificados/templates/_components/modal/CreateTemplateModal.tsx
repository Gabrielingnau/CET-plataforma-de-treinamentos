"use client"

import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  FileCheck,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { templateSchema } from "@/types/forms/template-form"
import { validateTemplatePDF } from "@/lib/utils/pdf-validator"
import { createTemplate } from "@/services/templates/template-service-client"

export function CreateTemplateModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const [validation, setValidation] = useState<{
    isValid: boolean
    missingFields: string[]
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(templateSchema),
  })

  const selectedCapa = watch("capa_imagem")
  const selectedPdf = watch("arquivo_pdf")

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const res = await validateTemplatePDF(file)
    setValidation(res)
  }

  const onSubmit = async (data: any) => {
    if (!validation?.isValid)
      return toast.error("O PDF precisa ter os campos obrigatórios.")

    try {
      setIsUploading(true)
      await createTemplate(data, data.arquivo_pdf[0], data.capa_imagem[0])

      toast.success("Template cadastrado com sucesso!")
      router.refresh()
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Erro ao salvar no banco de dados.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-[80vw] flex-col overflow-hidden p-0 md:max-w-[1000px]">
        <DialogHeader className="shrink-0 border-b p-6">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <FileText className="text-primary" /> Configurar Template
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden w-[35%] overflow-y-auto border-r bg-muted/30 p-6 md:block">
            <h4 className="mb-4 flex items-center gap-2 text-sm font-bold">
              <AlertCircle size={16} /> Requisitos
            </h4>
            <ul className="space-y-4 text-xs leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">
                  Mapeamento de Campos:
                </strong>
                <p>O PDF deve ter campos de formulário editáveis chamados:</p>
                <div className="mt-2 grid grid-cols-1 gap-1 rounded border bg-background p-2 font-mono text-primary">
                  <span>• nome_aluno</span>
                  <span>• nome_treinamento</span>
                  <span>• carga_horaria</span>
                  <span>• data_conclusao</span>
                  <span>• codigo</span>
                </div>
              </li>
              <li>
                <strong className="text-foreground">Imagem de Capa:</strong> Use
                uma imagem que represente visualmente o certificado na galeria.
              </li>
            </ul>
          </aside>

          <main className="flex flex-1 flex-col overflow-hidden bg-background">
            <ScrollArea className="flex-1 p-8">
              <form
                id="tpl-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Título do Template</Label>
                    <Input
                      {...register("titulo")}
                      placeholder="Ex: Modelo Bronze 2024"
                    />
                    {errors.titulo && (
                      <p className="text-xs font-medium text-destructive">
                        {String(errors.titulo.message)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição Curta</Label>
                    <Input
                      {...register("descricao")}
                      placeholder="Ex: Utilizado para cursos internos"
                    />
                    {errors.descricao && (
                      <p className="text-xs font-medium text-destructive">
                        {String(errors.descricao.message)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Capa de Visualização (PNG/JPG)</Label>
                  <div
                    className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:bg-muted/50 ${errors.capa_imagem ? "border-destructive" : "border-muted-foreground/20"}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      {...register("capa_imagem")}
                    />
                    <ImageIcon
                      className={
                        selectedCapa?.[0]
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                      size={32}
                    />
                    <span className="text-sm font-medium">
                      {selectedCapa?.[0]
                        ? selectedCapa[0].name
                        : "Selecionar imagem de capa"}
                    </span>
                  </div>
                  {errors.capa_imagem && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.capa_imagem.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Arquivo PDF do Template</Label>
                  <div
                    className={`relative flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-10 transition-all ${validation?.isValid ? "border-green-500 bg-green-50/10" : errors.arquivo_pdf ? "border-destructive" : "border-muted-foreground/20"}`}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      {...register("arquivo_pdf", {
                        onChange: handlePdfChange,
                      })}
                    />
                    {validation?.isValid ? (
                      <FileCheck className="text-green-500" size={40} />
                    ) : (
                      <Upload className="text-muted-foreground" size={40} />
                    )}
                    <span className="text-sm font-medium">
                      {selectedPdf?.[0]
                        ? selectedPdf[0].name
                        : "Clique para subir o PDF do template"}
                    </span>
                  </div>
                  {errors.arquivo_pdf && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.arquivo_pdf.message as string}
                    </p>
                  )}

                  {validation && !validation.isValid && (
                    <div className="animate-in rounded-lg border border-destructive/20 bg-destructive/10 p-4 duration-300 fade-in zoom-in">
                      <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-destructive uppercase">
                        <AlertCircle size={14} /> Campos obrigatórios não
                        encontrados:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {validation.missingFields.map((f) => (
                          <span
                            key={f}
                            className="rounded border border-destructive/30 bg-background px-2 py-1 font-mono text-[10px] font-bold text-destructive"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </ScrollArea>

            <div className="flex shrink-0 justify-end gap-3 border-t bg-muted/10 p-4">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="tpl-form"
                disabled={isUploading}
                className="min-w-[120px]"
              >
                {isUploading ? "Salvando..." : "Cadastrar Template"}
              </Button>
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}