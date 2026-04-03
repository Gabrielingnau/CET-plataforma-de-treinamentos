import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description: string;
}

export function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden rounded-3xl border-none bg-card/50 backdrop-blur-md group hover:bg-card hover:translate-y-[-4px] transition-all duration-300 shadow-sm border border-border/40">
      {/* Efeito de brilho sutil no hover */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[10px] font-black uppercase italic text-muted-foreground tracking-[0.15em] leading-none">
          {title}
        </CardTitle>
        <div className="p-2.5 rounded-2xl bg-background/50 border border-border/50 group-hover:scale-110 group-hover:text-primary transition-all duration-300">
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col">
          <span className="text-4xl font-black italic uppercase tracking-tighter leading-none text-foreground">
            {value}
          </span>
          <p className="text-[9px] text-muted-foreground uppercase font-black tracking-wider mt-2 flex items-center gap-1.5 group-hover:text-primary/80 transition-colors">
            <span className="w-1 h-1 rounded-full bg-primary" />
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}