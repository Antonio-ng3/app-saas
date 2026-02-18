"use client"

import * as React from "react"
import Image from "next/image"
import {
  X,
  Download,
  Share2,
  Trash2,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { BeforeAfterSlider } from "@/components/before-after-slider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { PlushieGeneration } from "@/types/plush"

interface ImagePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  item: PlushieGeneration | null
  items: PlushieGeneration[]
  onNavigate: (direction: "prev" | "next") => void
  onDownload: (item: PlushieGeneration) => void
  onDelete: (item: PlushieGeneration) => void
  onShare: (item: PlushieGeneration) => void
  onFavorite: (item: PlushieGeneration) => void
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  item,
  items,
  onNavigate,
  onDownload,
  onDelete,
  onShare,
  onFavorite,
}: ImagePreviewModalProps) {
  const [showBeforeAfter, setShowBeforeAfter] = React.useState(false)
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const imageRef = React.useRef<HTMLDivElement>(null)

  // Reset state when item changes
  React.useEffect(() => {
    setShowBeforeAfter(false)
  }, [item?.id])

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        onNavigate("prev")
      } else if (e.key === "ArrowRight") {
        onNavigate("next")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNavigate])

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      setTouchStart(touch.clientX)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return

    const touch = e.changedTouches[0]
    if (!touch) return
    const touchEnd = touch.clientX
    const diff = touchStart - touchEnd

    // Swipe threshold of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onNavigate("next")
      } else {
        onNavigate("prev")
      }
    }

    setTouchStart(null)
  }

  if (!item) return null

  const currentIndex = items.findIndex((i) => i.id === item.id)
  const hasOriginal = !!item.originalUrl

  const handleDownload = () => onDownload(item)
  const handleDelete = () => onDelete(item)
  const handleShare = () => onShare(item)
  const handleFavorite = () => onFavorite(item)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl w-full h-[90vh] p-0 gap-0 border-none bg-transparent"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Navigation - Previous */}
        <button
          onClick={() => onNavigate("prev")}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Navigation - Next */}
        <button
          onClick={() => onNavigate("next")}
          disabled={currentIndex === items.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Próxima imagem"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Main Content */}
        <div
          ref={imageRef}
          className="relative w-full h-full bg-black/90"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {hasOriginal && showBeforeAfter ? (
            <BeforeAfterSlider
              beforeImage={item.originalUrl!}
              afterImage={item.url}
              beforeLabel="Original"
              afterLabel="Pelúcia"
              className="w-full h-full"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={item.url}
                alt="Pelúcia gerada"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1280px) 90vw, 1280px"
              />
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-center justify-between gap-4">
            {/* Toggle Before/After */}
            {hasOriginal && (
              <Button
                variant={showBeforeAfter ? "default" : "secondary"}
                onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {showBeforeAfter ? "Ver resultado" : "Comparar antes/depois"}
              </Button>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleFavorite}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                aria-label={item.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart className={cn("h-5 w-5", item.isFavorite && "fill-current")} />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                onClick={handleDownload}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                aria-label="Baixar imagem"
              >
                <Download className="h-5 w-5" />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                onClick={handleShare}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                aria-label="Compartilhar"
              >
                <Share2 className="h-5 w-5" />
              </Button>

              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                className="bg-red-500/80 hover:bg-red-500 text-white"
                aria-label="Excluir"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Image Info */}
          <div className="mt-4 text-white/80 text-sm">
            <p>
              {currentIndex + 1} de {items.length}
            </p>
            <p className="text-xs text-white/60">
              {new Date(item.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
