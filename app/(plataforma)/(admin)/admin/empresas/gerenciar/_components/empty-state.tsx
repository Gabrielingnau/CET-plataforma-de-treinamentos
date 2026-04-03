import { SearchX } from "lucide-react"

export function EmptyState() {
  return (
    <div className="animate-in fade-in zoom-in-95 flex flex-col items-center justify-center gap-4 py-20 duration-500">
      {/* Ícone Estilizado */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-orange-600/10 blur-2xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950 text-zinc-700 shadow-2xl">
          <SearchX size={32} strokeWidth={1.5} />
        </div>
      </div>

      {/* Mensagem */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-[11px] font-black tracking-[0.2em] text-zinc-300 uppercase italic">
          Nenhum resultado encontrado
        </h3>
        <p className="max-w-[200px] text-[9px] leading-relaxed font-bold tracking-widest text-zinc-600 uppercase">
          Tente ajustar sua busca ou verifique se o CNPJ está correto.
        </p>
      </div>
    </div>
  )
}
