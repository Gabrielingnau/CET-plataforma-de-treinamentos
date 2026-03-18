export interface CertificateTemplate {
  id: number;
  titulo: string;
  descricao: string;
  url_bucket: string;
  capa_url: string | null;
  palavras_chave: string[];
  ativo: boolean;
  created_at: string;
}