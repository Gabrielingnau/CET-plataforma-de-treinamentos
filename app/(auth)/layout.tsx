import Image from "next/image"

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[65%_35%]">

      {/* Lado da imagem */}
      <div className="relative hidden lg:flex items-center justify-center bg-primary">

        <Image
          src="/teste-2.png"
          alt="Login"
          fill
          objectFit="cover"
          priority
        />

      </div>

      {/* Lado do formulário */}
      <div className="bg-background">
        {children}
      </div>

    </div>
  )
}