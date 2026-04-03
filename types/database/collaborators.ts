export interface Collaborator {
  id: string; // UUID do Auth
  nome: string;
  email: string;
  cpf: string;
  empresa_id: number;
  funcao: "COLABORADOR";
  created_at: string;
}

export interface CreateCollaboratorPayload {
  nome: string;
  cpf: string;
  empresa_id: number;
  email_empresa: string; // Necessário para gerar o e-mail automático
}