"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BookOpen,
  Building2,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  ShieldCheck,
  UserCircle2,
  UserPlus2,
  Users2,
  X,
} from "lucide-react"
import Link from "next/link"

import Loading from "@/app/loading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCompanyTable } from "@/hooks/companies/use-company-table"
import { cn } from "@/lib/utils"

import { EmptyState } from "./empty-state"
import { DeleteCompanyModal } from "./modal/delete-company-modal"
import { EditCompanyModal } from "./modal/edit-company-modal"
import { TablePagination } from "./table-pagination"

export function CompanyTable() {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    paginatedData,
    isLoading,
    nextPage,
    prevPage,
  } = useCompanyTable()

  if (isLoading) return <Loading />

  return (
    <div className="flex h-full flex-col">
      {/* HEADER DE BUSCA */}
      <div className="bg-muted/10 border-b p-6">
        <div className="group relative w-full md:max-w-md">
          <Search
            className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 -translate-y-1/2 transition-colors"
            size={18}
          />
          <Input
            placeholder="Buscar por nome, CNPJ ou gestor..."
            className="focus-visible:ring-primary/20 h-11 rounded-xl pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X
              size={14}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
              onClick={() => setSearchTerm("")}
            />
          )}
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO (TABELA OU EMPTY STATE) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {paginatedData.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 flex flex-1 items-center justify-center p-12 duration-300">
            <EmptyState />
          </div>
        ) : (
          <>
            <div className="custom-scrollbar max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-md">
                  <TableRow className="border-b hover:bg-transparent">
                    <TableHead className="text-muted-foreground px-6 py-4 text-[10px] font-black tracking-widest uppercase">
                      Instituição
                    </TableHead>
                    <TableHead className="text-muted-foreground text-left text-[10px] font-black tracking-widest uppercase">
                      Gestão / Responsáveis
                    </TableHead>
                    <TableHead className="text-muted-foreground text-left text-[10px] font-black tracking-widest uppercase">
                      Contato Principal
                    </TableHead>
                    <TableHead className="text-muted-foreground text-center text-[10px] font-black tracking-widest uppercase">
                      Métricas
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 text-right text-[10px] font-black tracking-widest uppercase">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedData.map((empresa) => (
                    <CompanyRow key={empresa.id} empresa={empresa} />
                  ))}
                </TableBody>
              </Table>
            </div>

            <TablePagination
              current={currentPage}
              total={totalPages}
              next={nextPage}
              prev={prevPage}
            />
          </>
        )}
      </div>
    </div>
  )
}

function CompanyRow({ empresa }: { empresa: any }) {
  const gestoresCount = empresa.count_gestores || 0
  const temMultiplosGestores = gestoresCount > 1

  return (
    <TableRow className="group hover:bg-muted/20 border-b transition-all last:border-0">
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="bg-muted/20 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary flex h-10 w-10 items-center justify-center rounded-lg border transition-all">
            <Building2 size={18} />
          </div>
          <div className="flex flex-col">
            <span className="max-w-[200px] truncate text-sm leading-tight font-bold uppercase italic">
              {empresa.nome}
            </span>
            <span className="text-muted-foreground font-mono text-[9px] tracking-tighter">
              {empresa.cnpj || "SEM CNPJ"}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-xl border p-2 transition-all",
              temMultiplosGestores
                ? "border-sky-500/20 bg-sky-500/10 text-sky-500"
                : "border-border bg-muted/50 text-muted-foreground",
            )}
          >
            {temMultiplosGestores ? (
              <ShieldCheck size={16} />
            ) : (
              <UserCircle2 size={16} />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-[11px] leading-none font-black uppercase">
                {empresa.admin_nome || "Sem Gestor"}
              </span>
              {temMultiplosGestores && (
                <Badge className="h-4 border-none bg-sky-600 px-1.5 text-[8px] font-black text-white uppercase shadow-sm shadow-sky-600/20 hover:bg-sky-600">
                  +{gestoresCount - 1}
                </Badge>
              )}
            </div>
            <span
              className={cn(
                "mt-1 text-[9px] font-bold tracking-widest uppercase",
                temMultiplosGestores
                  ? "text-sky-500/70"
                  : "text-muted-foreground",
              )}
            >
              {temMultiplosGestores
                ? "Gestão Compartilhada"
                : "Responsável Único"}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="text-muted-foreground flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Mail size={12} className="text-primary/50" />
            <span className="max-w-[150px] truncate text-[10px] font-bold lowercase">
              {empresa.admin_email || "---"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-primary/50" />
            <span className="text-[10px] font-bold">
              {empresa.telefone || "---"}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center justify-center gap-4">
          <div className="bg-muted/30 flex min-w-[45px] flex-col items-center rounded-lg border p-2">
            <Users2 size={12} className="text-muted-foreground mb-1" />
            <span className="text-foreground text-[10px] leading-none font-black">
              {empresa.count_colaboradores}
            </span>
          </div>
          <div className="bg-muted/30 flex min-w-[45px] flex-col items-center rounded-lg border p-2">
            <BookOpen size={12} className="text-muted-foreground mb-1" />
            <span className="text-foreground text-[10px] leading-none font-black">
              {empresa.count_treinamentos}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/empresas/${empresa.id}`}>
            <Button
              variant="outline"
              size="icon"
              className="border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20 h-9 w-9 rounded-xl transition-all"
            >
              <Eye size={16} />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-xl"
              >
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl p-2 shadow-2xl"
            >
              <DropdownMenuLabel className="text-muted-foreground px-3 py-2 text-[9px] font-black tracking-widest uppercase">
                Opções de Gestão
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Link href="/admin/empresas/gestor">
                <Button
                  variant="ghost"
                  className="h-10 w-full justify-start gap-2 px-3 text-[10px] font-bold uppercase hover:bg-sky-500/10 hover:text-sky-500"
                >
                  <UserPlus2 size={14} /> Adicionar Gestor
                </Button>
              </Link>

              <EditCompanyModal empresa={empresa} />

              <DropdownMenuSeparator />

              <DeleteCompanyModal
                empresaId={empresa.id}
                empresaNome={empresa.nome}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  )
}
