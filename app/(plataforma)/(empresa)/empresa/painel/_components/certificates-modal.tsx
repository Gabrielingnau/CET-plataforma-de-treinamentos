import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileCheck, ShieldCheck } from "lucide-react"
import { UserCertificate } from "@/types/dashboard/company/company"

interface CertificatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificates: UserCertificate[]
}

export function CertificatesModal({ open, onOpenChange, certificates }: CertificatesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none bg-card max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="font-black italic uppercase text-2xl flex items-center gap-3 tracking-tighter">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <ShieldCheck className="text-emerald-500" size={24} />
            </div>
            Certificados
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase text-muted-foreground">
            Documentação técnica e conformidade NR
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          {certificates.length > 0 ? certificates.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border group hover:bg-muted/50 transition-all">
              <div className="space-y-1 overflow-hidden">
                <p className="font-black text-xs uppercase italic truncate pr-4">
                  {cert.nome_treinamento}
                </p>
                <div className="flex gap-3 text-[9px] text-muted-foreground font-mono">
                  <span>ID: {cert.codigo.split('-')[0]}</span>
                  <span>DATA: {new Date(cert.data_conclusao).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="rounded-xl gap-2 font-black italic uppercase text-[10px] bg-emerald-600 hover:bg-emerald-700 transition-colors shrink-0 shadow-lg shadow-emerald-900/20"
                asChild
              >
                <a href={cert.caminho_pdf_bucket} target="_blank" rel="noopener noreferrer">
                  <Download size={14} /> PDF
                </a>
              </Button>
            </div>
          )) : (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
              <FileCheck className="mx-auto text-muted-foreground/30 mb-2" size={32} />
              <p className="text-xs font-bold italic uppercase text-muted-foreground">Aguardando conclusão de cursos.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}