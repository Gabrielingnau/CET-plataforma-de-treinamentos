"use client"

import { FileQuestion, ArrowLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        {/* Efeito de brilho ao fundo do ícone */}
        <div className="absolute inset-0 translate-y-4 scale-150 bg-primary/20 blur-[80px]" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-border bg-card/50 backdrop-blur-xl">
          <FileQuestion size={48} className="text-primary" />
        </div>
      </div>

      <h1 className="text-5xl font-bold tracking-tighter text-foreground sm:text-6xl">
        404
      </h1>
      <h2 className="mt-4 text-xl font-semibold text-foreground/80">
        Página não encontrada
      </h2>
      <p className="mt-2 max-w-[400px] text-muted-foreground">
        O conteúdo que você está procurando não existe ou foi movido para outro endereço.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="h-12 rounded-2xl border-border px-8 font-semibold transition-all hover:bg-muted"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        <Button
          onClick={() => router.push("/")}
          className="h-12 rounded-2xl bg-primary px-8 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
        >
          <Home className="mr-2 h-4 w-4" /> Ir para Home
        </Button>
      </div>
    </main>
  )
}