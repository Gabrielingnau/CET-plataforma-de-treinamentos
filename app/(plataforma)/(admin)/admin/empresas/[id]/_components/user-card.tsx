"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Briefcase,
  Fingerprint,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react"
import { useParams } from "next/navigation"
import { useMemo } from "react"

// Nomenclaturas atualizadas para os modais
import { UserDeleteModal } from "./modal/user-delete-modal"
import { UserEditModal } from "./modal/user-edit-modal"
import { UserTrainingsModal } from "./modal/user-trainings-modal"

interface Props {
  userData: any // Renomeado de colab para userData
  catalogo: any[]
}

export function UserCard({ userData, catalogo }: Props) {
  const params = useParams()
  const empresaId = Number(params.id)

  // OTIMIZAÇÃO: Verificação de role memoizada
  const isGestor = useMemo(
    () => userData.role?.toLowerCase().trim() === "empresa",
    [userData.role],
  )

  // OTIMIZAÇÃO: Tema memoizado para evitar recalcular objetos em listas grandes
  const theme = useMemo(
    () => ({
      container: isGestor
        ? "border-sky-500/20 bg-sky-500/[0.02] hover:border-sky-500/50 shadow-sky-500/5"
        : "border-primary/20 bg-primary/[0.02] hover:border-primary/50 shadow-primary/5",

      badge: isGestor
        ? "bg-sky-600 text-white shadow-sky-600/20"
        : "bg-primary text-primary-foreground shadow-primary/20",

      avatar: isGestor
        ? "border-sky-500/30 bg-sky-500/10 text-sky-500 group-hover:bg-sky-500 group-hover:text-white"
        : "border-primary/30 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",

      name: isGestor ? "text-sky-600 dark:text-sky-400" : "text-primary",
      iconTiny: isGestor ? "text-sky-500/50" : "text-primary/50",
    }),
    [isGestor],
  )

  return (
    <div
      className={cn(
        "group bg-card relative rounded-[2.5rem] border p-6 shadow-sm transition-all duration-500 hover:shadow-xl",
        theme.container,
      )}
    >
      {/* BADGE DE CARGO */}
      <div className="absolute -top-3 left-8">
        <Badge
          className={cn(
            "gap-1.5 border-none px-3 py-1 text-[9px] font-black uppercase italic shadow-lg",
            theme.badge,
          )}
        >
          {isGestor ? (
            <>
              <ShieldCheck size={10} /> Gestor
            </>
          ) : (
            <>
              <Briefcase size={10} /> Colaborador
            </>
          )}
        </Badge>
      </div>

      {/* HEADER DO CARD */}
      <div className="mt-2 mb-6 flex items-start justify-between">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner transition-all duration-300",
            theme.avatar,
          )}
        >
          <User size={28} />
        </div>

        <div className="flex gap-2">
          <UserEditModal userData={userData} empresaId={empresaId} />
          <UserDeleteModal user={userData} empresaId={Number(empresaId)} />
        </div>
      </div>

      {/* INFO PRINCIPAL */}
      <div className="mb-6 space-y-1">
        <h4
          className={cn(
            "text-base leading-none font-black tracking-tighter uppercase italic transition-colors duration-300",
            theme.name,
          )}
        >
          {userData.nome}
        </h4>
        <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
          <Fingerprint size={12} className={theme.iconTiny} />
          {userData.cpf}
        </div>
      </div>

      {/* CONTATO (Gestores) */}
      {isGestor && (
        <div className="animate-in fade-in slide-in-from-top-2 mb-6 grid grid-cols-1 gap-2 rounded-2xl border border-sky-500/10 bg-sky-500/5 p-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <Mail size={12} className="shrink-0 text-sky-500" />
            <span className="truncate text-[10px] font-black text-sky-600 uppercase italic dark:text-sky-400">
              {userData.email || "Sem e-mail"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={12} className="shrink-0 text-sky-500" />
            <span className="text-[10px] font-black text-sky-600 uppercase italic dark:text-sky-400">
              {userData.telefone || "Sem telefone"}
            </span>
          </div>
        </div>
      )}

      {/* MODAL DE TREINAMENTOS */}
      <UserTrainingsModal
        userData={userData}
        empresaId={empresaId}
        catalogo={catalogo}
      />

      {/* FOOTER: CURSOS ATIVOS */}
      <div className="border-border/50 mt-5 border-t pt-5">
        <p className="text-muted-foreground mb-3 text-[8px] font-black tracking-widest uppercase">
          Treinamentos Ativos
        </p>
        <div className="flex flex-wrap gap-1.5">
          {userData.user_trainings?.length > 0 ? (
            userData.user_trainings.map((ut: any) => (
              <Badge
                key={ut.training_id}
                variant="outline"
                className={cn(
                  "border-border/40 px-2.5 text-[8px] font-black uppercase italic",
                  isGestor
                    ? "bg-sky-500/5 text-sky-600 dark:text-sky-400"
                    : "bg-primary/5 text-primary",
                )}
              >
                {ut.trainings?.titulo}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground/30 text-[9px] font-bold tracking-tighter uppercase italic">
              Nenhum curso vinculado
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
