"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Clock, Layers, Loader2, Download, Eye, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTrainingStructure } from "@/hooks/curso/use-training-structure"
import { generateCertificate } from "@/services/certificates/generate-certificate"
import { getExistingCertificate } from "@/services/certificates/get-certificates"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Props {
  trainingId: number
  userId: string
  userName?: string
}

export function ColaboradorTrainingCard({ trainingId, userId, userName }: Props) {
  const { data, isLoading, isEligible, totalLessons } = useTrainingStructure({ userId, trainingId })
  const [isIssuing, setIsIssuing] = useState(false)
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null)

  // Busca o certificado apenas se o exame final foi aprovado
  useEffect(() => {
    if (data?.passedFinalExam) {
      getExistingCertificate(trainingId, userId).then(url => {
        if (url) setCertificateUrl(url)
      })
    }
  }, [data?.passedFinalExam, trainingId, userId])

  if (isLoading) return <div className="h-[480px] w-full animate-pulse rounded-[40px] bg-muted" />
  if (!data) return null

  const isCompleted = data.passedFinalExam
  const lessonsCompleted = data.completedLessons.length
  const progressoTotal = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0

  const handleAction = async () => {
    if (certificateUrl) {
      window.open(certificateUrl, "_blank")
      return
    }

    try {
      setIsIssuing(true)
      const result = await generateCertificate(trainingId, userId, false) // isAdmin sempre false aqui
      if (result?.url) {
        setCertificateUrl(result.url)
        window.open(result.url, "_blank")
        toast.success("Certificado gerado com sucesso!")
      }
    } catch (error: any) {
      toast.error("Erro ao emitir certificado.")
    } finally {
      setIsIssuing(false)
    }
  }

  return (
    <Card className={cn(
      "group relative flex h-full flex-col overflow-hidden rounded-[40px] border-2 transition-all duration-500 bg-card",
      isCompleted ? "border-emerald-500/30 shadow-2xl shadow-emerald-500/10" : "border-border hover:border-orange-600/30"
    )}>
      
      {/* CAPA */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={data.training.cover_url || "/default-cover.jpg"}
          alt={data.training.titulo}
          fill
          className={cn("object-cover transition-transform duration-700 group-hover:scale-105", isCompleted && "grayscale-[0.5] opacity-80")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4 z-10">
          <div className={cn(
            "rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest backdrop-blur-md border shadow-sm",
            isCompleted 
              ? "bg-emerald-500 border-emerald-400 text-white" 
              : isEligible ? "bg-orange-600 border-orange-400 text-white" : "bg-black/60 border-white/10 text-white"
          )}>
            {isCompleted ? "Concluído" : isEligible ? "Prova Liberada" : "Em Andamento"}
          </div>
        </div>

        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center">
             <CheckCircle2 size={48} className="text-emerald-500 drop-shadow-lg" />
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-8">
        <h3 className="line-clamp-2 text-2xl font-black uppercase italic leading-[0.9] tracking-tighter mb-6 text-foreground">
          {data.training.titulo}
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="flex items-center gap-3 rounded-2xl p-3 border border-border/50 bg-muted/30">
            <Clock size={14} className={isCompleted ? "text-emerald-500" : "text-orange-600"} />
            <span className="text-[10px] font-black uppercase opacity-70">{data.training.carga_horaria}h Total</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl p-3 border border-border/50 bg-muted/30">
            <Layers size={14} className={isCompleted ? "text-emerald-500" : "text-orange-600"} />
            <span className="text-[10px] font-black uppercase opacity-70">{lessonsCompleted}/{totalLessons} Aulas</span>
          </div>
        </div>

        {/* PROGRESSO */}
        <div className="space-y-3 mt-auto mb-8">
          <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-widest opacity-60">
            <span>Seu Progresso</span>
            <span>{isCompleted ? "100%" : `${progressoTotal}%`}</span>
          </div>
          <Progress 
            value={isCompleted ? 100 : progressoTotal} 
            className={cn("h-1.5 bg-muted", isCompleted ? "[&>div]:bg-emerald-500" : "[&>div]:bg-orange-600")} 
          />
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex flex-col gap-3">
          {isCompleted ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleAction}
                  disabled={isIssuing}
                  className="h-12 rounded-xl bg-emerald-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 shadow-md transition-all active:scale-95"
                >
                  {isIssuing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Download size={14} className="mr-2" /> 
                      {certificateUrl ? "Baixar" : "Emitir"}
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline"
                  disabled={!certificateUrl}
                  onClick={() => window.open(certificateUrl!, "_blank")}
                  className="h-12 rounded-xl border-border bg-background text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-muted"
                >
                  <Eye size={14} className="mr-2" /> Ver PDF
                </Button>
              </div>

              <Button 
                asChild
                variant="ghost"
                className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-emerald-700"
              >
                <Link href={`/colaborador/treinamentos/${trainingId}/visualizar`}>
                  Revisar Conteúdo <Play size={12} className="ml-2" />
                </Link>
              </Button>
            </>
          ) : (
            <Button 
              asChild
              className="h-14 rounded-2xl bg-foreground text-[11px] font-black uppercase tracking-[0.2em] text-background hover:bg-orange-600 hover:text-white shadow-xl transition-all active:scale-95"
            >
              <Link href={`/colaborador/treinamentos/${trainingId}/visualizar`}>
                Acessar Treinamento <Play className="ml-2 h-3 w-3 fill-current" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}