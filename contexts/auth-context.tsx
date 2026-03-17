"use client"
import { createContext } from "react"
import { Session } from "@supabase/supabase-js"
import { User } from "@/types/database/users" // Seu tipo customizado

export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
})