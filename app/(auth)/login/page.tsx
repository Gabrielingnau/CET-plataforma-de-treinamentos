"use client"

import { Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useLogin } from "@/hooks/auth/use-login"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const { 
    form: { register, formState: { errors } }, 
    onSubmit, 
    isPending, 
    authError, 
    showPassword, 
    togglePassword, 
    handleInputChange 
  } = useLogin()

  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-4">
      {/* Cabeçalho - Usando 'primary' para o ícone e cores semânticas */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
          <ShieldCheck className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Acessar plataforma</h1>
          <p className="text-muted-foreground">Bem-vindo ao KYDORA. Digite seus dados abaixo.</p>
        </div>
      </div>

      {/* Alerta de Erro - Usando 'destructive' do tema */}
      {authError && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive animate-in fade-in zoom-in duration-200">
          <AlertCircle size={18} />
          <p className="font-medium">{authError}</p>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Campo E-mail */}
        <div className="space-y-2">
          <Label htmlFor="email" className="font-semibold text-sm">E-mail</Label>
          <Input
            id="email"
            placeholder="exemplo@email.com"
            {...register("email", { onChange: handleInputChange })}
            className={`h-12 rounded-xl border-input focus-visible:ring-primary ${
              errors.email ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
          {errors.email && (
            <p className="text-[12px] font-semibold text-destructive ml-1">{errors.email.message}</p>
          )}
        </div>

        {/* Campo Senha */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password text-sm" className="font-semibold text-sm">Senha</Label>
            <Link
              href="/esqueceu-senha"
              className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { onChange: handleInputChange })}
              className={`h-12 rounded-xl border-input pr-12 focus-visible:ring-primary ${
                errors.password ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[12px] font-semibold text-destructive ml-1">{errors.password.message}</p>
          )}
        </div>

        {/* Botão de Login - O variant 'default' já puxa o seu laranja automaticamente */}
        <Button 
          type="submit"
          className="h-12 w-full font-bold rounded-xl text-md transition-all shadow-lg shadow-primary/10 active:scale-[0.98]" 
          disabled={isPending}
        >
          {isPending ? "Autenticando..." : "Entrar na conta"}
        </Button>
      </form>
    </div>
  )
}