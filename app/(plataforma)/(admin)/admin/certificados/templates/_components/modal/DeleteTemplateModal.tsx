"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Loader2, Copy, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CertificateTemplate } from "@/types/database/template"
import { cn } from "@/lib/utils"

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
      <DialogContent className="max-w-112.5 sm:rounded-lg border-border bg-card/95 backdrop-blur-xl shadow-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 text-destructive mb-1">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle className="text-xl font-bold tracking-tight">
              Confirmar Exclusão
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            Esta ação pode ser irreversível. Se o template estiver em uso, ele será apenas <span className="font-semibold text-foreground">desativado</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Box de Nome com Botão Copiar */}
          <div className="rounded-md bg-muted/50 p-4 border border-border space-y-2 relative group">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Nome do Template
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors"
                title="Copiar nome"
              >
                {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
              </Button>
            </div>
            <p className="text-lg font-semibold text-foreground select-none break-all leading-tight">
              {template?.titulo}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-delete" className="text-xs font-medium text-muted-foreground">
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

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
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
            className="flex-1 sm:flex-none min-w-35"
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