// _components/module-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { moduleSchema, ModuleFormData } from "@/types/forms/module-form";
import { createModule } from "@/services/modules/create-module";
import { updateModule } from "@/services/modules/update-module";

export function ModuleForm({ trainingId, defaultValues, onCancel, nextOrdem }: any) {
  const isEditing = !!defaultValues;
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ModuleFormData>({
    resolver: yupResolver(moduleSchema),
    defaultValues: defaultValues || {
      titulo: "",
      descricao: "",
      training_id: trainingId,
      ordem: nextOrdem
    }
  });

  const saveMutation = useMutation({
    mutationFn: (data: ModuleFormData) => {
      // LIMPEZA: Remove campos de relação (lessons) que o Supabase não aceita no update
      const { lessons, created_at, updated_at, ...cleanData } = data as any;
      return isEditing ? updateModule(defaultValues.id, cleanData) : createModule(cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-structure", trainingId] });
      toast.success(isEditing ? "Módulo atualizado" : "Módulo criado");
      onCancel();
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-5">
      <h3 className="text-xl font-bold border-b pb-4">{isEditing ? "Editar Módulo" : "Novo Módulo"}</h3>
      
      <div className="space-y-2">
        <Label>Título do Módulo</Label>
        <Input {...register("titulo")} />
        {errors.titulo && <p className="text-xs text-destructive">{errors.titulo.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Descrição</Label>
        <Input {...register("descricao")} />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Módulo"}
        </Button>
      </div>
    </form>
  );
}