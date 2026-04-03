import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { UserTrainingDetail } from "@/types/dashboard/company/company"
import { BookOpen, CheckCircle2, Timer } from "lucide-react"

interface DetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  details: UserTrainingDetail[]
}

export function CollaboratorDetailsSheet({ open, onOpenChange, details }: DetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90%] sm:max-w-md bg-background border-l-primary/20 p-0">
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="font-black italic uppercase text-3xl text-primary leading-none tracking-tighter">
              Evolução Individual
            </SheetTitle>
            <SheetDescription className="font-bold text-[10px] uppercase text-muted-foreground tracking-widest">
              Performance por treinamento atribuído
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            {details.length > 0 ? details.map((t, i) => (
              <div key={i} className="group relative p-4 rounded-2xl bg-card/40 border border-border/50 hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <p className="font-black text-xs uppercase italic leading-tight max-w-[200px]">
                      {t.titulo_treinamento}
                    </p>
                    <Badge variant="outline" className="text-[9px] font-black uppercase italic border-primary/20">
                      {t.status === 'concluido' ? 'Finalizado' : 'Em andamento'}
                    </Badge>
                  </div>
                  <span className="text-xl font-black italic text-primary">{t.progresso}%</span>
                </div>
                
                <Progress value={t.progresso} className="h-1.5" />
                
                {t.data_conclusao && (
                  <p className="mt-3 text-[9px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-emerald-500" />
                    Concluído em: {new Date(t.data_conclusao).toLocaleDateString()}
                  </p>
                )}
              </div>
            )) : (
              <div className="text-center py-20 space-y-4">
                <BookOpen className="mx-auto text-muted-foreground/20" size={48} />
                <p className="text-sm font-bold italic uppercase text-muted-foreground">Nenhum treinamento iniciado.</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}