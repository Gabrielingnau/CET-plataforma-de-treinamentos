"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Edit } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { updateTraining } from "@/services/trainings/update-training"
import { trainingSchema, TrainingFormData } from "@/types/forms/training-form"

export function EditTrainingModal({ training }: { training: any }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TrainingFormData>({
    resolver: yupResolver(trainingSchema),
    defaultValues: {
      titulo: training.titulo,
      descricao: training.descricao,
      cover_url: training.cover_url,
      carga_horaria: training.carga_horaria,
      pontuacao_aprovacao: training.pontuacao_aprovacao,
      max_exam_tentativas: training.max_exam_tentativas,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: Partial<TrainingFormData>) =>
      updateTraining(training.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-structure", training.id],
      })
      // Também precisamos invalidar a query que busca o treinamento específico se houver uma
      window.location.reload() // Recarrega para atualizar o header com os novos dados
      toast.success("Treinamento atualizado!")
      setOpen(false)
    },
    onError: () => toast.error("Erro ao atualizar treinamento"),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit size={16} />{" "}
          <span className="hidden sm:inline">Editar Treinamento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Informações do Treinamento</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => mutation.mutateAsync(data))}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label>Título</Label>
            <Input {...register("titulo")} />
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea {...register("descricao")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Carga Horária</Label>
              <Input {...register("carga_horaria")} />
            </div>
            <div className="space-y-2">
              <Label>Mínimo para Aprovação (%)</Label>
              <Input type="number" {...register("pontuacao_aprovacao")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>URL da Capa</Label>
            <Input {...register("cover_url")} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
