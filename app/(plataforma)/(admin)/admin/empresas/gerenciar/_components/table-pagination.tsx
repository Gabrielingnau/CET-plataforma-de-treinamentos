"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface TablePaginationProps {
  current: number
  total: number
  next: () => void
  prev: () => void
}

export function TablePagination({
  current,
  total,
  next,
  prev,
}: TablePaginationProps) {
  return (
    <div className="bg-muted/5 flex items-center justify-between border-t px-6 py-4 backdrop-blur-md">
      {/* Indicador de Status */}
      <div className="flex flex-col">
        <span className="text-muted-foreground text-[9px] font-black tracking-[0.2em] uppercase italic">
          Navegação
        </span>
        <div className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
          Página <span className="text-primary">{current}</span> de {total || 1}
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={current === 1}
          onClick={prev}
          className="hover:bg-primary/10 hover:border-primary/30 hover:text-primary h-9 w-9 rounded-xl p-0 transition-all disabled:opacity-20"
        >
          <ChevronLeft size={18} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={current === total || total === 0}
          onClick={next}
          className="hover:bg-primary/10 hover:border-primary/30 hover:text-primary h-9 w-9 rounded-xl p-0 transition-all disabled:opacity-20"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  )
}
