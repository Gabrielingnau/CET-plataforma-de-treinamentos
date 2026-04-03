"use client"

import { KeyRound, ArrowLeft, Mail, Clock } from "lucide-react"
import Link from "next/link"
import { useForgotPassword } from "@/hooks/auth/use-forgot-password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const { register, errors, isPending, countdown, onSubmit } = useForgotPassword()

  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-4">
      {/* Branding e Título */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
          <KeyRound className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Recuperar senha</h1>
          <p className="text-muted-foreground text-sm">
            Enviaremos um link de recuperação para o seu e-mail institucional.
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-semibold text-sm">
            E-mail Institucional
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              id="email"
              {...register("email", { required: "O e-mail é obrigatório" })} 
              placeholder="seu@email.com" 
              className={`h-12 pl-12 rounded-xl border-input focus-visible:ring-primary ${
                errors.email ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[12px] font-semibold text-destructive ml-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Botão de Ação - Usando cores do tema primário */}
        <Button 
          type="submit"
          className="h-12 w-full font-bold rounded-xl text-md transition-all shadow-lg shadow-primary/10 active:scale-[0.98] flex items-center justify-center gap-2" 
          disabled={isPending || countdown > 0}
        >
          {isPending ? (
            "Enviando..."
          ) : countdown > 0 ? (
            <>
              <Clock className="w-5 h-5 animate-pulse" />
              Aguarde {countdown}s
            </>
          ) : (
            "Enviar link de recuperação"
          )}
        </Button>
      </form>

      {/* Voltar ao Login */}
      <div className="text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}