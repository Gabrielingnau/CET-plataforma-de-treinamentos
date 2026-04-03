"use client"

import { FileText, CheckCircle2, Trophy, Target, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExamAttempt {
  id: number
  pontuacao: number
  created_at: string
}

interface ExamInfoProps {
  totalQuestions: number
  minGrade: number
  attempts: ExamAttempt[]
  isAdmin?: boolean // Adicionado para controle
}

export function ExamInfoCard({ totalQuestions, minGrade, attempts = [], isAdmin }: ExamInfoProps) {
  const bestScore = attempts.length > 0 
    ? Math.max(...attempts.map(a => Number(a.pontuacao))) 
    : 0

  const hasPassed = bestScore >= minGrade

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card: Conteúdo */}
      <div className="bg-card border border-border p-8 rounded-[32px] space-y-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center">
          <FileText className="text-orange-600" size={24} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Conteúdo</h4>
          <p className="text-3xl font-black italic tracking-tighter leading-none">
            {totalQuestions} <span className="text-lg not-italic text-zinc-400">Questões</span>
          </p>
        </div>
      </div>

      {/* Card: Critério */}
      <div className="bg-card border border-border p-8 rounded-[32px] space-y-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <Target className="text-emerald-500" size={24} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Critério</h4>
          <p className="text-3xl font-black italic tracking-tighter leading-none">
            {minGrade}% <span className="text-lg not-italic text-zinc-400">Mínimo</span>
          </p>
        </div>
      </div>

      {/* Card: Desempenho */}
      <div className={cn(
        "border p-8 rounded-[32px] space-y-4 shadow-sm transition-all relative overflow-hidden",
        hasPassed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-card border-border",
        isAdmin && !attempts.length && "border-orange-600/20 bg-orange-600/[0.02]"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
          hasPassed 
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
            : isAdmin ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "bg-orange-600/10 text-orange-600"
        )}>
          {isAdmin && !attempts.length ? <ShieldCheck size={24} /> : <Trophy size={24} />}
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
            {isAdmin ? "Visualização Admin" : "Seu Desempenho"}
          </h4>
          <p className={cn(
            "text-3xl font-black italic tracking-tighter leading-none",
            hasPassed ? "text-emerald-600" : "text-foreground"
          )}>
            {attempts.length > 0 ? `${bestScore}%` : (isAdmin ? "PREVIEW" : "---")}
          </p>
        </div>
      </div>
    </div>
  )
}