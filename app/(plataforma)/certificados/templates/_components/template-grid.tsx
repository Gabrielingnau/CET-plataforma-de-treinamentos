"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { 
  Plus, Eye, Trash2, MoreVertical, Layout, ShieldCheck, Edit3 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { activateTemplate } from "@/services/templates/template-service-client"
import { CreateTemplateModal } from "./modal/CreateTemplateModal"
import { UpdateTemplateModal } from "./modal/UpdateTemplateModal"
import { DeleteTemplateModal } from "./modal/DeleteTemplateModal"

interface Template {
  id: number; titulo: string; descricao: string; 
  capa_url: string | null; url_bucket: string; ativo: boolean;
}

export function TemplateGrid({ initialTemplates }: { initialTemplates: Template[] }) {
  const [showCreate, setShowCreate] = useState(false)
  const [templateToUpdate, setTemplateToUpdate] = useState<Template | null>(null)
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null)
  const router = useRouter()

  const handleActivate = async (id: number) => {
    try {
      await activateTemplate(id)
      toast.success("Template reativado!")
      router.refresh()
    } catch (error) {
      toast.error("Erro ao reativar.")
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <button
        onClick={() => setShowCreate(true)}
        className="group relative flex h-72 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted-foreground/20 transition-all hover:border-primary/50 hover:bg-primary/5"
      >
        <div className="rounded-full bg-primary/10 p-4 transition-all group-hover:scale-110">
          <Plus className="h-8 w-8 text-primary" />
        </div>
        <span className="font-bold text-muted-foreground group-hover:text-primary">Novo Template</span>
      </button>

      {initialTemplates.map((template) => (
        <div
          key={template.id}
          className={`group relative flex h-72 flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-500 ${!template.ativo ? "opacity-60 grayscale-[0.5]" : "hover:shadow-xl"}`}
        >
          <div className="relative flex-1 overflow-hidden bg-muted/30">
            {template.capa_url ? (
              <Image src={template.capa_url} alt={template.titulo} fill className="object-cover transition-transform group-hover:scale-105" />
            ) : (
              <div className="flex h-full w-full items-center justify-center"><Layout size={40} className="opacity-20" /></div>
            )}

            {!template.ativo && (
              <div className="absolute top-2 right-2 rounded bg-yellow-500 px-2 py-1 text-[10px] font-bold text-white uppercase shadow-sm">Inativo</div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="secondary" size="sm" className="w-32" onClick={() => window.open(template.url_bucket, "_blank")}>
                <Eye size={16} className="mr-2" /> Ver PDF
              </Button>

              {!template.ativo && (
                <Button variant="default" size="sm" className="w-32 bg-green-600 hover:bg-green-700" onClick={() => handleActivate(template.id)}>
                  <ShieldCheck size={16} className="mr-2" /> Ativar
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between border-t bg-card p-4">
            <div className="min-w-0 flex-1 pr-2">
              <h3 className="truncate text-sm font-bold">{template.titulo}</h3>
              <p className="truncate text-[10px] text-muted-foreground uppercase">{template.descricao}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical size={16} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTemplateToUpdate(template)} className="gap-2 cursor-pointer">
                  <Edit3 size={14} /> Editar Dados
                </DropdownMenuItem>
                
                {!template.ativo ? (
                  <DropdownMenuItem onClick={() => handleActivate(template.id)} className="gap-2 text-green-600 font-semibold cursor-pointer">
                    <ShieldCheck size={14} /> Reativar
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setTemplateToDelete(template)} className="gap-2 text-destructive cursor-pointer font-semibold">
                    <Trash2 size={14} /> Excluir
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      {/* Modais Centralizados */}
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
      />
    </div>
  )
}