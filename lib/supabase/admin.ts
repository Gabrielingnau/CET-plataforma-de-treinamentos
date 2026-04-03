import { createClient } from '@supabase/supabase-js'

// Use as variáveis de ambiente do seu .env.local
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Aquela chave secreta que começa com 's'
)