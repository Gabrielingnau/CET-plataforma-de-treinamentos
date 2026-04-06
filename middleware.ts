import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { data as navigationData } from "@/navigation/const-data"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const supabase = await createClient()

  // 1. ROTAS PÚBLICAS
  const publicRoutes = ["/login", "/callback", "/esqueceu-senha", "/unauthorized"]
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next()
  }

  // 2. VERIFICAÇÃO DE SESSÃO
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 3. BUSCA DE PERFIL (Gargalo de performance - essencial para o RBAC)
  const { data: userProfile } = await supabase
    .from("users")
    .select("role, primeiro_login")
    .eq("id", session.user.id)
    .single()

  if (!userProfile) {
    // Se logou mas não tem perfil, limpa a sessão e volta pro login
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = userProfile.role?.toLowerCase()
  const isPrimeiroLogin = userProfile.primeiro_login
  const isRecoveryMode = req.nextUrl.searchParams.get("type") === "recovery"

  // 4. LÓGICA DE REDIRECIONAMENTO PARA RESET
  if (path === "/resetar-senha") {
    if (isPrimeiroLogin || isRecoveryMode) return NextResponse.next()
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (isPrimeiroLogin && (role === "colaborador" || role === "empresa")) {
    if (path !== "/resetar-senha") {
      return NextResponse.redirect(new URL("/resetar-senha", req.url))
    }
  }

  // 5. REDIRECIONAMENTO INICIAL (Otimizado)
  if (path === "/") {
    const redirects: Record<string, string> = {
      admin: "/admin/painel",
      empresa: "/empresa/painel",
      colaborador: "/colaborador/treinamentos/meus-treinamentos",
    }
    const destination = redirects[role] || "/unauthorized"
    return NextResponse.redirect(new URL(destination, req.url))
  }

  // 6. FILTRO DE ACESSO (RBAC)
  const allRoutes = navigationData.flatMap((group) => 
    (group.items ?? []).map((item) => ({ url: item.url, roles: item.roles }))
  )

  const matchedRoute = allRoutes.find((route) => route.url !== "#" && path.startsWith(route.url))

  if (matchedRoute && !matchedRoute.roles?.includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}