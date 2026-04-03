"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { login } from "@/services/auth/login"
import { handleLoginProfile } from "@/services/auth/handle-login-profile"
import { loginSchema, LoginFormData } from "@/types/forms/login-form"

export function useLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  })

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      // 1. Faz o Auth (E-mail e Senha)
      const authResponse = await login(data)
      
      if (!authResponse.user) throw new Error("Usuário não encontrado")

      // 2. Processa o Perfil (Role e Primeiro Login) via Service
      return await handleLoginProfile(authResponse.user.id)
    },
    onSuccess: () => {
      toast.success("Bem-vindo de volta!")
      router.replace("/")
      router.refresh()
    },
    onError: (error: any) => {
      setAuthError("E-mail ou senha incorretos.")
      toast.error(`Falha no login: ${error}`)
    },
  })

  const handleInputChange = () => {
    if (authError) setAuthError(null)
  }

  const togglePassword = () => setShowPassword((prev) => !prev)

  return {
    form,
    isPending,
    authError,
    showPassword,
    togglePassword,
    handleInputChange,
    onSubmit: form.handleSubmit((data) => loginUser(data)),
  }
}