import Image from "next/image"
import { CheckCircle2, ShieldCheck, UserCircle, Building2 } from "lucide-react"

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[60%_40%]">

      {/* Lado Esquerdo: Instruções e Branding */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-orange-600 p-12 text-white">
        
        {/* Elemento Decorativo de Fundo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Plataforma KYDORA</h1>
          </div>

          <h2 className="text-2xl font-semibold mb-6">Instruções de Acesso</h2>
          
          <div className="space-y-6">
            {/* Card Empresa */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl flex gap-4">
              <Building2 className="w-10 h-10 shrink-0 text-orange-200" />
              <div>
                <h3 className="font-bold text-lg mb-1">Empresas e Administradores</h3>
                <p className="text-orange-50 text-sm">
                  Utilize o e-mail cadastrado e a senha enviada pelo suporte. No seu primeiro acesso, 
                  o sistema solicitará a criação de uma senha definitiva.
                </p>
              </div>
            </div>

            {/* Card Funcionário */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl flex gap-4">
              <UserCircle className="w-10 h-10 shrink-0 text-orange-200" />
              <div>
                <h3 className="font-bold text-lg mb-1">Área do Funcionário</h3>
                <p className="text-orange-50 text-sm leading-relaxed">
                  Para o login, utilize o formato: <br />
                  <span className="font-mono bg-orange-700 px-1 rounded">seu_cpf@gmail.com</span> <br />
                  A senha inicial é o seu <span className="font-bold italic underline">CPF (apenas números)</span>.
                </p>
              </div>
            </div>

            {/* Alerta de Redirecionamento */}
            <div className="flex items-center gap-2 text-orange-100 text-sm mt-4 bg-orange-700/30 p-3 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Segurança: Você será redirecionado para atualizar sua senha no primeiro login.</span>
            </div>
          </div>

          <p className="mt-12 text-orange-200 text-xs text-center uppercase tracking-widest">
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