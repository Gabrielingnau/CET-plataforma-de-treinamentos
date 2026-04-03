"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { sendResetPasswordEmail } from "@/services/auth/send-reset-email" // Caminho atualizado
import { ForgotPasswordData } from "@/types/forms/login-form"

export function useForgotPassword() {
  const [countdown, setCountdown] = useState(0)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<ForgotPasswordData>()

  // Lógica do contador para o botão de "Reenviar"
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const { mutate, isPending } = useMutation({
    mutationFn: (email: string) => sendResetPasswordEmail(email),
    onSuccess: () => {
      toast.success("Link enviado!", {
        description: "Verifique sua caixa de entrada e spam."
      })
      setCountdown(60) // Trava o reenvio por 60 segundos
      reset() // Limpa o campo de e-mail após o sucesso
    },
    onError: (error: any) => {
      // Tratamento para erro de "rate limit" do Supabase ou e-mail inválido
      const message = error.message === "To many requests" 
        ? "Muitas tentativas. Tente novamente em instantes." 
        : "Não foi possível enviar o link. Verifique o e-mail."
        
      toast.error(message)
    }
  })

  return {
    register,
    errors,
    isPending,
    countdown,
    // O usuário só pode clicar se não estiver pendente e o contador for 0
    canSend: !isPending && countdown === 0,
    onSubmit: handleSubmit((data) => mutate(data.email)),
  }
}