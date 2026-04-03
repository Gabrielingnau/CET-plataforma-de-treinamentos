// types/database/users.ts

export type UserRole = 'admin' | 'empresa' | 'colaborador';

export interface User {
  id: string; 
  nome: string | null;
  email: string | null;
  cpf: string | null;          // Opcional no banco/lógica
  telefone: string | null;     // Adicionado e opcional
  role: UserRole | null;
  empresa_id: number | null;   // Opcional
  created_at: string | null; 
  updated_at: string | null; 
  primeiro_login: boolean | null;
}

export type AuthProfileResponse = Pick<User, 'id' | 'role' | 'primeiro_login' | 'nome'>;

export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>;

export type UserUpdate = Partial<UserInsert>;