"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
  className?: string
  href?: string
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl"
  showText?: boolean
  /** Optional class for the text wrapper - useful for hiding in collapsed sidebars */
  textClassName?: string
}

export function Logo({ className = "", href = "/dashboard", size = "md", showText = false, textClassName = "" }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = !mounted
    ? "/logo-ifl-jovem-sp-square.png"
    : resolvedTheme === "dark"
      ? "/logo-dark.png"
      : "/logo-light.png"

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
    lg: "text-2xl",
    xl: "text-2xl",
    xxl: "text-3xl",
    xxxl: "text-3xl"
  }

  const logoElement = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <Image
          src={logoSrc}
          alt="IFL Jovem SP Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className={`flex flex-col shrink-0 min-w-0 ${textClassName}`}>
          <span className={`${textSizeClasses[size]} font-bold text-sidebar-primary truncate`}>IFL Jovem SP</span>
          <span className="text-xs text-sidebar-foreground/60 truncate">Instituto de Formação de Líderes</span>
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
