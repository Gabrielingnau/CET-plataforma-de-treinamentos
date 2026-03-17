import { createClient } from "@/lib/supabase/server"
import { UserRole } from "@/types/navigation/nav-item.type"

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return user.user_metadata.role as UserRole
}
