"use client";

import { useState, useContext } from "react"; // Adicionado useContext
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

// Contexto de Autenticação
import { AuthContext } from "@/contexts/auth-context"; 

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Tipagens e Service
import { trainingSchema, TrainingFormData } from "@/types/forms/training-form";
import { createTraining } from "@/services/trainings/create-training";

export function CreateTrainingForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useContext(AuthContext); // Pegando o usuário do contexto
  
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TrainingFormData>({
    resolver: yupResolver(trainingSchema),
    defaultValues: {
      pontuacao_aprovacao: 70,
      max_exam_tentativas: 3,
    },
  });

  const { mutateAsync: createTrainingFn } = useMutation({
    mutationFn: createTraining,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trainings"] });
      toast.success("Treinamento cadastrado com sucesso");
      // Próximo passo: Criar módulos
      router.push(`/treinamentos/novo/${data.id}/modulos/novo`);
    },
  });

  async function handleCreateTraining(data: TrainingFormData) {
    try {
      setErrorMessage(null);

      // Verificação de segurança: se não houver user, não deixa prosseguir
      if (!user?.id) {
        toast.error("Você precisa estar logado para criar um treinamento");
        return;
      }

      // Injetamos o ID do usuário no payload que vai para o Supabase/API
      await createTrainingFn({
        ...data,
        criado_por: user.id, // O campo que você solicitou
      });
      
      reset();
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.data) {
        const errorData = err.response.data as { errors?: string[] };
        setErrorMessage(errorData.errors?.[0] || "Erro desconhecido do servidor");
      } else {
        setErrorMessage(err.message || "Erro inesperado");
      }
      toast.error("Falha ao salvar treinamento");
    }
  }

  return (
    <form onSubmit={handleSubmit(handleCreateTraining)} className="space-y-6">
      {errorMessage && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* URL da Capa */}
      <div className="space-y-2">
        <Label htmlFor="cover_url">URL da Capa</Label>
        <Input
          id="cover_url"
          placeholder="https://exemplo.com/foto.jpg"
          required={!!errors.cover_url?.message}
          {...register("cover_url")}
        />
        {errors.cover_url?.message && (
          <p className="text-sm text-destructive">{errors.cover_url?.message}</p>
        )}
      </div>

      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="titulo">Título do Treinamento</Label>
        <Input
          id="titulo"
          required={!!errors.titulo?.message}
          {...register("titulo")}
        />
        {errors.titulo?.message && (
          <p className="text-sm text-destructive">{errors.titulo?.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          className="min-h-[100px]"
          required={!!errors.descricao?.message}
          {...register("descricao")}
        />
        {errors.descricao?.message && (
          <p className="text-sm text-destructive">{errors.descricao?.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Carga Horária - Note que usei carga_Horaria (H maiúsculo) se seu schema exigir */}
        <div className="space-y-2">
          <Label htmlFor="carga_Horaria">Carga Horária</Label>
          <Input
            id="carga_Horaria"
            placeholder="Ex: 20h"
            required={!!errors.carga_horaria?.message}
            {...register("carga_horaria")}
          />
          {errors.carga_horaria?.message && (
            <p className="text-sm text-destructive">
              {errors.carga_horaria?.message}
            </p>
          )}
        </div>

        {/* Pontuação Mínima */}
        <div className="space-y-2">
          <Label htmlFor="pontuacao_aprovacao">Mínimo para Aprovação</Label>
          <Input
            id="pontuacao_aprovacao"
            type="number"
            required={!!errors.pontuacao_aprovacao?.message}
            {...register("pontuacao_aprovacao")}
          />
          {errors.pontuacao_aprovacao?.message && (
            <p className="text-sm text-destructive">
              {errors.pontuacao_aprovacao?.message}
            </p>
          )}
        </div>

        {/* Tentativas Máximas */}
        <div className="space-y-2">
          <Label htmlFor="max_exam_tentativas">Máximo de Tentativas</Label>
          <Input
            id="max_exam_tentativas"
            type="number"
            required={!!errors.max_exam_tentativas?.message}
            {...register("max_exam_tentativas")}
          />
          {errors.max_exam_tentativas?.message && (
            <p className="text-sm text-destructive">
              {errors.max_exam_tentativas?.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || !user}>
        {isSubmitting ? "Cadastrando..." : "Criar Treinamento"}
      </Button>
    </form>
  );
}