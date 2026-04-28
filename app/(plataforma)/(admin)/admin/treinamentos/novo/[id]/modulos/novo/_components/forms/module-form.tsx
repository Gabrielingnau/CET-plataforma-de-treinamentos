"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { LayoutGrid, Loader2, Save, X } from "lucide-react"

import { useModuleForm } from "@/hooks/modules/use-module-form"
import { DeleteConfirmModal } from "../modal/delete-confirm-modal"

export function ModuleForm(props: any) {
  const {
    register,
    errors,
    isPending,
    isDeleting,
    isEditing,
    handleDelete,
    onSubmit,
  } = useModuleForm(props)

  return (
    <div className="bg-card animate-in fade-in zoom-in rounded-xl border p-6 shadow-md duration-200">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-2">
          <div className="space-y-1">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <LayoutGrid size={18} className="text-primary" />
              {isEditing ? "Editar Módulo" : "Novo Módulo"}
            </h3>
            <p className="text-muted-foreground text-xs">
              Organize a estrutura do treinamento
            </p>
          </div>

          {isEditing && (
            <DeleteConfirmModal
              title={props.defaultValues?.titulo}
              onConfirm={handleDelete}
              isLoading={isDeleting}
            />
          )}
        </div>

        <Separator />

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="space-y-2 md:col-span-4">
            <Label>Título do Módulo</Label>
            <Input
              {...register("titulo")}
              placeholder="Ex: Introdução ao Treinamento"
              className={cn(errors.titulo && "border-destructive")}
            />
            {errors.titulo && (
              <p className="text-destructive text-[10px] font-medium uppercase">
                {errors.titulo.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="block md:text-center">Ordem</Label>
            <Input
              type="number"
              {...register("ordem")}
              className="text-center font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Descrição</Label>
          <Input
            {...register("descricao")}
            placeholder="Resumo do que será ensinado"
            className={cn(errors.descricao && "border-destructive")}
          />
          {errors.descricao && (
            <p className="text-destructive text-[10px] font-medium uppercase">
              {errors.descricao.message as string}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
          <Button type="button" variant="ghost" onClick={props.onCancel}>
            <X size={16} className="mr-2" /> Descartar
          </Button>

          <Button
            type="submit"
            disabled={isPending || isDeleting}
            className="min-w-30"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Save size={18} className="mr-2" />
                {isEditing ? "Salvar" : "Criar Módulo"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
