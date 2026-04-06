"use client"

import React, { useState } from "react"
import { CheckCircle2, ArrowRight, LayoutGrid, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  videoUrl: string
  onComplete: () => void
  nextLessonId?: number
  onNext: (id: number) => void
  onQuiz: () => void
  isLastInModule: boolean
  quizDone: boolean
  isAdmin?: boolean // Adicionado para controle de bypass
}

export function VideoPlayer({ 
  videoUrl, 
  onComplete, 
  nextLessonId, 
  onNext, 
  onQuiz, 
  isLastInModule, 
  quizDone,
  isAdmin 
}: VideoPlayerProps) {
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <div className="relative w-full bg-black group overflow-hidden rounded-xl">
      <video 
        key={videoUrl}
        src={videoUrl} 
        className="w-full h-full" 
        controls={!showOverlay} 
        autoPlay
        onEnded={() => { 
          onComplete(); 
          setShowOverlay(true); 
        }}
        onPlay={() => setShowOverlay(false)}
      />

      {showOverlay && (
        <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-50 animate-in fade-in zoom-in duration-300 px-4 text-center">
          
          {/* Ícone menor no mobile (size-8 vs size-12) */}
          <div className={cn(
            "p-3 md:p-5 rounded-full mb-3 md:mb-6 shadow-2xl transition-colors",
            isAdmin ? "bg-orange-600 shadow-orange-600/20" : "bg-emerald-500 shadow-emerald-500/20"
          )}>
            <CheckCircle2 className="text-white size-8 md:size-12" />
          </div>
          
          {/* Texto responsivo: text-xl no mobile, text-3xl no desktop */}
          <h2 className="text-white text-xl md:text-3xl font-black uppercase italic tracking-tighter mb-1">
            {isAdmin ? "Aula Finalizada!" : "Aula Concluída!"}
          </h2>
          <p className="text-zinc-400 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-10">
            {isAdmin ? "Modo Admin: Progresso não registrado" : "Progresso salvo com sucesso"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[280px] md:max-w-sm">
            {!isLastInModule && nextLessonId ? (
              <button 
                onClick={() => onNext(nextLessonId)}
                className="w-full flex items-center justify-center gap-2 md:gap-3 bg-white text-black hover:bg-emerald-500 hover:text-white px-6 py-3 md:px-8 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-2xl active:scale-95"
              >
                Próxima Aula <ArrowRight className="size-4 md:size-5" />
              </button>
            ) : (
              <button 
                onClick={onQuiz}
                className={cn(
                  "w-full flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-2xl active:scale-95",
                  quizDone ? "bg-zinc-800 text-white" : "bg-orange-600 text-white hover:bg-orange-700"
                )}
              >
                {quizDone ? "Refazer Quiz" : "Iniciar Quiz"}
                {quizDone ? <RotateCcw className="size-4 md:size-5" /> : <LayoutGrid className="size-4 md:size-5" />}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}