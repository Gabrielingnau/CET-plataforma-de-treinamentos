"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Edit, Layout, AlertTriangle, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"

import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateTraining } from "@/services/trainings/update-training"
import { trainingSchema, TrainingFormData } from "@/types/forms/training-form"
import { supabase } from "@/lib/supabase/client"

export function EditTrainingModal({ training }: { training: any }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Busca os templates ativos para o Select
  const { data: templates = [] } = useQuery({
    queryKey: ["templates-ativos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificate_templates")
        .select("*")
        .eq("ativo", true)
      if (error) throw error
      return data
    },
  })

  // RESOLUÇÃO DE TIPAGEM: Criamos os valores iniciais formatados
  const formattedDefaultValues: TrainingFormData = {
    titulo: training.titulo ?? "",
    descricao: training.descricao ?? "",
    cover_url: training.cover_url ?? "",
    carga_horaria: training.carga_horaria ?? "",
    pontuacao_aprovacao: Number(training.pontuacao_aprovacao) || 0,
    max_exam_tentativas: Number(training.max_exam_tentativas) || 1,
    // Converte o number | null do banco para string exigida pelo Yup/Select
    template_id: training.template_id ? String(training.template_id) : "",
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<TrainingFormData>({
    resolver: yupResolver(trainingSchema),
    defaultValues: formattedDefaultValues,
  })

  const mutation = useMutation({
    mutationFn: async (data: TrainingFormData) => {
      // Criamos o objeto de envio convertendo os tipos para o que o SERVIÇO espera
      const payload = {
        ...data,
        template_id: data.template_id ? Number(data.template_id) : null,
      } as any // Usamos 'as any' aqui para evitar o conflito com a interface Partial<TrainingFormData>

      return updateTraining(training.id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-structure", training.id],
      })
      toast.success("Treinamento atualizado!")
      setOpen(false)
    },
    onError: (err: any) => {
      console.error(err)
      toast.error("Erro ao atualizar treinamento")
    },
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
          {/* Campo de Template de Certificado */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
              <ShieldCheck size={16} className="text-primary" />
              Template do Certificado
            </Label>
            <Controller
              name="template_id"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger
                    className={`h-14 border-2 transition-all ${
                      errors.template_id
                        ? "border-destructive bg-destructive/5"
                        : "border-input"
                    }`}
                  >
                    <SelectValue placeholder="Selecione o layout do certificado" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl mt-24">
                    <div className="mb-1 border-b px-3 py-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                      Modelos Disponíveis
                    </div>
                    {templates.map((t: any) => (
                      <SelectItem
                        key={t.id}
                        value={t.id.toString()}
                        className="cursor-pointer rounded-lg py-3 transition-colors focus:bg-primary/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border bg-muted shadow-sm">
                            {t.capa_url ? (
                              <Image
                                src={t.capa_url}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Layout size={14} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="mb-1 text-sm leading-none font-bold text-foreground">
                              {t.titulo}
                            </span>
                            <span className="line-clamp-1 text-[10px] tracking-wider text-muted-foreground uppercase italic">
                              {t.descricao}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.template_id && (
              <p className="mt-1 flex animate-pulse items-center gap-1 text-[11px] font-bold text-destructive">
                <AlertTriangle size={12} /> {errors.template_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Título</Label>
            <Input {...register("titulo")} />
            {errors.titulo && (
              <p className="text-xs text-destructive">
                {errors.titulo.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea {...register("descricao")} rows={4} />
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
            <Label>URL da Capa (Imagem)</Label>
            <Input {...register("cover_url")} placeholder="https://..." />
            {errors.cover_url && (
              <p className="text-xs text-destructive">
                {errors.cover_url.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
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
