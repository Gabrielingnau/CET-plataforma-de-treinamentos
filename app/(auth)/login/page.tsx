"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"

import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"

import { Eye, EyeOff } from "lucide-react"

import { login } from "@/services/auth/login"
import { supabase } from "@/lib/supabase/client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { loginSchema, LoginFormData } from "@/types/forms/login-form"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  })

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.replace("/")
      }
    }

    checkSession()
  }, [router])

  const { mutateAsync: loginUser, isPending } = useMutation({
    mutationFn: login,

    onSuccess: () => {
      toast.success("Login bem-sucedido!")
      router.replace("/")
      router.refresh()
    },

    onError: () => {
      setAuthError("Email ou senha inválidos")
      toast.error("Falha no login")
    },
  })

  async function onSubmit(data: LoginFormData) {
    setAuthError(null)
    await loginUser(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Acessar plataforma</h1>
          <p className="text-muted-foreground">
            Entre com suas credenciais
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              autoComplete="email"
              placeholder="email@email.com"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">

            <div className="flex items-center justify-between">
              <Label>Senha</Label>

              <Link
                href="/esqueceu-senha"
                className="text-sm text-muted-foreground hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <div className="relative">

              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}

            {authError && (
              <p className="text-sm text-destructive">{authError}</p>
            )}

          </div>

          <Button className="w-full" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>

        </form>

      </div>
    </div>
  )
}