import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download, Crown, UserX, SearchX } from "lucide-react" // Importei UserX e SearchX
import { CollaboratorRow } from "@/types/dashboard/company/company"

interface Props {
  data: CollaboratorRow[]
  onViewDetails: (id: string) => void
  onViewCerts: (id: string) => void
}

export function CollaboratorTable({ data, onViewDetails, onViewCerts }: Props) {
  return (
    <div className="rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl shadow-black/5">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="font-black uppercase text-[10px] italic tracking-widest text-muted-foreground">Colaborador</TableHead>
            <TableHead className="font-black uppercase text-[10px] italic tracking-widest text-muted-foreground">Progresso Geral</TableHead>
            <TableHead className="font-black uppercase text-[10px] italic tracking-widest text-center text-muted-foreground">Status</TableHead>
            <TableHead className="font-black uppercase text-[10px] italic tracking-widest text-right text-muted-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((worker) => (
              <TableRow key={worker.id} className="border-border/40 hover:bg-primary/5 transition-colors group">
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <p className="font-black uppercase italic text-sm tracking-tighter">{worker.nome}</p>
                    {worker.role === 'empresa' && <Crown size={12} className="text-amber-500 fill-amber-500/20" />}
                  </div>
                  <p className="text-[9px] text-muted-foreground font-mono tracking-tighter">{worker.cpf}</p>
                </TableCell>
                
                <TableCell className="w-48 sm:w-64">
                  <div className="flex items-center gap-3">
                    <Progress value={worker.progresso_medio} className="h-1.5 bg-primary/10" />
                    <span className="text-[10px] font-black italic w-10 text-primary">{worker.progresso_medio}%</span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Badge 
                    variant="outline" 
                    className={`rounded-lg text-[9px] uppercase font-black italic px-3 py-0.5 border-2 ${
                      worker.status === 'concluido' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' :
                      worker.status === 'em_curso' ? 'border-primary/50 text-primary bg-primary/5' :
                      'border-muted-foreground/30 text-muted-foreground bg-muted/5'
                    }`}
                  >
                    {worker.status.replace('_', ' ')}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-xl hover:bg-background hover:text-primary transition-all active:scale-90"
                      onClick={() => onViewDetails(worker.id)}
                    >
                      <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-xl hover:bg-background transition-all active:scale-90"
                      disabled={worker.certificados_count === 0}
                      onClick={() => onViewCerts(worker.id)}
                    >
                      <Download size={18} className={worker.certificados_count > 0 ? "text-emerald-500" : "text-muted-foreground/20"} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            /* --- EMPTY STATE (Aviso de Nenhum Resultado) --- */
            <TableRow className="hover:bg-transparent border-none">
              <TableCell colSpan={4} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
                  <div className="p-4 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                    <SearchX size={40} className="text-muted-foreground/40" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black uppercase italic text-lg tracking-tighter text-foreground/80">
                      Nenhum colaborador encontrado
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Tente ajustar sua busca ou verifique os filtros aplicados
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}