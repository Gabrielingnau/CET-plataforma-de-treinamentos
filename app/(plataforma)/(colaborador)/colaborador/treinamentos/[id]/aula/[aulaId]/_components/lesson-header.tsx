"use client"

import { ArrowLeft, GraduationCap } from "lucide-react"
import Link from "next/link"

export function LessonHeader({ trainingId, moduleTitle, lessonTitle }: any) {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center px-6 justify-between shrink-0 z-40 sticky top-0">
      <Link href={`/colaborador/treinamentos/${trainingId}/visualizar`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Voltar</span>
      </Link>

      <div className="flex flex-col items-center text-center px-2">
        <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest">{moduleTitle}</span>
        <h2 className="text-[10px] font-bold truncate max-w-[200px] leading-tight text-foreground">{lessonTitle}</h2>
      </div>

      <div className="w-10 h-10 rounded-full bg-orange-600/10 border border-orange-600/20 flex items-center justify-center">
          <GraduationCap size={18} className="text-orange-600" />
      </div>
    </header>
  )
}