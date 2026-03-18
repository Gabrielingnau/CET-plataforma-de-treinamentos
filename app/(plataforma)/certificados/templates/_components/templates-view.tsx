"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, CheckCircle2, XCircle, LayoutGrid } from "lucide-react";
import { TemplateGrid } from "./template-grid";

interface Template {
  id: number;
  titulo: string;
  descricao: string;
  capa_url: string | null;
  url_bucket: string;
  ativo: boolean;
}

export function TemplatesView({ initialTemplates }: { initialTemplates: Template[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const filteredTemplates = initialTemplates.filter((t) => {
    const matchesName = t.titulo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "todos" ? true :
      filterStatus === "ativos" ? t.ativo : !t.ativo;
    return matchesName && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Barra de Filtros Estilizada */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar template por nome..."
            className="pl-10 h-11 bg-muted/20 border-muted-foreground/10 focus-visible:ring-primary"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border w-full md:w-auto">
          <Button
            variant={filterStatus === "todos" ? "secondary" : "ghost"}
            size="sm"
            className="flex-1 md:flex-none gap-2 h-9"
            onClick={() => setFilterStatus("todos")}
          >
            <LayoutGrid size={14} /> Todos
          </Button>
          <Button
            variant={filterStatus === "ativos" ? "secondary" : "ghost"}
            size="sm"
            className={`flex-1 md:flex-none gap-2 h-9 ${filterStatus === "ativos" ? "text-green-600" : ""}`}
            onClick={() => setFilterStatus("ativos")}
          >
            <CheckCircle2 size={14} /> Ativos
          </Button>
          <Button
            variant={filterStatus === "inativos" ? "secondary" : "ghost"}
            size="sm"
            className={`flex-1 md:flex-none gap-2 h-9 ${filterStatus === "inativos" ? "text-destructive" : ""}`}
            onClick={() => setFilterStatus("inativos")}
          >
            <XCircle size={14} /> Inativos
          </Button>
        </div>
      </div>

      {/* Grid com os dados filtrados */}
      {filteredTemplates.length > 0 ? (
        <TemplateGrid initialTemplates={filteredTemplates} />
      ) : (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl text-muted-foreground gap-2">
          <Filter size={40} className="opacity-20" />
          <p className="font-medium">Nenhum template encontrado para esses filtros.</p>
        </div>
      )}
    </div>
  );
}