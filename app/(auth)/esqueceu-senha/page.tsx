"use client"

import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useMutation } from "@tanstack/react-query"
import { sendResetPasswordEmail } from "@/services/auth/reset-password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

type FormData = {
  email: string
}

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm<FormData>()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormData) => sendResetPasswordEmail(data.email),

    onSuccess: () => {
      toast.success("Email de recuperação enviado!")
    },

    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  async function onSubmit(data: FormData) {
    await mutateAsync(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-3xl font-bold">Recuperar senha</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input {...register("email")} />
          </div>

          <Button className="w-full" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar email"}
          </Button>
        </form>
        <Button variant="link" asChild className="text-start">
          <Link href="/login">Voltar para o login</Link>
        </Button>
      </div>
    </div>
  )
}
