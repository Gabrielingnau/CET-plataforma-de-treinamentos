"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateTemplate } from "@/services/templates/template-service-client"

interface UpdateTemplateModalProps {
  template: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateTemplateModal({ template, open, onOpenChange }: UpdateTemplateModalProps) {
  const router = useRouter()
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    if (template) {
      reset({
        titulo: template.titulo,
        descricao: template.descricao
      })
    }
  }, [template, reset])

  const onSubmit = async (data: any) => {
    try {
      await updateTemplate(template.id, data)
      toast.success("Template atualizado com sucesso!")
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      toast.error("Erro ao atualizar template.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input {...register("titulo")} placeholder="Nome do modelo" required />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea {...register("descricao")} placeholder="Breve descrição" required />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}