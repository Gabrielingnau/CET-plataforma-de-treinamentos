import { supabase } from "@/lib/supabase/client";
import { 
  CompanyDashboardData, 
  CollaboratorRow, 
  UserTrainingDetail, 
  UserCertificate 
} from "@/types/dashboard/company/company";
import { 
  subDays, 
  startOfDay, 
  endOfDay, 
  format, 
  eachDayOfInterval, 
  isWithinInterval 
} from "date-fns";
import { ptBR } from "date-fns/locale";

export const companyService = {
  async getDashboardData(
    empresaId: number, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<CompanyDashboardData> {
    // Define o intervalo: Se não houver datas, assume os últimos 7 dias
    const finalDate = endDate ? endOfDay(endDate) : endOfDay(new Date());
    const initialDate = startDate ? startOfDay(startDate) : startOfDay(subDays(finalDate, 6));

    const vinteQuatroHorasAtras = subDays(new Date(), 1).toISOString();

    // 1. Busca Colaboradores e seus vínculos
    const { data: users, error: userErr } = await supabase
      .from('users')
      .select(`
        id, nome, cpf, role,
        user_trainings (progresso),
        certificates (id),
        lesson_progress (created_at)
      `)
      .eq('empresa_id', empresaId)
      .in('role', ['colaborador', 'empresa']);

    if (userErr) throw userErr;

    // 2. Busca Atividade de Lições no intervalo de tempo selecionado
    // Buscamos apenas os registros criados entre as datas do filtro
    const userIds = users.map(u => u.id);
    const { data: activityRecords, error: activityErr } = await supabase
      .from('lesson_progress')
      .select('created_at')
      .in('user_id', userIds)
      .gte('created_at', initialDate.toISOString())
      .lte('created_at', finalDate.toISOString());

    if (activityErr) throw activityErr;

    // --- PROCESSAMENTO DE INDICADORES (KPIs) ---
    let somaProgressoGeral = 0;
    let totalCertificadosGeral = 0;
    let ativos24hCount = 0;

    const collaborators: CollaboratorRow[] = users.map(user => {
      const progs = user.user_trainings || [];
      const certs = user.certificates || [];
      const lessons = user.lesson_progress || [];

      // Média de progresso do aluno
      const media = progs.length > 0 
        ? progs.reduce((acc, curr) => acc + Number(curr.progresso), 0) / progs.length 
        : 0;

      somaProgressoGeral += media;
      totalCertificadosGeral += certs.length;

      // Atividade nas últimas 24h (independente do filtro de data do gráfico)
      const teveAtividade = lessons.some(l => l.created_at >= vinteQuatroHorasAtras);
      if (teveAtividade) ativos24hCount++;

      return {
        id: user.id,
        nome: user.nome || 'Sem Nome',
        cpf: user.cpf || '---',
        role: user.role as 'colaborador' | 'empresa',
        progresso_medio: Math.round(media),
        certificados_count: certs.length,
        status: media === 100 ? 'concluido' : media > 0 ? 'em_curso' : 'nao_iniciado'
      };
    });

    // --- PROCESSAMENTO DO GRÁFICO DINÂMICO ---
    const chartMap = new Map();
    
    // Gera todos os dias do intervalo para garantir que o gráfico não tenha "buracos"
    const diasNoIntervalo = eachDayOfInterval({
      start: initialDate,
      end: finalDate
    });

    diasNoIntervalo.forEach(dia => {
      const label = format(dia, 'dd/MM', { locale: ptBR });
      chartMap.set(label, 0);
    });

    // Preenche o Map com a contagem real vinda do banco
    activityRecords?.forEach(act => {
      const label = format(new Date(act.created_at), 'dd/MM', { locale: ptBR });
      if (chartMap.has(label)) {
        chartMap.set(label, chartMap.get(label) + 1);
      }
    });

    return {
      stats: {
        totalColaboradores: users.length,
        mediaProgressoUnidade: Math.round(somaProgressoGeral / (users.length || 1)),
        totalCertificados: totalCertificadosGeral,
        ativos24h: ativos24hCount
      },
      chartData: Array.from(chartMap, ([name, atividades]) => ({ name, atividades })),
      collaborators
    };
  },

  /**
   * Busca detalhada para o Drawer (Sheet)
   */
  async getCollaboratorDetails(userId: string): Promise<UserTrainingDetail[]> {
    const { data, error } = await supabase
      .from('user_trainings')
      .select(`
        progresso,
        status,
        data_conclusao,
        trainings ( titulo )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return data.map(item => ({
      titulo_treinamento: (item.trainings as any)?.titulo || 'Treinamento',
      progresso: Number(item.progresso),
      status: item.status as any,
      data_conclusao: item.data_conclusao
    }));
  },

  /**
   * Busca de certificados para o Modal
   */
  async getCollaboratorCertificates(userId: string): Promise<UserCertificate[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('id, nome_treinamento, data_conclusao, caminho_pdf_bucket, codigo')
      .eq('user_id', userId);

    if (error) throw error;
    return data as UserCertificate[];
  }
};