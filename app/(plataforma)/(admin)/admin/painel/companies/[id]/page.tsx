"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  User,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Building2,
} from "lucide-react"
import { useCompanyDetails } from "@/hooks/dashboard/admin/use-company-details"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function CompanyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data, isLoading, isRefreshing, refresh } = useCompanyDetails(
    params.id as string
  )

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen animate-in space-y-8 bg-background p-4 duration-500 fade-in md:p-10 text-foreground">
      {/* NAVEGAÇÃO / HEADER */}
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="w-fit p-0 text-[10px] font-black tracking-widest text-muted-foreground uppercase italic hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Voltar ao Dashboard
        </Button>

        <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
          <div className="space-y-2 max-full">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary shrink-0" />
              <h1 className="text-4xl font-black tracking-tighter uppercase italic md:text-5xl">
                {data?.company.nome}
              </h1>
            </div>
            <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase truncate">
              CNPJ: {data?.company.cnpj} • Empresa ID: #{data?.company.id}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="border-r border-border pr-4 text-right">
              <p className="text-[9px] font-black text-muted-foreground uppercase italic">
                Média Engajamento
              </p>
              <p className="text-2xl font-black text-primary italic">
                {data?.company.media_engajamento}%
              </p>
            </div>
            <Button
              onClick={refresh}
              disabled={isRefreshing}
              variant="outline"
              className="h-12 rounded-xl border-border bg-card px-6 text-[10px] font-black tracking-widest uppercase italic transition-all hover:bg-accent hover:text-accent-foreground"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* LISTA DE FUNCIONÁRIOS (TABELA INDUSTRIAL) */}
      <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card/50">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 p-8">
          <h2 className="flex items-center gap-2 text-[12px] font-black tracking-widest uppercase italic">
            <User className="h-4 w-4 text-primary" /> Quadro de Colaboradores
          </h2>
          <span className="text-[10px] font-bold text-muted-foreground uppercase italic">
            Total: {data?.employees.length} membros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border text-[10px] font-black tracking-widest text-muted-foreground uppercase italic">
                <th className="px-8 py-6">Colaborador</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center">Progresso</th>
                <th className="px-8 py-6 text-center">Treinamentos</th>
                <th className="px-8 py-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data?.employees.map((emp) => (
                <tr
                  key={emp.user_id}
                  className="group transition-colors hover:bg-muted/40"
                >
                  <td className="px-8 py-6 max-w-[250px]">
                    <div className="flex flex-col">
                      <span className="text-sm font-black uppercase italic transition-colors group-hover:text-primary truncate">
                        {emp.nome}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground truncate">
                        {emp.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-black uppercase italic",
                        emp.status === "risco" || emp.status === "bloqueado"
                          ? "border-destructive/20 bg-destructive/10 text-destructive"
                          : emp.status === "em_curso"
                            ? "border-orange-500/20 bg-orange-500/10 text-orange-500"
                            : emp.status === "concluido"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                              : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      {emp.status === "risco" && <AlertTriangle size={10} />}
                      {emp.status === "concluido" && <CheckCircle2 size={10} />}
                      {emp.status === "em_curso" && <Clock size={10} />}
                      {emp.status}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-black italic">
                        {emp.progresso_medio}%
                      </span>
                      <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all duration-700"
                          style={{ width: `${emp.progresso_medio}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-black text-muted-foreground italic">
                      {emp.treinamentos_ativos} treinamentos
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link href={`/admin/painel/users/${emp.user_id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 rounded-xl bg-muted/50 transition-all hover:bg-primary hover:text-primary-foreground"
                      >
                        <ExternalLink size={16} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}