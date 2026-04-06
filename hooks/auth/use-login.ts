"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { login } from "@/services/auth/login"
import { loginSchema, LoginFormData } from "@/types/forms/login-form"

export function useLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  })

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      setAuthError(null)
      
      // Chamada simplificada: se der erro no Supabase, o service dá o 'throw'
      const authData = await login(data)
      
      // Verificação de segurança para o TS
      if (!authData?.user) {
        throw new Error("Usuário não encontrado")
      }

      return authData
    },
    onSuccess: () => {
      // 1. Trava o botão imediatamente para evitar cliques extras durante o delay do Next.js
      setIsRedirecting(true) 
      toast.success("Bem-vindo de volta!")
      
      // 2. Redireciona limpando o histórico (usuário não volta pro login ao clicar em 'voltar')
      router.replace("/")
      
      // 3. Força o Next.js a revalidar o Middleware no servidor para aplicar o RBAC
      router.refresh()
    },
    onError: (error: any) => {
      setIsRedirecting(false)
      
      // Tradução amigável da mensagem de erro do Supabase
      const message = error.message === "Invalid login credentials" 
        ? "E-mail ou senha incorretos." 
        : "Ocorreu um erro ao acessar a conta."
        
      setAuthError(message)
      toast.error(message)
    },
  })

  const handleInputChange = () => {
    if (authError) setAuthError(null)
  }

  const togglePassword = () => setShowPassword((prev) => !prev)

  return {
    form,
    // Garante que o botão fique desabilitado até a página realmente mudar
    isPending: isPending || isRedirecting, 
    authError,
    showPassword,
    togglePassword,
    handleInputChange,
    onSubmit: form.handleSubmit((data) => loginUser(data)),
  }
}