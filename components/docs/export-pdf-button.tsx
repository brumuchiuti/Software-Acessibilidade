"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

type ExportPdfButtonProps = {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ExportPdfButton({
  variant = "outline",
  size = "sm",
  className = "",
}: ExportPdfButtonProps) {
  const handleExport = () => {
    window.print()
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      className={`border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 hover:text-[#FFD700] print:hidden ${className}`}
    >
      <FileDown className="mr-2 h-4 w-4" />
      Exportar como PDF
    </Button>
  )
}
