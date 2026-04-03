"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CertificateTemplate } from "@/types/database/template"
import { AlertTriangle, Check, Copy, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface DeleteTemplateModalProps {
  template: CertificateTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: number, pdf: string, capa: string | null) => void
  isProcessing: boolean
}

export function DeleteTemplateModal({
  template,
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
}: DeleteTemplateModalProps) {
  const [confirmName, setConfirmName] = useState("")
  const [copied, setCopied] = useState(false)

  // Limpa o estado quando o modal fecha
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfirmName("")
      setCopied(false)
    }
  }, [open])

  // Função para copiar o título
  const handleCopy = () => {
    if (!template?.titulo) return
    navigator.clipboard.writeText(template.titulo)
    setCopied(true)
    // Opcional: cola automaticamente no input para agilizar
    setConfirmName(template.titulo)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirm = () => {
    if (!template || confirmName !== template.titulo) return
    onConfirm(template.id, template.url_bucket, template.capa_url)
    onOpenChange(false)
  }

  const isButtonDisabled = confirmName !== template?.titulo || isProcessing

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => !isProcessing && onOpenChange(val)}
    >
      <DialogContent className="border-border bg-card/95 max-w-112.5 shadow-lg backdrop-blur-xl sm:rounded-lg">
        <DialogHeader>
          <div className="text-destructive mb-1 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle className="text-xl font-bold tracking-tight">
              Confirmar Exclusão
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            Esta ação pode ser irreversível. Se o template estiver em uso, ele
            será apenas{" "}
            <span className="text-foreground font-semibold">desativado</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Box de Nome com Botão Copiar */}
          <div className="bg-muted/50 border-border group relative space-y-2 rounded-md border p-4">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Nome do Template
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-primary h-6 w-6 transition-colors"
                title="Copiar nome"
              >
                {copied ? (
                  <Check size={12} className="text-green-600" />
                ) : (
                  <Copy size={12} />
                )}
              </Button>
            </div>
            <p className="text-foreground text-lg leading-tight font-semibold break-all select-none">
              {template?.titulo}
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirm-delete"
              className="text-muted-foreground text-xs font-medium"
            >
              Para confirmar, digite ou cole o nome acima:
            </Label>
            <Input
              id="confirm-delete"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Digite o título do template"
              className="bg-background/50 focus-visible:ring-destructive"
              disabled={isProcessing}
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isButtonDisabled}
            className="min-w-35 flex-1 sm:flex-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Confirmar Exclusão"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
