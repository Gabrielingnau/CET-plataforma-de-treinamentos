"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ActivityChartData } from "@/types/dashboard/company/company"
import { CalendarIcon, Info } from "lucide-react"

// Se você estiver usando o DateRangePicker do Shadcn, importe-o aqui. 
// Caso contrário, use a estrutura abaixo para o layout.
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ActivityChartProps {
  data: ActivityChartData[]
  dateRange: { from: Date; to: Date }
  onDateChange: (range: { from: Date; to: Date }) => void
}

export function ActivityChart({ data, dateRange, onDateChange }: ActivityChartProps) {
  // Verifica se existe alguma atividade no período para mostrar o Empty State
  const hasActivity = data.some(d => d.atividades > 0)

  return (
    <Card className="rounded-3xl border-none bg-card/50 backdrop-blur-sm border border-border/40 overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full" />
          <div>
            <CardTitle className="font-black italic uppercase text-lg tracking-tighter leading-none">
              Fluxo de Atividade
            </CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground mt-1">
              Engajamento da unidade por período
            </CardDescription>
          </div>
        </div>

        {/* Seletor de Data Estilizado */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="rounded-xl border-border/40 bg-background/50 font-black italic uppercase text-[10px] h-9 gap-2 hover:bg-primary/10 hover:text-primary transition-all"
            >
              <CalendarIcon size={14} />
              {format(dateRange.from, "dd/MM")} - {format(dateRange.to, "dd/MM")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-3xl border-border/40" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range: any) => {
                if (range?.from && range?.to) {
                  onDateChange({ from: range.from, to: range.to })
                }
              }}
              locale={ptBR}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>

      <CardContent className="h-[300px] w-full pr-4 relative">
        {/* Overlay para Gráfico Vazio */}
        {!hasActivity && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/10 backdrop-blur-[1px] mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 border border-border/50 shadow-xl">
              <Info size={14} className="text-primary" />
              <p className="text-[10px] font-black uppercase italic text-muted-foreground">
                Sem registros de aula neste período
              </p>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAtividade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 9, fontWeight: '900', fill: 'var(--muted-foreground)'}}
              dy={10}
            />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                borderRadius: '16px', 
                border: '1px solid var(--primary)',
                fontSize: '10px',
                fontWeight: '900',
                textTransform: 'uppercase',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
              }}
              cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
              labelStyle={{ color: 'var(--primary)', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="atividades" 
              stroke={hasActivity ? "var(--primary)" : "var(--muted)"} 
              fillOpacity={1} 
              fill={hasActivity ? "url(#colorAtividade)" : "transparent"} 
              strokeWidth={4}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}