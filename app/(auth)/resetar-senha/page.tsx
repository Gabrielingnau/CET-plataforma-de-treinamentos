"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FormData = {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const { mutateAsync: updatePassword, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      if (data.password !== data.confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) throw error
    },
    onSuccess: async () => {
      toast.success("Senha atualizada com sucesso!")
      await supabase.auth.signOut()
      router.replace("/login")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const handleBackToLogin = async () => {
    // Limpa a sessão temporária criada pelo link do email
    await supabase.auth.signOut()
    router.replace("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Redefinir Senha</h1>
          <p className="text-sm text-muted-foreground">
            Escolha uma nova senha segura.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((d) => updatePassword(d))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <span className="text-xs text-red-500">Mínimo 6 caracteres</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", { required: true })}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Atualizar Senha"}
          </Button>
        </form>
        <Button
          type="button"
          variant="link"
          className="text-start"
          onClick={handleBackToLogin}
        >

          Cancelar e voltar para o login
        </Button>
      </div>
    </div>
  )
}
