"use client"

import { ShieldAlert, Lock, Home, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 translate-y-4 scale-150 bg-destructive/20 blur-[80px]" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-destructive/20 bg-card/50 backdrop-blur-xl">
          <ShieldAlert size={48} className="text-destructive" />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center mb-2">
         <Lock size={16} className="text-destructive" />
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive">
            Acesso Restrito
         </span>
      </div>

      <h1 className="text-4xl font-bold tracking-tighter text-foreground">
        Acesso Negado
      </h1>
      <p className="mt-4 max-w-[450px] text-muted-foreground">
        Você não tem as permissões necessárias para visualizar esta página. 
        Certifique-se de estar logado com uma conta de administrador.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="h-12 rounded-2xl text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        <Button
          onClick={() => router.push("/")}
          className="h-12 rounded-2xl bg-primary px-10 font-bold transition-all active:scale-95"
        >
          <Home className="mr-2 h-4 w-4" /> Voltar para o Início
        </Button>
      </div>
    </main>
  )
}