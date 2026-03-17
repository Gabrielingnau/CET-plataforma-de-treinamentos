"use client"
import { ReactNode } from "react"

import { supabase } from "@/lib/supabase/client"
import { AuthContext } from "@/contexts/auth-context"
import { getCurrentUser } from "@/services/users/get-user"
import { User } from "@/types/database/users"
import { useQuery } from "@tanstack/react-query"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const fetchUser = async (): Promise<User | null> => {
    const session = (await supabase.auth.getSession()).data.session
    if (!session?.user) return null
    return getCurrentUser() // RLS garante que retorna só a própria linha
  }

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchUser,
    refetchOnWindowFocus: true, // revalida quando volta para a aba
    staleTime: 1000 * 60 * 5, // 5 minutos antes de refazer fetch
  })

  const _session = supabase.auth.getSession().then((r) => r.data.session) // opcional

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, session: null, loading: isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
