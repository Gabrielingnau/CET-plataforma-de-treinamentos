import { Building2, CheckCircle2, ShieldCheck, UserCircle } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[60%_40%]">
      {/* Lado Esquerdo: Instruções e Branding */}
      <div className="relative hidden flex-col items-center justify-center bg-orange-600 p-12 text-white lg:flex">
        {/* Elemento Decorativo de Fundo */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-white p-2">
              <ShieldCheck className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Plataforma KYDORA
            </h1>
          </div>

          <h2 className="mb-6 text-2xl font-semibold">Instruções de Acesso</h2>

          <div className="space-y-6">
            {/* Card Empresa */}
            <div className="flex gap-4 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <Building2 className="h-10 w-10 shrink-0 text-orange-200" />
              <div>
                <h3 className="mb-1 text-lg font-bold">
                  Empresas e Administradores
                </h3>
                <p className="text-sm text-orange-50">
                  Utilize o e-mail cadastrado e a senha enviada pelo suporte. No
                  seu primeiro acesso, o sistema solicitará a criação de uma
                  senha definitiva.
                </p>
              </div>
            </div>

            {/* Card Funcionário */}
            <div className="flex gap-4 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <UserCircle className="h-10 w-10 shrink-0 text-orange-200" />
              <div>
                <h3 className="mb-1 text-lg font-bold">Área do Funcionário</h3>
                <p className="text-sm leading-relaxed text-orange-50">
                  Para o login, utilize o formato: <br />
                  <span className="rounded bg-orange-700 px-1 font-mono">
                    seu_cpf@gmail.com
                  </span>{" "}
                  <br />A senha inicial é o seu{" "}
                  <span className="font-bold italic underline">
                    CPF (apenas números)
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Alerta de Redirecionamento */}
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-orange-700/30 p-3 text-sm text-orange-100">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>
                Segurança: Você será redirecionado para atualizar sua senha no
                primeiro login.
              </span>
            </div>
          </div>

          <p className="mt-12 text-center text-xs tracking-widest text-orange-200 uppercase">
            Gestão de Treinamentos & Segurança do Trabalho
          </p>
        </div>
      </div>

      {/* Lado Direito: Formulário */}
      <div className="bg-background flex flex-col justify-center px-2 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
