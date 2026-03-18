"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, FileText, Layout } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useContext } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"

import { yupResolver } from "@hookform/resolvers/yup"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { AuthContext } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { uploadFile } from "@/services/storage/upload-file"
import { trainingSchema } from "@/types/forms/training-form"
import { createTraining } from "@/services/trainings/create-training"
import { supabase } from "@/lib/supabase/client" // Certifique-se de importar seu client do supabase

export function CreateTrainingForm() {
  const [isUploading, setIsUploading] = useState(false)
  const { user } = useContext(AuthContext)
  const queryClient = useQueryClient()
  const router = useRouter()

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

  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting, errors },
  } = useForm<any>({
    resolver: yupResolver(trainingSchema),
    defaultValues: {
      pontuacao_aprovacao: 70,
      max_exam_tentativas: 3,
    },
  })

  async function handleCreateTraining(data: any) {
    try {
      if (!user?.id) return toast.error("Você precisa estar logado.")
      setIsUploading(true)

      let finalCoverUrl = ""

      if (data.cover_url && data.cover_url[0]) {
        finalCoverUrl = await uploadFile(data.cover_url[0], "imagem")
      }

      const payload = {
        ...data,
        cover_url: finalCoverUrl,
        criado_por: user.id,
        // Garante que o template_id seja enviado como número ou null
        template_id: data.template_id ? Number(data.template_id) : null,
      }

      const result = await createTraining(payload)
      queryClient.invalidateQueries({ queryKey: ["trainings"] })
      toast.success("Treinamento criado com sucesso!")
      router.push(`/treinamentos/novo/${result.id}/modulos/novo`)
    } catch (error) {
      console.error(error)
      toast.error("Falha ao criar treinamento.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleCreateTraining)} className="space-y-6">
      <div className="flex flex-col gap-6 items-start md:flex-row">
        {/* Imagem de Capa */}
        <div className="space-y-2">
          <Label>Imagem de Capa (Upload)</Label>
          <Input type="file" accept="image/*" {...register("cover_url")} />
          {errors.cover_url && (
            <p className="text-xs font-medium text-destructive">
              {errors.cover_url.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center h-3.5  text-sm font-semibold">
            <Layout size={14} className="text-primary" />
            Template do Certificado
          </Label>

          <Controller
            name="template_id"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={`h-12 border-2 transition-all ${errors.template_id ? "border-destructive bg-destructive/5" : "border-input focus:border-primary m-0"}`}
                >
                  <SelectValue placeholder="Selecione o modelo do certificado" />
                </SelectTrigger>

                <SelectContent className="rounded-xl border-primary/10 shadow-2xl mt-22">
                  <div className="p-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Modelos Disponíveis
                  </div>
                  {templates
                    .filter((t) => t.ativo)
                    .map((t: any) => (
                      <SelectItem
                        key={t.id}
                        value={t.id.toString()}
                        className="mb-1 cursor-pointer rounded-lg border border-transparent transition-colors focus:border-primary/20 focus:bg-primary/5"
                      >
                        <div className="flex items-center gap-4 py-1">
                          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md border bg-muted shadow-inner">
                            {t.capa_url ? (
                              <Image
                                src={t.capa_url}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <FileText size={16} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-foreground">
                              {t.titulo}
                            </span>
                            <span className="line-clamp-1 text-[11px] text-muted-foreground italic">
                              {t.descricao || "Sem descrição"}
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
            <p className="flex animate-pulse items-center gap-1 text-[11px] font-bold text-destructive">
              <AlertTriangle size={12} /> {errors.template_id.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <Label>Título do Treinamento</Label>
        <Input
          {...register("titulo")}
          placeholder="Ex: Treinamento de Vendas"
        />
        {errors.titulo && (
          <p className="text-xs font-medium text-destructive">
            {errors.titulo.message as string}
          </p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label>Descrição Completa</Label>
        <Textarea
          {...register("descricao")}
          placeholder="Descreva os objetivos do treinamento..."
        />
        {errors.descricao && (
          <p className="text-xs font-medium text-destructive">
            {errors.descricao.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Carga Horária */}
        <div className="space-y-2">
          <Label>Carga Horária</Label>
          <Input {...register("carga_horaria")} placeholder="Ex: 20h" />
          {errors.carga_horaria && (
            <p className="text-xs font-medium text-destructive">
              {errors.carga_horaria.message as string}
            </p>
          )}
        </div>

        {/* Pontuação */}
        <div className="space-y-2">
          <Label>Min. p/ Aprovação (%)</Label>
          <Input type="number" {...register("pontuacao_aprovacao")} />
          {errors.pontuacao_aprovacao && (
            <p className="text-xs font-medium text-destructive">
              {errors.pontuacao_aprovacao.message as string}
            </p>
          )}
        </div>

        {/* Tentativas */}
        <div className="space-y-2">
          <Label>Máx. Tentativas Prova</Label>
          <Input type="number" {...register("max_exam_tentativas")} />
          {errors.max_exam_tentativas && (
            <p className="text-xs font-medium text-destructive">
              {errors.max_exam_tentativas.message as string}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || isUploading}
      >
        {isSubmitting || isUploading ? "Processando..." : "Criar e Continuar"}
      </Button>
    </form>
  )
}
