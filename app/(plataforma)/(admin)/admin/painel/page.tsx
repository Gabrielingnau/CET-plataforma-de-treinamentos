"use client"

import Link from "next/link"
import {
  Users,
  Building2,
  Trophy,
  Zap,
  ArrowRight,
  Loader2,
  RefreshCw,
  Activity,
} from "lucide-react"
import { useAdminMain } from "@/hooks/dashboard/admin/use-admin-main"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  const { data, isLoading, isRefreshing, refresh } = useAdminMain()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="animate-pulse text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">
          Carregando...
        </p>
      </div>
    )
  }

  const stats = [
    {
      label: "Total Alunos",
      value: data?.stats.totalColaboradores,
      icon: Users,
      color: "text-sky-500",
    },
    {
      label: "Empresas",
      value: data?.stats.empresasAtivas,
      icon: Building2,
      color: "text-orange-500",
    },
    {
      label: "Certificados",
      value: data?.stats.totalCertificados,
      icon: Trophy,
      color: "text-emerald-500",
    },
    {
      label: "Taxa Geral",
      value: `${data?.stats.taxaAprovacaoGeral}%`,
      icon: Zap,
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="min-h-screen animate-in space-y-10 bg-background px-2 duration-500 fade-in sm:px-6 text-foreground">
      {/* HEADER COMPACTO */}
      <header className="flex flex-col justify-between gap-6 border-b border-border py-6 md:flex-row md:items-end">
        <div className="max-w-full md:max-w-2xl">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic md:text-5xl truncate">
            Painel <span className="text-primary">Central</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shrink-0" />
            <p className="text-[9px] font-black tracking-[0.3em] text-muted-foreground uppercase truncate">
              Análises do sistema
            </p>
          </div>
        </div>
        <Button
          onClick={refresh}
          disabled={isRefreshing}
          variant="outline"
          className="h-12 rounded-xl border-border bg-card px-6 text-[10px] font-black tracking-widest uppercase italic transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
        >
          {isRefreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          recarregar
        </Button>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative rounded-[2rem] border border-border bg-card/50 p-6 transition-all hover:border-primary/30"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="rounded-2xl border border-border bg-muted p-3 transition-colors group-hover:text-primary shrink-0">
                <s.icon className={cn("h-5 w-5", s.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black tracking-widest text-muted-foreground uppercase truncate">
                  {s.label}
                </p>
                <h3 className="text-2xl font-black tracking-tighter italic truncate">
                  {s.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SEÇÃO DE EMPRESAS EM GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-muted-foreground uppercase italic truncate mr-4">
            <Activity className="h-4 w-4 text-primary shrink-0" /> Performance por empresa
          </h2>
          <span className="text-[9px] font-bold text-muted-foreground uppercase italic shrink-0">
            Total: {data?.rankingEmpresas.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.rankingEmpresas.map((emp) => (
            <Link
              key={emp.id}
              href={`/admin/painel/companies/${emp.id}`}
              className="group relative flex flex-col overflow-hidden rounded-[1.8rem] border border-border bg-card/30 p-5 transition-all hover:border-primary/50 hover:bg-accent/50"
            >
              {/* Topo do Card */}
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={cn(
                    "rounded-lg border px-3 py-1 text-[10px] font-black italic",
                    emp.statusSaude === "critico"
                      ? "border-destructive/20 bg-destructive/10 text-destructive"
                      : emp.statusSaude === "atencao"
                        ? "border-orange-500/20 bg-orange-500/10 text-orange-500"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                  )}
                >
                  {emp.mediaProgresso}%
                </div>
                <ArrowRight
                  size={14}
                  className="text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>

              {/* Info Meio */}
              <div className="space-y-1 min-w-0">
                <h4 className="truncate text-[12px] leading-tight font-black uppercase italic transition-colors group-hover:text-primary">
                  {emp.nome}
                </h4>
                <p className="text-[9px] font-bold text-muted-foreground uppercase truncate">
                  {emp.totalAlunos} Colaboradores
                </p>
              </div>

              {/* Mini Barra de Progresso */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-muted">
                <div
                  className={cn(
                    "h-full transition-all duration-1000",
                    emp.statusSaude === "critico"
                      ? "bg-destructive"
                      : emp.statusSaude === "atencao"
                        ? "bg-orange-500"
                        : "bg-emerald-500"
                  )}
                  style={{ width: `${emp.mediaProgresso}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}