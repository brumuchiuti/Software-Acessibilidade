"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy, Check, Facebook, Twitter, Linkedin, MessageCircle, Instagram } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  eventTitle: string
  eventUrl: string
}

export function ShareButton({ eventTitle, eventUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `Confira este evento: ${eventTitle}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      toast.success("Link copiado para a área de transferência!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Erro ao copiar o link")
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: shareText,
          url: eventUrl,
        })
      } catch (error) {
        console.log("Share cancelled")
      }
    } else {
      handleCopyLink()
    }
  }

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(eventUrl)
    const encodedText = encodeURIComponent(shareText)
    
    let shareUrl = ""
    
    switch (platform) {
        case "facebook":
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
            break
        case "twitter":
            shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
            break
        case "linkedin":
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
            break
        case "whatsapp":
            shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
            break
        case "instagram":
            shareUrl = `https://www.instagram.com/ifljovemsp/`
            break
        }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="space-y-4">
      {/* Copy Link Button */}
      <Button
        onClick={handleCopyLink}
        className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Link Copiado!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copiar Link
          </>
        )}
      </Button>

      {/* Native Share (Mobile) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <Button
          onClick={handleNativeShare}
          variant="outline"
          className="w-full border-[#FFD700]/40 text-[#FFD700] bg-transparent hover:bg-[#FFD700]/10"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      )}

      {/* Social Media Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {/* <Button
          onClick={() => handleSocialShare("facebook")}
          variant="outline"
          size="sm"
          className="border-blue-600/40 text-blue-400 bg-transparent hover:bg-blue-600/10"
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button> */}

        <Button
          onClick={() => handleSocialShare("instagram")}
          variant="outline"
          size="sm"
          className="border-blue-400/40 text-pink-300 bg-transparent hover:bg-blue-400/10"
        >
          <Instagram className="mr-2 h-4 w-4" />
          Instagram
        </Button>

        <Button
          onClick={() => handleSocialShare("linkedin")}
          variant="outline"
          size="sm"
          className="border-blue-500/40 text-blue-400 bg-transparent hover:bg-blue-500/10"
        >
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>

        <Button
          onClick={() => handleSocialShare("whatsapp")}
          variant="outline"
          size="sm"
          className="border-green-500/40 text-green-400 bg-transparent hover:bg-green-500/10"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
      </div>

      {/* Link Display */}
      {/* <div className="bg-white/5 rounded-lg p-3 border border-white/10">
        <p className="text-xs text-white/60 mb-1">Link para compartilhar:</p>
        <p className="text-sm text-white/80 break-all font-mono">
          {eventUrl}
        </p>
      </div> */}
    </div>
  )
}
