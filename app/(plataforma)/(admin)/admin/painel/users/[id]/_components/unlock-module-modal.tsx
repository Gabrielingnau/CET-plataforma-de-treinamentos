"use client"

import { Zap, Loader2, CheckCircle2, Lock } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Module {
  id: number
  titulo: string
  concluido: boolean
}

interface UnlockModuleModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (moduleId: number) => Promise<void>
  isActionLoading: boolean
  modules: Module[]
}

export function UnlockModuleModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isActionLoading,
  modules 
}: UnlockModuleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-[450px] rounded-[2.5rem] p-8 gap-6 outline-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic flex items-center gap-3 text-white">
            <Zap className="text-yellow-500" size={24} /> Destravar Módulo
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-[10px] font-black uppercase italic tracking-widest">
            Selecione o módulo abaixo para forçar a aprovação manual.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {modules.map((mod) => (
            <button
              key={mod.id}
              disabled={mod.concluido || isActionLoading}
              onClick={() => onConfirm(mod.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group outline-none",
                mod.concluido 
                  ? "bg-emerald-500/5 border-emerald-500/20 opacity-60 cursor-not-allowed" 
                  : "bg-zinc-900/50 border-zinc-800 hover:border-yellow-500/50 hover:bg-zinc-900"
              )}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-[8px] font-black text-zinc-600 uppercase italic">ID: {mod.id}</span>
                <span className="text-xs font-bold uppercase italic text-zinc-300 group-hover:text-white transition-colors">
                  {mod.titulo}
                </span>
              </div>

              {mod.concluido ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <div className="flex items-center gap-2">
                  {isActionLoading ? (
                    <Loader2 size={16} className="animate-spin text-yellow-500" />
                  ) : (
                    <Lock size={16} className="text-zinc-700 group-hover:text-yellow-500 transition-colors" />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>

        <Button 
          variant="ghost" 
          onClick={onClose}
          className="w-full text-[10px] font-black uppercase italic text-zinc-500 hover:text-white"
        >
          Fechar Painel
        </Button>
      </DialogContent>
    </Dialog>
  )
}