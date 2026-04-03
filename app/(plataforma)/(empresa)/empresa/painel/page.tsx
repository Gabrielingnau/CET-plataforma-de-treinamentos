"use client"

import { useState } from "react"
import { useCompanyDashboard } from "@/hooks/dashboard/company/use-company-dashboard"
import { useAuth } from "@/hooks/auth/use-auth"
import { Users, Trophy, Percent, Activity, Search, LayoutGrid } from "lucide-react"

// Componentes UI Customizados
import { StatCard } from "./_components/stat-card"
import { ActivityChart } from "./_components/activity-chart"
import { CollaboratorTable } from "./_components/collaborator-table"
import { CollaboratorDetailsSheet } from "./_components/details-sheet"
import { CertificatesModal } from "./_components/certificates-modal"

// Componentes Shadcn
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { UserTrainingDetail, UserCertificate } from "@/types/dashboard/company/company"

export default function CompanyDashboardPage() {
  const { user } = useAuth()
  const empresaId = Number(user?.empresa_id)
  
  // Pegamos os novos estados de data do Hook
  const { 
    stats, 
    chartData, 
    collaborators, 
    isLoading, 
    dateRange, 
    setDateRange, 
    actions 
  } = useCompanyDashboard(empresaId)

  // Estados para Controle de Busca e Overlays
  const [searchTerm, setSearchTerm] = useState("")
  const [details, setDetails] = useState<UserTrainingDetail[]>([])
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [certs, setCerts] = useState<UserCertificate[]>([])
  const [isCertsOpen, setIsCertsOpen] = useState(false)

  // Handlers de Ação On-Demand
  const handleViewDetails = async (userId: string) => {
    const data = await actions.getDetails(userId)
    setDetails(data)
    setIsDetailsOpen(true)
  }

  const handleViewCerts = async (userId: string) => {
    const data = await actions.getCertificates(userId)
    setCerts(data)
    setIsCertsOpen(true)
  }

  // Filtro de Busca Local
  const filteredCollaborators = collaborators.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cpf.includes(searchTerm)
  )

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black italic uppercase animate-pulse text-primary tracking-tighter text-sm">
          Sincronizando Ecossistema...
        </p>
      </div>
    )
  }

  return (
    <div className="sm:p-6 p-2 space-y-10 max-w-7xl mx-auto mb-12">
      
      {/* 1. INDICADORES DE ALTO NÍVEL (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Colaboradores" value={stats?.totalColaboradores ?? 0} icon={<Users className="text-primary" size={20} />} description="Total cadastrados" />
        <StatCard title="Conformidade" value={`${stats?.mediaProgressoUnidade ?? 0}%`} icon={<Percent className="text-primary" size={20} />} description="Média de progresso" />
        <StatCard title="Certificados" value={stats?.totalCertificados ?? 0} icon={<Trophy className="text-primary" size={20} />} description="Documentos emitidos" />
        <StatCard title="Ativos 24h" value={stats?.ativos24h ?? 0} icon={<Activity className="text-primary" size={20} />} description="Engajamento recente" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. GRÁFICO DE ENGAJAMENTO COM FILTRO DE DATA */}
        <div className="lg:col-span-2">
           <ActivityChart 
              data={chartData} 
              dateRange={dateRange} 
              onDateChange={setDateRange} 
           />
        </div>

        {/* 3. CARD INFORMATIVO */}
        <div className="bg-card/40 rounded-3xl p-6 border border-border/50 flex flex-col justify-center space-y-4 relative overflow-hidden group">
           <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
           <div className="p-3 bg-primary rounded-2xl w-fit shadow-lg shadow-primary/20">
              <LayoutGrid className="text-background" size={24} />
           </div>
           <h3 className="font-black italic uppercase text-xl leading-tight tracking-tighter">
             Gestão de Conformidade <br/> Normativa
           </h3>
           <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed max-w-[200px]">
             Acompanhe o status das NRs da sua unidade. Clique nos colaboradores para ver o progresso individual detalhado.
           </p>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* 4. SEÇÃO DE GESTÃO E TABELA */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
          <div>
            <h2 className="font-black italic uppercase text-3xl tracking-tighter text-foreground">Gestão de Alunos</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Controle de treinamento por CPF</p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
            <Input 
              placeholder="BUSCAR POR NOME OU CPF..." 
              className="pl-10 rounded-2xl bg-card border-border/40 focus-visible:ring-primary uppercase text-[10px] font-black italic h-11 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <CollaboratorTable 
          data={filteredCollaborators} 
          onViewDetails={handleViewDetails}
          onViewCerts={handleViewCerts}
        />
      </div>

      {/* 5. MODAIS E DRAWERS */}
      <CollaboratorDetailsSheet 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
        details={details} 
      />

      <CertificatesModal 
        open={isCertsOpen} 
        onOpenChange={setIsCertsOpen} 
        certificates={certs} 
      />
    </div>
  )
}