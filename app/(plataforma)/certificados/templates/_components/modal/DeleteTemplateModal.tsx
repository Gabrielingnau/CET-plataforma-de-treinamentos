"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"
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
import { deleteTemplate } from "@/services/templates/template-service-client"

interface DeleteTemplateModalProps {
  template: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteTemplateModal({ template, open, onOpenChange }: DeleteTemplateModalProps) {
  const [confirmName, setConfirmName] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const onConfirmDelete = async () => {
    if (!template || confirmName !== template.titulo) return

    try {
      setIsDeleting(true)
      const result = await deleteTemplate(template.id, template.url_bucket, template.capa_url)

      if (result.type === "deactivated") {
        toast.warning("Template Desativado", {
          description: "Modelo em uso. Foi apenas desativado para novos treinamentos.",
          duration: 6000,
        })
      } else {
        toast.success("Template excluído permanentemente!")
      }

      router.refresh()
      onOpenChange(false)
    } catch (error) {
      toast.error("Erro na operação.")
    } finally {
      setIsDeleting(false)
      setConfirmName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isDeleting && onOpenChange(val)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle size={20} /> Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Se este template estiver em uso, ele será apenas desativado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <p className="text-sm">Confirme digitando <span className="font-bold italic">"{template?.titulo}"</span>:</p>
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder="Nome do template"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={confirmName !== template?.titulo || isDeleting}
          >
            {isDeleting ? "Processando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}