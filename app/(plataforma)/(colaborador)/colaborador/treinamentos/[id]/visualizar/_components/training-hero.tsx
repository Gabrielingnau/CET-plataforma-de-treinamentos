"use client"

import { Clock, Layers, BookOpen, Star, ChevronRight, PlayCircle } from "lucide-react"
import Link from "next/link"

interface HeroProps {
  training: any
  stats: { modules: number; lessons: number }
  firstLessonId?: number
  trainingId: number
  isAdmin?: boolean // Adicionado para controle de acesso
}

export function TrainingHero({ training, stats, firstLessonId, trainingId, isAdmin }: HeroProps) {
  return (
    <section className="w-full border-b border-border bg-card/30 py-12 lg:py-16 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        <div className="w-full lg:w-80 shrink-0">
          <div className="aspect-video lg:aspect-square rounded-[32px] overflow-hidden border border-border shadow-2xl relative">
            <img src={training.cover_url} alt={training.titulo} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
          </div>
        </div>

        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="space-y-3">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
              <Star size={12} className="fill-orange-600" />
              <span>
                {isAdmin ? "Modo Administrador" : "Treinamento Corporativo"}
              </span>
              <ChevronRight size={10} className="text-muted-foreground" />
              <span className="text-muted-foreground">KYDORA</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
              {training.titulo}
            </h1>
          </div>
          <p className="max-w-2xl text-muted-foreground text-sm lg:text-base leading-relaxed mx-auto lg:mx-0">
            {training.descricao}
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-4 pt-4">
            <StatItem icon={Clock} label={`${training.carga_horaria}H Total`} />
            <StatItem icon={Layers} label={`${stats.modules} Módulos`} />
            <StatItem icon={BookOpen} label={`${stats.lessons} Aulas`} />
          </div>

          {/* Botão de ação: aparece se houver ID da aula ou se for Admin */}
          {(firstLessonId || isAdmin) && (
            <div className="pt-4">
              <Link 
                href={`/colaborador/treinamentos/${trainingId}/aula/${firstLessonId || 0}`} 
                className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest px-10 py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/20 text-[11px]"
              >
                <PlayCircle size={20} /> 
                {isAdmin ? "Visualizar Aulas" : "Continuar Treinamento"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function StatItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-orange-600" />
      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
        {label}
      </span>
    </div>
  )
}