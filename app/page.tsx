"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { supabase } from "@/lib/supabase/client"
import { AppLoading } from "@/components/shared/app-loading"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.replace("/login")
        return
      }

      router.replace("/treinamentos/visualizar")
    }

    checkSession()
  }, [router])

  return <AppLoading />
}
