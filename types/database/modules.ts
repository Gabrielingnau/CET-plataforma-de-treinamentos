// types/module.ts

import { Lesson } from "./lessons"

export interface Module {
  id: number // int8 no Supabase vira number no TS
  training_id: number
  titulo: string
  descricao: string
  ordem: number
  created_at: string
  updated_at: string | null
}

export interface CreateModulePayload {
  training_id: number
  titulo: string
  descricao: string
  ordem: number
}

export interface ModuleData {
  id: number // int8 no Supabase vira number no TS
  training_id: number
  titulo: string
  descricao: string
  ordem: number
  created_at: string
  updated_at: string | null
  aulas: Lesson[]
}

export interface UpdateModulePayload extends Partial<CreateModulePayload> {}
