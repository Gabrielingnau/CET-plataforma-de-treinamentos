"use client"

import { cn } from "@/lib/utils"
import { generateCertificate } from "@/services/certificates/generate-certificate"
import { Download, Eye, Loader2, Lock, ShieldCheck, Trophy } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ProgressCardProps {
  lessons: { total: number; completed: number }
  quizzes: { total: number; completed: number }
  hasCertificate: boolean
  isEligible: boolean
  isAdmin?: boolean
  userData: {
    id: string
    name: string
  }
  trainingData: {
    id: number
    titulo: string
    carga_horaria: number
  }
}

export function ProgressCard({
  lessons,
  quizzes,
  hasCertificate,
  isEligible,
  isAdmin,
  userData,
  trainingData,
}: ProgressCardProps) {
  const [isIssuing, setIsIssuing] = useState(false)

  const lessonsLeft = Math.max(0, lessons.total - lessons.completed)
  const quizzesLeft = Math.max(0, quizzes.total - quizzes.completed)

  const handleDownload = async () => {
    try {
      setIsIssuing(true)

      // Passamos o isAdmin para o service decidir se salva no banco ou apenas gera o preview
      const data = await generateCertificate(
        trainingData.id,
        userData.id,
        isAdmin,
      )

      // Se for modo Admin, o service já disparou o download do Base64 e retornou o status 'preview'
      if (data.status === "preview") {
        toast.info("Modo Preview: Certificado gerado sem salvar no banco.")
        return
      }

      // Fluxo normal para colaboradores (abre a URL do Storage)
      if (data?.url) {
        window.open(data.url, "_blank")
        toast.success("Certificado emitido com sucesso!")
      } else {
        throw new Error("Não foi possível localizar o link do certificado.")
      }
    } catch (error: any) {
      console.error("Erro na emissão:", error)
      toast.error(error.message || "Erro ao processar o certificado.")
    } finally {
      setIsIssuing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 sm:sticky sm:top-24">
      <div className="border-border bg-card relative space-y-8 overflow-hidden rounded-[40px] border p-8 shadow-2xl">
        {/* BADGE DE ADMIN - Estilo aprimorado */}
        {isAdmin && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-orange-600/20 bg-orange-600 px-3 py-1 text-[8px] font-black tracking-widest text-white uppercase shadow-lg shadow-orange-600/20">
            <ShieldCheck size={10} />
            Privilégio Admin
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1.5 rounded-full bg-orange-600" />
            <h3 className="text-foreground text-[10px] font-black tracking-[0.2em] uppercase">
              {isAdmin ? "Simulação de Progresso" : "Status do Treinamento"}
            </h3>
          </div>

          <div className="space-y-5">
            <ProgressItem
              label="Aulas"
              current={lessons.completed}
              total={lessons.total}
              color="bg-orange-600"
            />
            <ProgressItem
              label="Quizzes"
              current={quizzes.completed}
              total={quizzes.total}
              color="bg-emerald-500"
            />
          </div>
        </div>

        <div className="border-border/50 space-y-4 border-t pt-8">
          <div
            className={cn(
              "relative flex items-center gap-4 rounded-3xl border-2 p-6 transition-all",
              hasCertificate || isAdmin
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                : "border-border bg-muted/30 text-muted-foreground opacity-60",
            )}
          >
            {isIssuing ? (
              <Loader2 size={24} className="animate-spin text-orange-600" />
            ) : hasCertificate || isAdmin ? (
              <Trophy
                size={24}
                className={cn(hasCertificate && !isAdmin && "animate-bounce")}
              />
            ) : (
              <Lock size={24} />
            )}
            <div>
              <p className="mb-1 text-[10px] leading-none font-black tracking-widest uppercase">
                Certificado Profissional
              </p>
              <p className="text-xs font-bold uppercase">
                {isIssuing
                  ? "Gerando PDF..."
                  : hasCertificate || isAdmin
                    ? isAdmin
                      ? "PREVIEW DISPONÍVEL"
                      : "LIBERADO"
                    : "CONCLUA o Treinamento"}
              </p>
            </div>
          </div>

          <button
            disabled={(!hasCertificate && !isAdmin) || isIssuing}
            onClick={handleDownload}
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-[10px] font-black tracking-widest uppercase shadow-lg transition-all active:scale-95",
              (hasCertificate || isAdmin) && !isIssuing
                ? "bg-foreground text-background hover:bg-emerald-600 hover:text-white"
                : "border-border bg-muted text-muted-foreground cursor-not-allowed border",
            )}
          >
            {isIssuing ? (
              <>
                Processando <Loader2 size={14} className="animate-spin" />
              </>
            ) : (
              <>
                {isAdmin
                  ? "Gerar Preview Admin"
                  : hasCertificate
                    ? "Baixar Certificado"
                    : "Certificado Bloqueado"}
                {isAdmin ? (
                  <Eye size={14} />
                ) : hasCertificate ? (
                  <Download size={14} />
                ) : (
                  <Lock size={14} />
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* SÓ MOSTRA INSTRUÇÕES SE NÃO FOR ELIGÍVEL E NÃO FOR ADMIN */}
      {!isEligible && !isAdmin && (
        <div className="animate-in fade-in slide-in-from-top-4 space-y-6 rounded-[40px] border border-zinc-800 bg-zinc-900 p-8 shadow-2xl duration-500">
          <div className="flex items-center gap-2">
            <div className="h-3 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <h4 className="text-[10px] font-black tracking-widest text-white uppercase italic">
              Requisitos de Emissão
            </h4>
          </div>

          <p className="text-[11px] leading-relaxed font-medium text-zinc-400">
            Faltam alguns passos para você conquistar sua certificação oficial:
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/40 p-4">
              <span className="text-[9px] font-black text-zinc-500 uppercase">
                Aulas
              </span>
              <span className="text-sm font-black text-orange-600 italic">
                -{lessonsLeft}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/40 p-4">
              <span className="text-[9px] font-black text-zinc-500 uppercase">
                Quizzes
              </span>
              <span className="text-sm font-black text-emerald-500 italic">
                -{quizzesLeft}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProgressItem({ label, current, total, color }: any) {
  const pct = Math.round((current / (total || 1)) * 100)
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between text-[9px] font-black tracking-widest uppercase">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">
          {current} / {total}
        </span>
      </div>
      <div className="border-border/50 bg-muted h-2 overflow-hidden rounded-full border p-0.5">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            color,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
