import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  href?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ className = "", href = "/dashboard", size = "md", showText = false }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-24 w-24",
    xxl: "h-32 w-32",
    xxxl: "h-40 w-40"
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }

  const logoElement = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <Image
          src="/logo-ifl-jovem-sp-square.png"
          alt="IFL Jovem SP Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold text-[#FFD700]`}>IFL Jovem SP</span>
          <span className="text-xs text-white/60">Instituto de Formação de Líderes</span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoElement}
      </Link>
    )
  }

  return logoElement
}
