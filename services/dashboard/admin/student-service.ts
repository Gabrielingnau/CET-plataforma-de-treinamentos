import { supabase } from "@/lib/supabase/client";
import { StudentDossier, StudentTrainingDetail } from "@/types/dashboard/admin/student-dossier";

export const studentService = {
  /**
   * CAMADA 3: BUSCA DE DADOS (AUDITORIA)
   */
  async getStudentDossier(userId: string): Promise<StudentDossier> {
    // 1. Busca dados básicos do usuário
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select(`id, nome, email, companies(nome)`)
      .eq("id", userId)
      .single();

    if (userErr || !user) throw new Error("Usuário não encontrado");

    // 2. Busca treinamentos vinculados e a estrutura de módulos de cada um
    const { data: userTrainings, error: utErr } = await supabase
      .from("user_trainings")
      .select(`
        training_id, 
        progresso, 
        status,
        trainings (
          titulo, 
          carga_horaria, 
          max_exam_tentativas,
          modules (
            id,
            titulo
          )
        )
      `)
      .eq("user_id", userId);

    if (utErr) throw new Error("Erro ao buscar treinamentos");

    // 3. Busca tentativas de provas e quizzes do usuário
    const { data: exams } = await supabase.from("exam_attempts").select("*").eq("user_id", userId);
    const { data: quizes } = await supabase.from("quiz_attempts").select("*").eq("user_id", userId);

    // 4. Processamento da árvore de dados
    const processedTrainings: StudentTrainingDetail[] = (userTrainings || []).map((ut: any) => {
      const trainingExams = exams?.filter(e => e.training_id === ut.training_id) || [];
      
      // Mapeia os módulos do treinamento e verifica se o aluno já passou no quiz de cada um
      const modulesWithStatus = ut.trainings.modules.map((m: any) => ({
        id: m.id,
        titulo: m.titulo,
        concluido: quizes?.some(q => q.module_id === m.id && q.passou === true) || false
      }));

      return {
        training_id: ut.training_id,
        titulo: ut.trainings.titulo,
        carga_horaria: ut.trainings.carga_horaria,
        progresso: Number(ut.progresso),
        status: ut.status,
        max_tentativas: ut.trainings.max_exam_tentativas,
        tentativas_usadas: trainingExams.length,
        historico_provas: trainingExams.map(e => ({
          id: e.id,
          pontuacao: e.pontuacao,
          passou: e.passou,
          created_at: e.created_at
        })),
        modules: modulesWithStatus
      };
    });

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        empresa_nome: (user.companies as any)?.nome
      },
      trainings: processedTrainings
    };
  },

  /**
   * CAMADA 4: OVERRIDES (CONTROLE TOTAL)
   */

  // 1. RECONSTRUIR PROGRESSO (Aulas e Quizzes)
  async overrideApproveProgress(userId: string, trainingId: number) {
    const { data: modules, error: modErr } = await supabase
      .from("modules")
      .select("id, lessons(id)")
      .eq("training_id", trainingId);

    if (modErr || !modules) throw new Error("Erro ao mapear estrutura");

    // Marcar todas as lições como concluídas
    const allLessons = modules.flatMap(m => m.lessons);
    if (allLessons.length > 0) {
      const lessonUpserts = allLessons.map(l => ({
        user_id: userId,
        lesson_id: (l as any).id,
        completed: true
      }));
      await supabase.from("lesson_progress").upsert(lessonUpserts);
    }

    // Marcar todos os quizzes como aprovados
    const quizUpserts = modules.map(m => ({
      user_id: userId,
      module_id: m.id,
      passou: true,
      pontuacao: 100,
      respostas: { override: "Reconstrução Administrativa" }
    }));
    await supabase.from("quiz_attempts").upsert(quizUpserts);

    // Atualizar progresso no treinamento
    await supabase.from("user_trainings")
      .update({ 
        progresso: 100, 
        status: 'em_curso', 
        updated_at: new Date().toISOString() 
      })
      .eq("user_id", userId)
      .eq("training_id", trainingId);
  },

  // 2. FORÇAR APROVAÇÃO FINAL (Concluir Treinamento)
  async overridePassExam(userId: string, trainingId: number) {
    const { error: examErr } = await supabase
      .from("exam_attempts")
      .insert({
        user_id: userId,
        training_id: trainingId,
        passou: true,
        pontuacao: 100,
        respostas: { nota: "Atribuída via Painel Admin" }
      });

    if (examErr) throw examErr;

    await supabase.from("user_trainings")
      .update({ 
        status: 'concluido', 
        progresso: 100,
        data_conclusao: new Date().toISOString() 
      })
      .eq("user_id", userId)
      .eq("training_id", trainingId);
  },

  // 3. DESTRAVAR MÓDULO INDIVIDUAL (Upsert no Quiz)
  async overrideUnlockModule(userId: string, moduleId: number) {
    const { error } = await supabase
      .from("quiz_attempts")
      .upsert({
        user_id: userId,
        module_id: moduleId,
        passou: true,
        pontuacao: 100,
        respostas: { override: "Módulo Destravado Manualmente" }
      }, {
        onConflict: 'user_id,module_id' // Garante que não duplique se já existir uma tentativa falha
      });
    
    if (error) throw error;
  },

  // 4. RESET DE PROVAS
  async overrideResetExams(userId: string, trainingId: number) {
    const { error } = await supabase
      .from("exam_attempts")
      .delete()
      .eq("user_id", userId)
      .eq("training_id", trainingId);
    
    if (error) throw error;
  }
};