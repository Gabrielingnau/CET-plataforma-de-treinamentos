"use client"

import React, { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Clock,
  Layers,
  Users2,
  Info,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTrainingUsers } from "@/hooks/trainings/companie/use-company-catalogue"
import { cn } from "@/lib/utils"

interface Props {
  training: {
    id: number
    titulo: string
    descricao: string
    cover_url: string
    carga_horaria: number
    modulesCount: number   // Vem do novo service
    lessonsCount: number    // Vem do novo service
  }
  empresaId: number
}

export function CatalogueCard({ training, empresaId }: Props) {
  const [showModal, setShowModal] = useState(false)
  
  // O hook só dispara quando o modal abre (enabled: showModal)
  const { data: users, isLoading: isLoadingUsers } = useTrainingUsers(
    training.id,
    empresaId,
    showModal
  )

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Card className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[40px] border-2 border-border bg-card transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
          
          {/* CAPA COM GRADIENTE */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={training.cover_url || "/default-cover.jpg"}
              alt={training.titulo}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-4 right-4 z-10">
              <div className="rounded-full border border-white/10 bg-black/60 px-4 py-1.5 text-[9px] font-black tracking-widest text-white uppercase shadow-sm backdrop-blur-md">
                Disponível
              </div>
            </div>
          </div>

          <CardContent className="flex flex-1 flex-col p-8">
            <h3 className="mb-6 line-clamp-2 text-2xl leading-[0.9] font-black tracking-tighter text-foreground uppercase italic transition-colors group-hover:text-primary">
              {training.titulo}
            </h3>

            {/* INFO GRID (USANDO OS COUNTS DO SERVICE) */}
            <div className="mb-8 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 p-3">
                <Clock size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase opacity-70">
                  {training.carga_horaria}h Total
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 p-3">
                <Layers size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase opacity-70">
                  {training.lessonsCount} Aulas
                </span>
              </div>
            </div>

            <div className="mt-auto">
              <Button className="h-14 w-full gap-2 rounded-2xl bg-foreground text-[11px] font-black tracking-[0.2em] text-background uppercase shadow-xl transition-all hover:bg-primary hover:text-white active:scale-95">
                Ver Detalhes <Info size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="flex h-[85vh] max-w-3xl flex-col overflow-hidden rounded-[40px] border-none bg-card p-0 shadow-2xl">
        {/* Título invisível para acessibilidade dentro do Content */}
        <DialogHeader className="sr-only">
          <DialogTitle>{training.titulo}</DialogTitle>
        </DialogHeader>

        <div className="relative h-48 w-full flex-shrink-0">
          <Image
            src={training.cover_url || "/default-cover.jpg"}
            fill
            className="object-cover"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute right-10 bottom-6 left-10">
            <h2 className="text-3xl leading-none font-black tracking-tighter text-foreground uppercase italic">
              {training.titulo}
            </h2>
          </div>
        </div>

        <Tabs defaultValue="conteudo" className="flex flex-1 flex-col overflow-hidden p-10 pt-4">
          <TabsList className="mb-8 grid h-14 grid-cols-2 rounded-2xl bg-muted/50 p-1.5">
            <TabsTrigger value="conteudo" className="rounded-xl text-[10px] font-black uppercase italic shadow-sm data-[state=active]:bg-card">
              Informações
            </TabsTrigger>
            <TabsTrigger value="vinculos" className="gap-2 rounded-xl text-[10px] font-black uppercase italic shadow-sm data-[state=active]:bg-card">
              <Users2 size={14} /> Colaboradores ({users?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conteudo" className="custom-scrollbar flex-1 overflow-y-auto pr-2">
            <div className="space-y-6">
              <div className="rounded-3xl border border-border/50 bg-muted/30 p-6">
                <p className="mb-2 text-[10px] font-black tracking-widest text-primary uppercase">Sobre o Treinamento</p>
                <p className="text-xs leading-relaxed font-bold text-muted-foreground">
                  {training.descricao || "Este treinamento está disponível para todos os colaboradores da unidade."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
                    <p className="text-[9px] font-black uppercase text-muted-foreground">Total de Módulos</p>
                    <p className="text-xl font-black italic text-primary">{training.modulesCount}</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
                    <p className="text-[9px] font-black uppercase text-muted-foreground">Total de Aulas</p>
                    <p className="text-xl font-black italic text-primary">{training.lessonsCount}</p>
                 </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vinculos" className="custom-scrollbar flex-1 overflow-y-auto pr-2">
            <div className="space-y-3">
              {isLoadingUsers ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : users?.length ? (
                users.map((item: any) => (
                  <div key={item.user.id} className="flex items-center justify-between rounded-3xl border border-border/50 bg-muted/30 p-5">
                    <div>
                      <p className="text-xs leading-none font-black uppercase italic">{item.user.nome}</p>
                      <p className="mt-1 text-[9px] font-bold text-muted-foreground uppercase">{item.user.role}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[9px] font-black text-primary uppercase">{item.progresso}%</span>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full border border-border/30 bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${item.progresso}%` }} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[30px] border-2 border-dashed bg-muted/5 py-20 text-center">
                  <p className="text-[10px] font-black text-muted-foreground/50 uppercase italic">Nenhum vínculo encontrado.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}