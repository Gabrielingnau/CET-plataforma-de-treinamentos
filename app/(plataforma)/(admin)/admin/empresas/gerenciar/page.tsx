import { Building2, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import { CompanyTable } from "./_components/company-table"

export default function VisualizarTodosClientesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 animate-in fade-in duration-700 text-left md:px-6">
         <header className="flex-col justify-between flex gap-6 border-b pb-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-primary uppercase italic">
            <Building2 size={12} /> Ecosystem Management
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic md:text-5xl">
            Instituições <span className="text-primary">Parceiras</span>
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Gerenciamento centralizado de unidades e acessos
          </p>
        </div>
        
        <Link href="/admin/empresas/novo">
          <Button className="h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/10 transition-all active:scale-95">
            <Plus size={18} className="mr-2 stroke-[3]" /> Novo Cliente
          </Button>
        </Link>
      </header>

      {/* O container da tabela agora é neutro, herdando o tema do sistema */}
      <div className="overflow-hidden rounded-[2rem] border shadow-2xl">
          <CompanyTable />
      </div>
    </div>
  )
}