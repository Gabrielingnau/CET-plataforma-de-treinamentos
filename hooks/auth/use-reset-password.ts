"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { updatePassword } from "@/services/auth/reset-password"
import { resetPasswordSchema, ResetPasswordData } from "@/types/forms/login-form"
import { supabase } from "@/lib/supabase/client"
import { handleResetProfile } from "@/services/auth/handle-reset-profile"

export function useResetPassword() {
  const router = useRouter()
  const [isSamePasswordError, setIsSamePasswordError] = useState(false)
  
  const form = useForm<ResetPasswordData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })
  
  const password = form.watch("password", "")
  const confirmPassword = form.watch("confirmPassword", "")

  // Regras visuais para feedback em tempo real
  const rules = [
    { label: "Mínimo de 6 caracteres", valid: password.length >= 6 },
    { label: "Pelo menos um número", valid: /\d/.test(password) },
    { label: "As senhas coincidem", valid: password === confirmPassword && password !== "" }
  ]

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      setIsSamePasswordError(false)

      // 1. Usa o service para atualizar a senha no Auth
      await updatePassword(data.password)

      // 2. Busca o usuário atual para atualizar o perfil
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não encontrado.")

      // 3. Usa o service de perfil que criamos para limpar o 'primeiro_login'
      // Se o service handleLoginProfile já faz o update de primeiro_login, usamos ele.
      return await handleResetProfile(user.id)
    },
    onSuccess: () => {
      toast.success("Senha atualizada com sucesso!")
      router.replace("/")
      router.refresh()
    },
    onError: (err: any) => {
      // Tratamento específico para senha igual à anterior
      if (err.message?.toLowerCase().includes("different") || err.status === 422) {
        setIsSamePasswordError(true)
        toast.error("A nova senha deve ser diferente da atual.")
      } else {
        toast.error(err.message || "Erro ao atualizar senha")
      }
    }
  })

  return {
    form,
    rules,
    isPending,
    isSamePasswordError,
    allRulesValid: rules.every(r => r.valid),
    onSubmit: form.handleSubmit((data) => mutate(data)),
  }
}