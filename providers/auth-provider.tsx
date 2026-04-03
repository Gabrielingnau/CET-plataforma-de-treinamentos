"use client"

import { ReactNode, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { AuthContext } from "@/contexts/auth-context"
import { getCurrentUser } from "@/services/users/get-user"
import { User } from "@/types/database/users"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Session } from "@supabase/supabase-js"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)

  const fetchUser = async (): Promise<User | null> => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) return null

    return getCurrentUser()
  }

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchUser,
    enabled: !!session, // 🔥 só roda quando tiver sessão
    staleTime: 1000 * 60 * 5,
  })

  // 🔥 sincroniza sessão + invalida query
  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)

        // 🔥 força re-fetch do usuário
        queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [queryClient])

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        session,
        loading: isLoading || session === null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}