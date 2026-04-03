"use client"

import {
  BookOpen,
  Clock,
  Layers,
  FileCheck,
  User,
  ArrowRight,
  Eye,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { memo, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrainingWithDetails } from "@/types/database/trainings"

import { DeleteTrainingModal } from "./delete-training-modal"

export const TrainingCard = memo(
  ({ training }: { training: TrainingWithDetails }) => {
    const {
      totalModulos,
      totalAulas,
      nomeCriador,
      nomeTemplate,
      capaTemplate,
    } = useMemo(() => {
      const modules = training.modules || []
      const totalModulos = modules.length
      const totalAulas = modules.reduce(
        (acc, mod) => acc + (mod.lessons?.length || 0),
        0
      )

      const nomeCriador = training.criador?.nome || "Admin"
      const template = training.certificate_template
      const nomeTemplate = template?.titulo || "Padrão Sistema"
      const capaTemplate = template?.capa_url || null

      return {
        totalModulos,
        totalAulas,
        nomeCriador,
        nomeTemplate,
        capaTemplate,
      }
    }, [training])

    return (
      <Card className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border-border bg-card/40 transition-all duration-500 hover:border-primary/40">
        {/* 1. IMAGEM COM OVERLAY */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={training.cover_url || "/unsplash"}
            alt={training.titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
            <Button
              asChild
              variant="secondary"
              className="h-9 rounded-full px-6 text-xs font-semibold"
            >
              <Link href={`/colaborador/treinamentos/${training.id}/visualizar`} className="flex items-center gap-2">
                <Eye size={14} />
                Visualizar
              </Link>
            </Button>
          </div>

          <div className="absolute top-3 left-3 z-20">
            <Badge variant="outline" className="rounded-full bg-background/80 text-[10px] font-medium backdrop-blur-md">
              ID: {training.id}
            </Badge>
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col p-5">
          {/* HEADER */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
              <User size={12} />
              <span>{nomeCriador}</span>
            </div>
            <DeleteTrainingModal
              trainingId={training.id.toString()}
              trainingTitle={training.titulo}
            />
          </div>

          {/* TÍTULO E DESCRIÇÃO */}
          <div className="mb-4">
            <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {training.titulo}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {training.descricao || "Domine este conteúdo técnico para obter sua certificação técnica."}
            </p>
          </div>

          {/* INFO GRID */}
          <div className="mt-auto grid grid-cols-3 gap-2">
            <MiniBox icon={<Clock size={12} />} value={`${training.carga_horaria}h`} />
            <MiniBox icon={<Layers size={12} />} value={`${totalModulos} Mod.`} />
            <MiniBox icon={<BookOpen size={12} />} value={`${totalAulas} Aul.`} />
          </div>
        </CardContent>

        {/* 2. FOOTER */}
        <CardFooter className="flex flex-col gap-3 px-5 pt-0 pb-5">
          <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-muted/30 p-2.5 transition-colors group-hover:border-primary/20">
            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-background">
              {capaTemplate ? (
                <Image src={capaTemplate} fill sizes="56px" className="object-cover" alt="Certificado" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FileCheck size={14} className="text-muted-foreground/50" />
                </div>
              )}
            </div>

            <div className="flex flex-col overflow-hidden">
              <span className="text-[9px] font-medium text-muted-foreground uppercase leading-none">Certificado</span>
              <span className="truncate text-xs font-semibold text-foreground">{nomeTemplate}</span>
            </div>
          </div>

          <Button
            asChild
            className="h-12 w-full rounded-xl font-bold transition-all active:scale-[0.98]"
          >
            <Link href={`/admin/treinamentos/novo/${training.id}/modulos/novo`} className="flex items-center justify-center gap-2">
              Gerenciar <ArrowRight size={16} />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }
)

TrainingCard.displayName = "TrainingCard"

function MiniBox({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/20 py-2 transition-colors group-hover:bg-primary/5">
      <div className="mb-1 text-primary">{icon}</div>
      <p className="text-[10px] font-semibold text-foreground">{value}</p>
    </div>
  )
}