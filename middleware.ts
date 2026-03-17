import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { data as navigationData } from "@/navigation/const-data"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // 1. ROTAS QUE O MIDDLEWARE NÃO PODE TOCAR
  const publicRoutes = [
    "/login", 
    "/callback", 
    "/esqueceu-senha", 
    "/unauthorized"
  ]

  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next()
  }

  // 2. EXCEÇÃO PARA RESETAR SENHA
  if (path === "/resetar-senha") {
    return NextResponse.next()
  }

  // 3. VERIFICAÇÃO DE SESSÃO
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 4. VERIFICAÇÃO DE ROLE
  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (!userProfile) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 5. FILTRO DE ACESSO (Roles da Sidebar)
  const allRoutes = navigationData.flatMap((group) => [
    { url: group.url, roles: group.roles },
    ...(group.items ?? []).map((item) => ({ url: item.url, roles: item.roles })),
  ])

  const matchedRoute = allRoutes.find((route) => path.startsWith(route.url))

  if (matchedRoute && !matchedRoute.roles?.includes(userProfile.role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}