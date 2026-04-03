// VisualizarTreinamentosPage.tsx
import { Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { TrainingsView } from "./_components/training-view"

export default function VisualizarTreinamentosPage() {
  return (
    <main className="container mx-auto max-w-7xl sm:px-6 px-2 py-10">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Meus Treinamentos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie o conteúdo, módulos e aulas dos seus treinamentos
            corporativos.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="rounded-2xl font-bold transition-all active:scale-[0.98]"
        >
          <Link href="/admin/treinamentos/novo">
            <Plus className="mr-2 h-5 w-5" /> Novo Treinamento
          </Link>
        </Button>
      </div>

      <TrainingsView />
    </main>
  )
}