"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Plus,
  Eye,
  Trash2,
  MoreVertical,
  Layout,
  ShieldCheck,
  Edit3,
  Loader2,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { CreateTemplateModal } from "./modal/CreateTemplateModal"
import { UpdateTemplateModal } from "./modal/UpdateTemplateModal"
import { DeleteTemplateModal } from "./modal/DeleteTemplateModal"
import { CertificateTemplate } from "@/types/database/template"
import { cn } from "@/lib/utils"

interface TemplateGridProps {
  initialTemplates: CertificateTemplate[]
  onToggleStatus: (params: { id: number; currentStatus: boolean }) => void
  onRemove: (params: { id: number; pdfUrl: string; capaUrl: string | null }) => void
  isProcessing: boolean
}

export function TemplateGrid({
  initialTemplates,
  onToggleStatus,
  onRemove,
  isProcessing,
}: TemplateGridProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [templateToUpdate, setTemplateToUpdate] = useState<CertificateTemplate | null>(null)
  const [templateToDelete, setTemplateToDelete] = useState<CertificateTemplate | null>(null)

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* CARD ADICIONAR NOVO */}
      <button
        onClick={() => setShowCreate(true)}
        disabled={isProcessing}
        className={cn(
          "group relative flex h-72 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/20 transition-all",
          "hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <div className="rounded-full bg-primary/10 p-4 transition-transform group-hover:scale-110">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary">
          Novo Template
        </span>
      </button>

      {/* LISTA DE TEMPLATES */}
      {initialTemplates.map((template) => (
        <div
          key={template.id}
          className={cn(
            "group relative flex h-72 flex-col overflow-hidden rounded-lg border bg-card transition-all",
            !template.ativo && "opacity-75 grayscale-[0.3]"
          )}
        >
          {/* ÁREA DA IMAGEM / OVERLAY */}
          <div className="relative flex-1 overflow-hidden bg-muted">
            {template.capa_url ? (
              <Image
                src={template.capa_url}
                alt={template.titulo}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Layout size={32} className="text-muted-foreground/20" />
              </div>
            )}

            {!template.ativo && (
              <div className="absolute right-3 top-3 rounded-md bg-destructive px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                Inativo
              </div>
            )}

            {/* AÇÕES AO HOVER (OVERLAY) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-[2px]">
              <Button
                variant="secondary"
                size="sm"
                className="w-32 font-semibold"
                onClick={() => window.open(template.url_bucket, "_blank")}
              >
                <Eye size={14} className="mr-2" /> Ver PDF
              </Button>

              {!template.ativo && (
                <Button
                  variant="default"
                  size="sm"
                  disabled={isProcessing}
                  className="w-32 bg-green-600 font-semibold hover:bg-green-700"
                  onClick={() => onToggleStatus({ id: template.id, currentStatus: template.ativo })}
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck size={14} className="mr-2" />}
                  Ativar
                </Button>
              )}
            </div>
          </div>

          {/* RODAPÉ DO CARD */}
          <div className="flex items-center justify-between border-t p-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold tracking-tight leading-tight">
                {template.titulo}
              </h3>
              <p className="truncate text-[11px] text-muted-foreground mt-0.5">
                {template.descricao || "Sem descrição"}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                >
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                  onClick={() => setTemplateToUpdate(template)}
                  className="gap-2"
                >
                  <Edit3 size={14} /> Editar Dados
                </DropdownMenuItem>

                <DropdownMenuItem
                  disabled={isProcessing}
                  onClick={() => onToggleStatus({ id: template.id, currentStatus: template.ativo })}
                  className={cn(
                    "gap-2 font-medium",
                    template.ativo ? "text-amber-600" : "text-green-600"
                  )}
                >
                  {template.ativo ? (
                    <>
                      <XCircle size={14} /> Desativar Template
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} /> Reativar Template
                    </>
                  )}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setTemplateToDelete(template)}
                  className="gap-2 font-medium text-destructive focus:text-destructive"
                >
                  <Trash2 size={14} /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      {/* MODAIS */}
      <CreateTemplateModal open={showCreate} onOpenChange={setShowCreate} />

      <UpdateTemplateModal
        template={templateToUpdate}
        open={!!templateToUpdate}
        onOpenChange={(open) => !open && setTemplateToUpdate(null)}
      />

      <DeleteTemplateModal
        template={templateToDelete}
        open={!!templateToDelete}
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
        onConfirm={(id, pdf, capa) => onRemove({ id, pdfUrl: pdf, capaUrl: capa })}
        isProcessing={isProcessing}
      />
    </div>
  )
}