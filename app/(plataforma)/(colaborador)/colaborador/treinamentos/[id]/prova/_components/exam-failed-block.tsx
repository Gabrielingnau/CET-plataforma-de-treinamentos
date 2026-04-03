"use client"

import { AlertOctagon, RefreshCw, History, ShieldAlert } from "lucide-react"

interface ExamFailedBlockProps {
  onReset: () => void
  loading: boolean
  maxAttempts: number
  isAdmin?: boolean // Adicionado para controle
}

export function ExamFailedBlock({ onReset, loading, maxAttempts, isAdmin }: ExamFailedBlockProps) {
  // Se for admin, não mostramos o bloqueio de "Limite Atingido", 
  // mas sim uma opção de resetar para teste.
  return (
    <div className="p-10 rounded-[40px] border-2 border-red-500/30 bg-red-500/5 flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-300">
      <div className="w-20 h-20 rounded-3xl bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-500/40">
        {isAdmin ? <ShieldAlert size={40} /> : <AlertOctagon size={40} />}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-red-500">
          {isAdmin ? "Simulação de Bloqueio" : "Limite Atingido"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {isAdmin 
            ? "Esta tela aparece para o colaborador após esgotar as tentativas. Como Admin, você pode resetar para testar o fluxo novamente."
            : `Você utilizou suas ${maxAttempts} tentativas e não alcançou a nota mínima. Conforme as normas do KYDORA, você deve refazer o treinamento completo.`
          }
        </p>
      </div>

      <button 
        onClick={onReset}
        disabled={loading}
        className="group flex items-center gap-3 bg-foreground text-background px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all active:scale-95"
      >
        {loading ? (
          <RefreshCw size={16} className="animate-spin" />
        ) : (
          <>
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            {isAdmin ? "Simular Reinício" : "Reiniciar Treinamento"}
          </>
        )}
      </button>

      <div className="flex items-center gap-2 text-[9px] font-bold text-red-500/50 uppercase tracking-[0.2em]">
        <History size={12} />
        O histórico de tentativas será {isAdmin ? "limpo nesta sessão" : "reiniciado"}
      </div>
    </div>
  )
}