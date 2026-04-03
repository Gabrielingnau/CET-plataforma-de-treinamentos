export interface CertificateTemplate {
  id: number;
  titulo: string;
  descricao: string | null;
  url_bucket: string;
  capa_url: string | null;
  palavras_chave: string[]; // O Postgres salva como jsonb, o TS lê como array aqui
  ativo: boolean;
  criado_por: string | null;
  created_at: string;
  updated_at: string | null;
}